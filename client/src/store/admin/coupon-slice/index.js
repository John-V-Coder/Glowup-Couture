import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  couponList: [],
  couponStats: null,
  pagination: null,
  isLoading: false,
  error: null,
  
  // Specific loading states
  creatingCoupon: false,
  updatingCoupon: false,
  deletingCoupon: false,
  autoAssigning: false,
  fetchingStats: false,
  
  // Specific errors
  createError: null,
  updateError: null,
  deleteError: null,
  autoAssignError: null,
  statsError: null
};

// Create new coupon
export const createCoupon = createAsyncThunk(
  "adminCoupons/create",
  async (couponData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/coupons/create`,
        couponData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create coupon");
    }
  }
);

// Fetch all coupons
export const fetchAllCoupons = createAsyncThunk(
  "adminCoupons/fetchAll",
  async (queryParams = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/coupons/get`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: queryParams
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
    }
  }
);

// Update coupon
export const updateCoupon = createAsyncThunk(
  "adminCoupons/update",
  async ({ id, couponData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/coupons/update/${id}`,
        couponData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update coupon");
    }
  }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
  "adminCoupons/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/coupons/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
    }
  }
);

// Auto-assign coupons
export const autoAssignCoupons = createAsyncThunk(
  "adminCoupons/autoAssign",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/coupons/auto-assign`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to auto-assign coupons");
    }
  }
);

// Get coupon statistics
export const getCouponStats = createAsyncThunk(
  "adminCoupons/getStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/coupons/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch coupon statistics");
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
      state.autoAssignError = null;
      state.statsError = null;
    },
    clearCouponList: (state) => {
      state.couponList = [];
      state.pagination = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create coupon
      .addCase(createCoupon.pending, (state) => {
        state.creatingCoupon = true;
        state.createError = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.creatingCoupon = false;
        state.couponList.unshift(action.payload.data);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.creatingCoupon = false;
        state.createError = action.payload;
      })

      // Fetch coupons
      .addCase(fetchAllCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.couponList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.couponList = [];
      })

      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.updatingCoupon = true;
        state.updateError = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.updatingCoupon = false;
        const index = state.couponList.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) {
          state.couponList[index] = action.payload.data;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.updatingCoupon = false;
        state.updateError = action.payload;
      })

      // Delete coupon
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

      // Auto-assign coupons
      .addCase(autoAssignCoupons.pending, (state) => {
        state.autoAssigning = true;
        state.autoAssignError = null;
      })
      .addCase(autoAssignCoupons.fulfilled, (state, action) => {
        state.autoAssigning = false;
        // Refresh coupon list after auto-assignment
      })
      .addCase(autoAssignCoupons.rejected, (state, action) => {
        state.autoAssigning = false;
        state.autoAssignError = action.payload;
      })

      // Get stats
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