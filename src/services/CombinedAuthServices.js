import axios from "axios";
import Cookies from "js-cookie";

// Configuration
const config = {
  drupalBaseUrl: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET,
  sessionLoginEndpoint: "/user/login?_format=json",
  oauthAuthorizeEndpoint: "/oauth/authorize",
  oauthTokenEndpoint: "/oauth/token",
  userInfoEndpoint: "/oauth/userinfo",
  logoutEndpoint: "/user/logout",
  cookiePrefix: "drupal_auth_",
  redirectPath: "/auth/callback", // Path for the OAuth callback
  tokenExpiryBuffer: 300, // 5 minutes in seconds
};

export const CombinedAuthServices = {
  /**
   * First step of the login flow:
   * Authenticate with username/password to get CSRF/logout tokens,
   * then redirect to OAuth authorize endpoint
   */
  async initiateLogin(username, password) {
    try {
      // Step 1: Authenticate with username/password
      const sessionResult = await this.sessionLogin(username, password);
      
      if (!sessionResult.csrf_token || !sessionResult.logout_token) {
        throw new Error('Invalid session login response');
      }
      
      // Store login tokens in cookies to be used after redirect
      Cookies.set('drupal_login_initiated', 'true', {
        sameSite: 'strict',
        secure: window.location.protocol === 'https:'
      });
      
      // Step 2: Redirect to OAuth code flow
      // Will redirect browser to callback URL with code
      const redirectUri = `${window.location.origin}${config.redirectPath}`;
      this.getOAuthCode(redirectUri);
      
      // The function doesn't actually return as we redirect the browser
      return true;
    } catch (error) {
      console.error("Login initiation failed:", error);
      
      // Clean up any partial auth state
      this.clearAllAuthCookies();
      
      throw error;
    }
  },
  
  /**
   * Session login with username/password to get CSRF and logout tokens
   */
  async sessionLogin(username, password) {
    try {
      const response = await axios.post(
        `${config.drupalBaseUrl}${config.sessionLoginEndpoint}`, 
        { name: username, pass: password },
        { withCredentials: true }
      );

      if (!response.data || !response.data.csrf_token) {
        throw new Error('Invalid login response');
      }
      
      // Store CSRF token for future requests
      Cookies.set('drupal_csrf_token', response.data.csrf_token, {
        sameSite: 'strict',
        secure: window.location.protocol === 'https:'
      });
      
      // Store logout token for logout functionality
      if (response.data.logout_token) {
        Cookies.set('drupal_logout_token', response.data.logout_token, {
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Session login failed:', error);
      throw error;
    }
  },
  
  /**
   * Second step: Use authenticated session to get OAuth code
   * This redirects the browser and should be handled by the callback route
   */
  getOAuthCode(redirectUri) {
    try {
      // Generate state for security
      const state = this.generateRandomState();
      Cookies.set(`${config.cookiePrefix}state`, state, { sameSite: "strict" });
      
      // Get CSRF token
      const csrfToken = Cookies.get('drupal_csrf_token');
      if (!csrfToken) {
        throw new Error('No CSRF token available for OAuth flow');
      }
      
      // Store the CSRF token for use after OAuth redirect
      Cookies.set(`${config.cookiePrefix}csrf_token`, csrfToken, { 
        sameSite: "strict",
        secure: window.location.protocol === 'https:'
      });
      
      // Build authorization URL
      const authUrl = new URL(`${config.drupalBaseUrl}${config.oauthAuthorizeEndpoint}`);
      authUrl.searchParams.append("client_id", config.clientId);
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("scope", "oauth_scope");
      
      // Redirect to the authorization endpoint
      // This will use the authenticated session cookie and redirect back with code
      window.location.href = authUrl.toString();
      
      // Function doesn't actually return - browser will redirect
      return null;
    } catch (error) {
      console.error('Failed to initiate OAuth code flow:', error);
      throw error;
    }
  },
  
  /**
   * Handle the OAuth callback - verify state and exchange code for tokens
   */
  async handleCallback(code, state) {
    try {
      // Verify state
      const storedState = Cookies.get(`${config.cookiePrefix}state`);
      if (!storedState || storedState !== state) {
        throw new Error('OAuth state verification failed');
      }
      
      // Exchange code for tokens
      const redirectUri = `${window.location.origin}${config.redirectPath}`;
      const tokenData = await this.exchangeCodeForTokens(code, redirectUri);
      
      // Clean up state cookie
      Cookies.remove(`${config.cookiePrefix}state`);
      Cookies.remove('drupal_login_initiated');
      
      return tokenData;
    } catch (error) {
      console.error('OAuth callback handling failed:', error);
      this.clearAllAuthCookies();
      throw error;
    }
  },
  
  /**
   * Exchange OAuth code for tokens
   */
  async exchangeCodeForTokens(code, redirectUri) {
    try {
      const response = await axios.post(
        `${config.drupalBaseUrl}${config.oauthTokenEndpoint}`,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: code,
          redirect_uri: redirectUri,
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
  
  /**
   * Helper function to generate random state
   */
  generateRandomState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  },
  
  /**
   * Save tokens to cookies
   */
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
  
  /**
   * Get access token from cookies
   */
  getAccessToken() {
    return Cookies.get(`${config.cookiePrefix}access_token`) || null;
  },
  
  /**
   * Check if user is authenticated
   */
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
  
  /**
   * Check if login flow has been initiated but not completed
   */
  isLoginInitiated() {
    return !!Cookies.get('drupal_login_initiated');
  },
  
  /**
   * Get user information using OAuth token
   */
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
      console.error('Error fetching user info:', error);
      throw error;
    }
  },
  
  /**
   * Logout the user
   * - Uses logout token to invalidate session
   * - Clears all auth cookies
   */
  async logout() {
    const logoutToken = Cookies.get('drupal_logout_token');
    
    try {
      // Server-side logout using logout token
      if (logoutToken) {
        await axios.get(`${config.drupalBaseUrl}${config.logoutEndpoint}`, {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': logoutToken
          }
        });
      }
    } catch (error) {
      console.error('Server logout failed:', error);
    } finally {
      // Clear all auth cookies
      this.clearAllAuthCookies();
    }
  },
  
  /**
   * Clear all authentication cookies
   */
  clearAllAuthCookies() {
    // Clear session cookies
    Cookies.remove('drupal_session');
    Cookies.remove('drupal_csrf_token');
    Cookies.remove('drupal_logout_token');
    Cookies.remove('drupal_login_initiated');
    
    // Clear OAuth cookies
    Object.keys(Cookies.get())
      .filter(name => name.startsWith(config.cookiePrefix))
      .forEach(name => Cookies.remove(name));
  }
};