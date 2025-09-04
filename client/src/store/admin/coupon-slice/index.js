import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const computeIsActive = (validFrom, validUntil) => {
  const now = new Date();
  return (!validFrom || now >= new Date(validFrom)) && now <= new Date(validUntil);
};

const initialState = {
  couponList: [],
  eligibleUsers: null,
  couponStats: null,
  pagination: null,
  isLoading: false,
  error: null,

  // Loading states
  creatingCoupon: false,
  updatingCoupon: false,
  deletingCoupon: false,
  fetchingEligibleUsers: false,
  sendingCoupons: false,
  fetchingStats: false,

  // Error states
  createError: null,
  updateError: null,
  deleteError: null,
  eligibleUsersError: null,
  sendCouponsError: null,
  statsError: null
};

// Helper to handle errors safely
const extractErrorMessage = (error, fallback = "An error occurred") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

// Create coupon
export const createCoupon = createAsyncThunk(
  "adminCoupons/create",
  async (couponData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.post(`${API_URL}/api/admin/coupons/create`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to create coupon"));
    }
  }
);

// Fetch all coupons
export const fetchAllCoupons = createAsyncThunk(
  "adminCoupons/fetchAll",
  async (queryParams = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.get(`${API_URL}/api/admin/coupons/get`, {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to fetch coupons"));
    }
  }
);

// Update coupon
export const updateCoupon = createAsyncThunk(
  "adminCoupons/update",
  async ({ id, couponData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.put(`${API_URL}/api/admin/coupons/update/${id}`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to update coupon"));
    }
  }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
  "adminCoupons/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.delete(`${API_URL}/api/admin/coupons/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { ...data, deletedId: id };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to delete coupon"));
    }
  }
);

// Fetch eligible users
export const fetchEligibleUsers = createAsyncThunk(
  "adminCoupons/fetchEligibleUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.get(`${API_URL}/api/admin/coupons/eligible-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to fetch eligible users"));
    }
  }
);

// Send coupons
export const sendCouponsToUsers = createAsyncThunk(
  "adminCoupons/sendCouponsToUsers",
  async (sendData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.post(`${API_URL}/api/admin/coupons/send`, sendData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to send coupons"));
    }
  }
);

// Get coupon stats
export const getCouponStats = createAsyncThunk(
  "adminCoupons/getStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.get(`${API_URL}/api/admin/coupons/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to fetch coupon statistics"));
    }
  }
);

const adminCouponSlice = createSlice({
  name: "adminCoupons",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.eligibleUsersError = null;
      state.sendCouponsError = null;
      state.statsError = null;
    },
    clearCouponList: (state) => {
      state.couponList = [];
      state.pagination = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createCoupon.pending, (state) => {
        state.creatingCoupon = true;
        state.createError = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.creatingCoupon = false;
        const coupon = {
          ...action.payload.data,
          isActive: computeIsActive(action.payload.data.validFrom, action.payload.data.validUntil)
        };
        // Avoid duplicate if already in list
        if (!state.couponList.some(c => c._id === coupon._id)) {
          state.couponList.unshift(coupon);
        }
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.creatingCoupon = false;
        state.createError = action.payload;
      })

      // Fetch all
      .addCase(fetchAllCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure all coupons have computed isActive
        state.couponList = action.payload.data.map(c => ({
          ...c,
          isActive: computeIsActive(c.validFrom, c.validUntil)
        }));
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.couponList = [];
      })

      // Update
      .addCase(updateCoupon.pending, (state) => {
        state.updatingCoupon = true;
        state.updateError = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.updatingCoupon = false;
        const updatedCoupon = {
          ...action.payload.data,
          isActive: computeIsActive(action.payload.data.validFrom, action.payload.data.validUntil)
        };
        const index = state.couponList.findIndex(c => c._id === updatedCoupon._id);
        if (index !== -1) {
          state.couponList[index] = updatedCoupon;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.updatingCoupon = false;
        state.updateError = action.payload;
      })

      // Delete
      .addCase(deleteCoupon.pending, (state) => {
        state.deletingCoupon = true;
        state.deleteError = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.deletingCoupon = false;
        state.couponList = state.couponList.filter(c => c._id !== action.payload.deletedId);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.deletingCoupon = false;
        state.deleteError = action.payload;
      })

      // Eligible users
      .addCase(fetchEligibleUsers.pending, (state) => {
        state.fetchingEligibleUsers = true;
        state.eligibleUsersError = null;
      })
      .addCase(fetchEligibleUsers.fulfilled, (state, action) => {
        state.fetchingEligibleUsers = false;
        state.eligibleUsers = action.payload.data;
      })
      .addCase(fetchEligibleUsers.rejected, (state, action) => {
        state.fetchingEligibleUsers = false;
        state.eligibleUsersError = action.payload;
      })

      // Send coupons
      .addCase(sendCouponsToUsers.pending, (state) => {
        state.sendingCoupons = true;
        state.sendCouponsError = null;
      })
      .addCase(sendCouponsToUsers.fulfilled, (state) => {
        state.sendingCoupons = false;
      })
      .addCase(sendCouponsToUsers.rejected, (state, action) => {
        state.sendingCoupons = false;
        state.sendCouponsError = action.payload;
      })

      // Stats
      .addCase(getCouponStats.pending, (state) => {
        state.fetchingStats = true;
        state.statsError = null;
      })
      .addCase(getCouponStats.fulfilled, (state, action) => {
        state.fetchingStats = false;
        state.couponStats = action.payload.data;
      })
      .addCase(getCouponStats.rejected, (state, action) => {
        state.fetchingStats = false;
        state.statsError = action.payload;
      });
  }
});

export const { clearErrors, clearCouponList } = adminCouponSlice.actions;
export default adminCouponSlice.reducer;
