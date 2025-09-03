import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  availableCoupons: [],
  appliedCoupon: null,
  discountAmount: 0,
  isLoading: false,
  validatingCoupon: false,
  error: null,
  validationError: null
};

// Validate coupon
export const validateCoupon = createAsyncThunk(
  "shopCoupons/validate",
  async ({ code, userId, orderAmount, cartItems }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/coupons/validate`,
        { code, userId, orderAmount, cartItems }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to validate coupon");
    }
  }
);

// Get available coupons for user
export const getAvailableCoupons = createAsyncThunk(
  "shopCoupons/getAvailable",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/coupons/available/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch available coupons");
    }
  }
);

const shopCouponSlice = createSlice({
  name: "shopCoupons",
  initialState,
  reducers: {
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.validationError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.validationError = null;
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload.coupon;
      state.discountAmount = action.payload.discount.amount;
    }
  },
  extraReducers: (builder) => {
    builder
      // Validate coupon
      .addCase(validateCoupon.pending, (state) => {
        state.validatingCoupon = true;
        state.validationError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validatingCoupon = false;
        state.appliedCoupon = action.payload.data.coupon;
        state.discountAmount = action.payload.data.discount.amount;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.validatingCoupon = false;
        state.validationError = action.payload;
        state.appliedCoupon = null;
        state.discountAmount = 0;
      })

      // Get available coupons
      .addCase(getAvailableCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAvailableCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableCoupons = action.payload.data;
      })
      .addCase(getAvailableCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.availableCoupons = [];
      });
  }
});

export const { clearAppliedCoupon, clearErrors, setAppliedCoupon } = shopCouponSlice.actions;
export default shopCouponSlice.reducer;