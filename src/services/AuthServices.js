import axios from "axios";
import Cookies from "js-cookie";

// Configuration
const config = {
  drupalBaseUrl: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET,
  logoutEndpoint: "/user/logout",
  sessionLoginEndpoint: "/user/login?_format=json",
  sessionTokenEndpoint: "/session/token",
  cookiePrefix: "drupal_auth_",
  tokenExpiryBuffer: 300, // 5 minutes in seconds
};

export const SessionAuth = {
  isAuthenticated() {
    return !!Cookies.get('drupal_session');
  },

  async login(username, password) {
    try {
      const response = await axios.post(
        `${config.drupalBaseUrl}${config.sessionLoginEndpoint}`, 
        { name: username, pass: password },
        { 
          withCredentials: true
        }
      );

      if (response.data && response.data.csrf_token) {
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
      }
      
      throw new Error('Invalid login response');
    } catch (error) {
      console.error('Session login failed:', error);
      throw error;
    }
  },

  async getUserInfo() {
    try {
      const response = await fetch(`${config.drupalBaseUrl}/user/me?_format=json`, {
        credentials: 'include' // Important for session cookies
      });
      
      if (!response.ok) throw new Error('Failed to get user info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user with session:', error);
      throw error;
    }
  },

  async refreshCsrfToken() {
    try {
      const response = await axios.get(
        `${config.drupalBaseUrl}${config.sessionTokenEndpoint}`,
        { withCredentials: true }
      );
      
      if (response.data) {
        // Store new CSRF token
        Cookies.set('drupal_csrf_token', response.data, {
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        
        return response.data;
      }
      
      throw new Error('Failed to get CSRF token');
    } catch (error) {
      console.error('CSRF token refresh failed:', error);
      throw error;
    }
  },

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
      // Clear session cookies regardless of server response
      Cookies.remove('drupal_session');
      Cookies.remove('drupal_csrf_token');
      Cookies.remove('drupal_logout_token');
    }
  },

  createAuthenticatedClient() {
    const client = axios.create({
      baseURL: config.drupalBaseUrl,
      withCredentials: true
    });

    // Add request interceptor to add CSRF token
    client.interceptors.request.use(
      async (config) => {
        const csrfToken = Cookies.get('drupal_csrf_token');
        if (csrfToken && (config.method === 'post' || config.method === 'put' || 
            config.method === 'patch' || config.method === 'delete')) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle CSRF token issues
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Refresh CSRF token
            await this.refreshCsrfToken();
            // Retry the original request with new CSRF token
            originalRequest.headers['X-CSRF-Token'] = Cookies.get('drupal_csrf_token');
            return axios(originalRequest);
          } catch (csrfError) {
            return Promise.reject(csrfError);
          }
        }

        return Promise.reject(error);
      }
    );

    return client;
  }
};