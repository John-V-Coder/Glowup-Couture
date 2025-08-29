import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mergeGuestCart } from "../shop/cart-slice";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null, // JWT token for authenticated user
  error: null,
  message: null,
};

// Async thunk for requesting a login code via email
export const requestLoginCode = createAsyncThunk(
  "auth/requestLoginCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/request-login-code`,
        { email }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to request login code.";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk for verifying the login code and authenticating the user
export const verifyLoginCode = createAsyncThunk(
  "auth/verifyLoginCode",
  async ({ email, code }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-login-code`,
        { email, code }
      );

      // If login successful, merge guest cart with user cart (if applicable)
      if (response.data.success && response.data.user?.id) {
        dispatch(mergeGuestCart(response.data.user.id));
      }

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Code verification failed. Please try again.";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // No server-side logout is strictly needed for JWT, just clear client-side token.
      // However, if you have any server-side session invalidation, keep this call.
      // For a purely token-based system, a server call for logout is often redundant.
      // We'll keep it for consistency with your previous structure, but it can be removed
      // if your backend logout endpoint simply responds with success without complex logic.
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // If no token, no need to call backend
      if (!token) {
        return { success: true, message: "Logged out successfully locally." };
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          headers: token
            ? {
                Authorization: `Bearer ${JSON.parse(token)}`,
              }
            : {},
        }
      );
      return response.data;
    } catch (error) {
      // Even if server logout fails, clear client state to prevent being stuck logged in
      const message = error.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk to check user's authentication status using a stored token
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const sessionToken = sessionStorage.getItem("token");
      const localToken = localStorage.getItem("token");
      const storedToken = sessionToken || localToken;

      if (!storedToken || storedToken === "null" || storedToken === "undefined") {
        return rejectWithValue({ message: "No authentication token found." });
      }

      // If token exists, make the API call to validate it
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(storedToken)}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      return response.data;
    } catch (error) {
      // Clear token from storage on any authentication failure
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      const message =
        error.response?.data?.message ||
        error.message ||
        "Authentication check failed. Please log in again.";
      return rejectWithValue({ message });
    }
  }
);

// Slice definition
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) {
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      } else {
        localStorage.removeItem("token");
      }
    },
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.message = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearAllMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request Login Code cases
      .addCase(requestLoginCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestLoginCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(requestLoginCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to send login code.";
      })

      // Verify Login Code cases (main login step)
      .addCase(verifyLoginCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyLoginCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", JSON.stringify(action.payload.token));
          sessionStorage.setItem("token", JSON.stringify(action.payload.token));
          state.error = null;
          state.message = action.payload.message;
        } else {
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          state.error = action.payload.message;
        }
      })
      .addCase(verifyLoginCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message;
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })

      // Check Auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
        const sessionToken = sessionStorage.getItem("token");
        const localToken = localStorage.getItem("token");
        state.token = action.payload.success ? JSON.parse(sessionToken || localToken) : null;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message;
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })

      // Logout User cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.message = action.payload.message;
        state.error = null;
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || "Server logout failed, but you have been logged out locally.";
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      });
  },
});

export const {
  setAuth,
  resetAuthState,
  clearMessage,
  clearError,
  setLoadingFalse,
  setLoading,
  clearAllMessages,
} = authSlice.actions;

export default authSlice.reducer;