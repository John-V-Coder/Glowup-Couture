import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false, // It's good practice to have isLoading in the initial state
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
      // NOTE: This assumes your `/update/:id` endpoint can handle other fields besides status.
      // If you have a different endpoint for updating shipping info, change the URL here.
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
      // --- NEW: Reducers for updating order info ---
      .addCase(updateOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
            // Update both the main list and the detailed view for consistency
            const updatedOrder = action.payload.data;
            const orderIndex = state.orderList.findIndex(order => order._id === updatedOrder._id);
            if (orderIndex !== -1) {
                state.orderList[orderIndex] = { ...state.orderList[orderIndex], ...updatedOrder };
            }
            if (state.orderDetails?._id === updatedOrder._id) {
                state.orderDetails = { ...state.orderDetails, ...updatedOrder };
            }
        }
      })
      .addCase(updateOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      // --- NEW: Reducers for deleting an order ---
      .addCase(deleteOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Remove the deleted order from the list
          const deletedOrderId = action.meta.arg;
          state.orderList = state.orderList.filter(
            (order) => order._id !== deletedOrderId
          );
          // If the deleted order was being viewed, reset the details
          if (state.orderDetails?._id === deletedOrderId) {
            state.orderDetails = null;
          }
        }
      })
      .addCase(deleteOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;