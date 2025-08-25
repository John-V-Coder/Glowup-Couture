import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  // 📍 Change 1: Add new state property for order statistics.
  orderStats: null, 
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/get`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- NEW: Thunk for updating order details (e.g., shipping info) ---
export const updateOrderForAdmin = createAsyncThunk(
  "/order/updateOrderForAdmin",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- NEW: Thunk for deleting an order ---
export const deleteOrderForAdmin = createAsyncThunk(
  "/order/deleteOrderForAdmin",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/delete/${orderId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 📍 Change 2: Add a new async thunk to fetch order statistics from the backend.
export const getOrderStatisticsForAdmin = createAsyncThunk(
  "/order/getOrderStatisticsForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/statistics`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          const orderIndex = state.orderList.findIndex(
            (order) => order._id === action.meta.arg.id
          );
          if (orderIndex !== -1) {
            state.orderList[orderIndex].orderStatus =
              action.meta.arg.orderStatus;
          }
          if (state.orderDetails?._id === action.meta.arg.id) {
            state.orderDetails.orderStatus = action.meta.arg.orderStatus;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          const updatedOrder = action.payload.data;
          const orderIndex = state.orderList.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (orderIndex !== -1) {
            state.orderList[orderIndex] = {
              ...state.orderList[orderIndex],
              ...updatedOrder,
            };
          }
          if (state.orderDetails?._id === updatedOrder._id) {
            state.orderDetails = { ...state.orderDetails, ...updatedOrder };
          }
        }
      })
      .addCase(updateOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          const deletedOrderId = action.meta.arg;
          state.orderList = state.orderList.filter(
            (order) => order._id !== deletedOrderId
          );
          if (state.orderDetails?._id === deletedOrderId) {
            state.orderDetails = null;
          }
        }
      })
      .addCase(deleteOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      // 📍 Change 3: Add new reducer cases to handle the order statistics data.
      .addCase(getOrderStatisticsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderStatisticsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderStats = action.payload.data.statistics;
        state.orderList = action.payload.data.recentOrders;
      })
      .addCase(getOrderStatisticsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderStats = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;