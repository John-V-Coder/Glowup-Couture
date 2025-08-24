import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// --- Centralized Axios Instance ---
// This prevents repeating the baseURL and headers in every thunk.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Async Thunks for API Calls ---

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/products/add", formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/products/get", {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/products/edit/${id}`, formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/products/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const updateProductStock = createAsyncThunk(
  "/products/updateProductStock",
  async ({ id, totalStock, operation = "set", reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/products/stock/${id}`, { totalStock, operation, reason });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "/products/toggleProductStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/products/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const getLowStockProducts = createAsyncThunk(
  "/products/getLowStockProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/products/low-stock");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const checkAllProductsLowStock = createAsyncThunk(
  "/products/checkAllProductsLowStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/products/check-low-stock");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const getProductStats = createAsyncThunk(
  "/products/getProductStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/products/stats");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "An unknown network error occurred.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

// --- Initial State ---
const initialState = {
  // Global loading and error for general operations
  isloading: false, // General loading state for the slice
  error: null,    // General error state for the slice

  // Specific loading states for each operation
  addingProductLoading: false,
  fetchingProductsLoading: false,
  editingProductLoading: false,
  deletingProductLoading: false,
  updatingStockLoading: false,
  togglingStatusLoading: false,
  checkingLowStockLoading: false,
  fetchingLowStockLoading: false,
  fetchingStatsLoading: false,

  // Data states
  productList: [],
  pagination: null, // For fetchAllProducts
  productStats: null, // For getProductStats
  lowStockData: {     // For getLowStockProducts
    lowStockProducts: [],
    outOfStockProducts: [],
    summary: null,
  },

  // Specific error messages for each operation
  addProductError: null,
  fetchProductsError: null,
  editProductError: null,
  deleteProductError: null,
  updateStockError: null,
  toggleStatusError: null,
  checkAllLowStockError: null,
  getLowStockProductsError: null,
  getProductStatsError: null,
};

// --- Product Slice Definition ---
const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    // A simple reducer to clear all errors in the slice
    clearProductErrors: (state) => {
      state.error = null;
      state.addProductError = null;
      state.fetchProductsError = null;
      state.editProductError = null;
      state.deleteProductError = null;
      state.updateStockError = null;
      state.toggleStatusError = null;
      state.checkAllLowStockError = null;
      state.getLowStockProductsError = null;
      state.getProductStatsError = null;
    },
    // You might add other synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // --- addNewProduct ---
    builder
      .addCase(addNewProduct.pending, (state) => {
        state.addingProductLoading = true;
        state.addProductError = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.addingProductLoading = false;
        // Optionally add the new product to productList if it's currently fetched and visible
        state.productList.unshift(action.payload.data); // Assuming data property contains the product
        state.addProductError = null;
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.addingProductLoading = false;
        state.addProductError = action.payload;
      });

    // --- fetchAllProducts ---
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.fetchingProductsLoading = true;
        state.fetchProductsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.fetchingProductsLoading = false;
        state.productList = action.payload.data;
        state.pagination = action.payload.pagination;
        state.fetchProductsError = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.fetchingProductsLoading = false;
        state.fetchProductsError = action.payload;
        state.productList = [];
        state.pagination = null;
      });

    // --- editProduct ---
    builder
      .addCase(editProduct.pending, (state) => {
        state.editingProductLoading = true;
        state.editProductError = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.editingProductLoading = false;
        state.editProductError = null;
        // Update the product in the list if it exists
        const index = state.productList.findIndex((p) => p._id === action.payload.data._id);
        if (index !== -1) {
          state.productList[index] = action.payload.data;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.editingProductLoading = false;
        state.editProductError = action.payload;
      });

    // --- deleteProduct ---
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deletingProductLoading = true;
        state.deleteProductError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deletingProductLoading = false;
        state.deleteProductError = null;
        // Remove the deleted product from the list
        state.productList = state.productList.filter((p) => p._id !== action.payload.data.deletedProduct.id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deletingProductLoading = false;
        state.deleteProductError = action.payload;
      });

    // --- updateProductStock ---
    builder
      .addCase(updateProductStock.pending, (state) => {
        state.updatingStockLoading = true;
        state.updateStockError = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.updatingStockLoading = false;
        state.updateStockError = null;
        // Update the stock of the product in the list
        const index = state.productList.findIndex((p) => p._id === action.payload.data.productId);
        if (index !== -1) {
          state.productList[index].totalStock = action.payload.data.newStock;
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.updatingStockLoading = false;
        state.updateStockError = action.payload;
      });

    // --- toggleProductStatus ---
    builder
      .addCase(toggleProductStatus.pending, (state) => {
        state.togglingStatusLoading = true;
        state.toggleStatusError = null;
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        state.togglingStatusLoading = false;
        state.toggleStatusError = null;
        // Update the status of the product in the list
        const index = state.productList.findIndex((p) => p._id === action.payload.data._id);
        if (index !== -1) {
          state.productList[index].isActive = action.payload.data.isActive;
        }
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.togglingStatusLoading = false;
        state.toggleStatusError = action.payload;
      });

    // --- getLowStockProducts ---
    builder
      .addCase(getLowStockProducts.pending, (state) => {
        state.fetchingLowStockLoading = true;
        state.getLowStockProductsError = null;
      })
      .addCase(getLowStockProducts.fulfilled, (state, action) => {
        state.fetchingLowStockLoading = false;
        state.lowStockData = {
          lowStockProducts: action.payload.data.lowStockProducts,
          outOfStockProducts: action.payload.data.outOfStockProducts,
          summary: action.payload.data.summary,
        };
        state.getLowStockProductsError = null;
      })
      .addCase(getLowStockProducts.rejected, (state, action) => {
        state.fetchingLowStockLoading = false;
        state.getLowStockProductsError = action.payload;
        state.lowStockData = { lowStockProducts: [], outOfStockProducts: [], summary: null };
      });

    // --- checkAllProductsLowStock ---
    builder
      .addCase(checkAllProductsLowStock.pending, (state) => {
        state.checkingLowStockLoading = true;
        state.checkAllLowStockError = null;
      })
      .addCase(checkAllProductsLowStock.fulfilled, (state, action) => {
        state.checkingLowStockLoading = false;
        // This thunk primarily triggers background notifications,
        // but its response can also update lowStockData if desired,
        // or just show a success message.
        state.checkAllLowStockError = null;
        // Example: If the server response includes updated low stock data
        if (action.payload.data) {
          state.lowStockData = {
            lowStockProducts: action.payload.data.lowStockProducts,
            outOfStockProducts: action.payload.data.outOfStockProducts,
            summary: {
              lowStockCount: action.payload.data.lowStockCount,
              outOfStockCount: action.payload.data.outOfStockCount,
              totalAffected: action.payload.data.lowStockCount + action.payload.data.outOfStockCount
            }
          };
        }
      })
      .addCase(checkAllProductsLowStock.rejected, (state, action) => {
        state.checkingLowStockLoading = false;
        state.checkAllLowStockError = action.payload;
      });

    // --- getProductStats ---
    builder
      .addCase(getProductStats.pending, (state) => {
        state.fetchingStatsLoading = true;
        state.getProductStatsError = null;
      })
      .addCase(getProductStats.fulfilled, (state, action) => {
        state.fetchingStatsLoading = false;
        state.productStats = action.payload.data;
        state.getProductStatsError = null;
      })
      .addCase(getProductStats.rejected, (state, action) => {
        state.fetchingStatsLoading = false;
        state.getProductStatsError = action.payload;
        state.productStats = null;
      });
  },
});

export const { clearProductErrors } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;