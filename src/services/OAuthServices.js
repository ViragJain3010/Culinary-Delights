import axios from "axios";
import Cookies from "js-cookie";

const config = {
  drupalBaseUrl: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET,
  tokenEndpoint: "/oauth/token",
  authorizeEndpoint: "/oauth/authorize",
  userInfoEndpoint: "/oauth/userinfo",
  logoutEndpoint: "/user/logout",
  cookiePrefix: "drupal_auth_",
  tokenExpiryBuffer: 300, // 5 minutes in seconds
};

export const OAuthServices = {
  initiateAuthFlow(redirectUri, scope = "oauth_scope") {
    const state = this.generateRandomState();
    
    // Store state in cookie for verification
    Cookies.set(`${config.cookiePrefix}state`, state, { sameSite: "strict" });

    // Construct the authorization URL
    const authUrl = new URL(`${config.drupalBaseUrl}${config.authorizeEndpoint}`);
    authUrl.searchParams.append("client_id", config.clientId);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_url", redirectUri);
    authUrl.searchParams.append("scope", scope);
    authUrl.searchParams.append("state", state);

    return authUrl.toString();
  },

  generateRandomState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  },

  async exchangeCodeForTokens(code, redirectUri = window.location.origin) {
    try {
      const response = await axios.post(
        `${config.drupalBaseUrl}${config.tokenEndpoint}`,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: code,
          redirect_url: redirectUri,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data && response.data.access_token) {
        this.saveTokens(response.data);
        return response.data;
      }

      throw new Error("Invalid token response");
    } catch (error) {
      console.error("Token exchange failed:", error);
      throw error;
    }
  },

  verifyState(receivedState) {
    const storedState = Cookies.get(`${config.cookiePrefix}state`);
    if (!storedState || storedState !== receivedState) {
      return false;
    }

    // Clean up the state cookie
    Cookies.remove(`${config.cookiePrefix}state`);
    return true;
  },

  saveTokens(tokenData) {
    const { access_token, refresh_token, expires_in } = tokenData;

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Store tokens securely in cookies
    Cookies.set(`${config.cookiePrefix}access_token`, access_token, {
      expires: expiresAt,
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });

    if (refresh_token) {
      // Refresh tokens typically have longer expiry - use 30 days as fallback
      const refreshExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      Cookies.set(`${config.cookiePrefix}refresh_token`, refresh_token, {
        expires: refreshExpiry,
        sameSite: "strict",
        secure: window.location.protocol === "https:",
      });
    }

    // Store token expiry time for easy reference
    Cookies.set(`${config.cookiePrefix}expires_at`, expiresAt.getTime(), {
      expires: expiresAt,
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });
  },

  getAccessToken() {
    return Cookies.get(`${config.cookiePrefix}access_token`) || null;
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;

    const expiresAt = parseInt(
      Cookies.get(`${config.cookiePrefix}expires_at`) || "0",
      10
    );

    // Add buffer to prevent edge cases where token expires during request
    return Date.now() < expiresAt - config.tokenExpiryBuffer * 1000;
  },

  async getUserInfo() {
    try {
      const token = this.getAccessToken();
      if (!token) throw new Error("No access token");
      
      const response = await fetch(`${config.drupalBaseUrl}${config.userInfoEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to get user info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user with token:', error);
      throw error;
    }
  },

  async refreshAccessToken() {
    const refreshToken = Cookies.get(`${config.cookiePrefix}refresh_token`);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${config.drupalBaseUrl}${config.tokenEndpoint}`,
        new URLSearchParams({
          grant_type: "refresh_token",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data && response.data.access_token) {
        this.saveTokens(response.data);
        return response.data;
      }

      throw new Error("Invalid token response");
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.logout(); // Clear tokens on refresh failure
      throw error;
    }
  },

  async logout() {
    const token = this.getAccessToken();

    // Clear all OAuth authentication cookies
    Object.keys(Cookies.get())
      .filter((name) => name.startsWith(config.cookiePrefix))
      .forEach((name) => Cookies.remove(name));

    // Perform server-side logout if we have a token
    if (token) {
      try {
        await axios.get(`${config.drupalBaseUrl}${config.logoutEndpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Server logout failed:", error);
        // Continue with client-side logout even if server logout fails
      }
    }
  },

  createAuthenticatedClient() {
    const client = axios.create({
      baseURL: config.drupalBaseUrl,
    });

    // Add request interceptor to add authentication headers
    client.interceptors.request.use(
      async (config) => {
        try {
          const token = this.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Failed to add token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle authentication issues
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If token is expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshAccessToken();
            // Retry the original request with new token
            const token = this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return client;
  }
};