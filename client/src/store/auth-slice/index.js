import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mergeGuestCart } from "../shop/cart-slice"; // Assuming this path is correct

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null, // JWT token for authenticated user
  resetToken: null, // Temporary token received after code verification, used for final password reset
  error: null,
  message: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
        // withCredentials is typically not needed for JWT in header, unless you're using httpOnly cookies alongside
      );

      // On successful registration, dispatch the loginUser thunk to log the user in immediately.
      if (response.data.success) {
        dispatch(loginUser(formData));
      }

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Registration failed";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
        // withCredentials is typically not needed for JWT in header
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
        "Login failed. Please check your credentials and try again.";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          headers: token ? {
            Authorization: `Bearer ${JSON.parse(token)}`
          } : {}
        }
      );
      return response.data;
    } catch (error) {
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

// New async thunk to request a password reset email with a code
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/request-password-reset`,
        { email }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Could not connect to the server. Please try again later.";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk to verify the password reset code
export const verifyResetCode = createAsyncThunk(
  "auth/verifyResetCode",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-reset-code`,
        { email, code }
      );
      return response.data; // This response should contain a temporary resetToken
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Code verification failed. Please try again.";
      return rejectWithValue({ message });
    }
  }
);

// Async thunk to finalize password reset using the temporary resetToken
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }, { getState, rejectWithValue }) => {
    try {
      // Get token from Redux if not provided
      if (!resetToken) {
        resetToken = getState().auth.resetToken;
      }

      if (!resetToken) {
        return rejectWithValue({ message: "No valid reset token found. Please verify your code again." });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Could not connect to the server. Please try again later.";
      return rejectWithValue({ message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // A more generic setAuth reducer if you need to manually set auth state
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
    // Reducer to manually clear auth state, useful for logout and expired tokens
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.resetToken = null; // Clear resetToken as well
      state.isLoading = false; // Also set loading to false
      state.error = null; // Clear any errors
      state.message = null; // Clear any messages
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
    // Action to clear any success messages
    clearMessage: (state) => {
      state.message = null;
    },
    // Action to clear any error messages
    clearError: (state) => {
      state.error = null;
    },
    // NEW: Action to set loading to false (for your App.jsx)
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
    // NEW: More granular loading control
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // NEW: Clear all messages and errors at once
    clearAllMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message; // Message from successful registration
        state.error = null; // Clear any previous errors
        // Actual login state handled by loginUser.fulfilled due to dispatch
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Login User cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", JSON.stringify(action.payload.token));
          sessionStorage.setItem("token", JSON.stringify(action.payload.token));
          state.error = null; // Clear any previous errors
        } else {
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          state.error = action.payload.message; // Display specific login error
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
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
        // Re-set token from storage as checkAuth doesn't return it
        const sessionToken = sessionStorage.getItem('token');
        const localToken = localStorage.getItem('token');
        state.token = action.payload.success ? JSON.parse(sessionToken || localToken) : null;
        state.error = null; // Clear any previous errors
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message;
        localStorage.removeItem("token"); // Ensure token is cleared on rejection
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
        state.resetToken = null; // Clear reset token on logout
        state.message = action.payload.message;
        state.error = null; // Clear any errors
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if server logout fails, clear client state to prevent being stuck logged in
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.resetToken = null; // Clear reset token on logout attempt
        state.error = action.payload?.message || "Server logout failed, but you have been logged out locally.";
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })

      // Password Reset Request cases (send code)
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to request password reset code.";
      })

      // Verify Reset Code cases
      .addCase(verifyResetCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.resetToken = action.payload.resetToken; // Store the temporary resetToken from backend
        state.error = null;
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Invalid or expired verification code.";
        state.resetToken = null; // Clear any partial or invalid reset token
      })

      // Final Password Reset cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.resetToken = null; // Clear resetToken after successful password change
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to reset password.";
        state.resetToken = null; // Clear resetToken on failed password change
      });
  },
});

export const {
  setAuth,
  resetAuthState,
  clearMessage,
  clearError,
  setLoadingFalse, // NEW: Export the missing action
  setLoading, // NEW: Export granular loading control
  clearAllMessages, // NEW: Clear all messages at once
} = authSlice.actions;

export default authSlice.reducer;