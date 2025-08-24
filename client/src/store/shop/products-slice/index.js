// src/store/product-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use the full API URL from environment variables for consistency and to avoid proxy issues.
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/shop/products`;

// =============================
// Async Thunks
// =============================

// Fetch filtered products
export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFilteredProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      // The `params` object from dispatch is { filterParams: {...}, sortParams: '...' }
      // This was causing issues as the backend expects flat query parameters.
      // We now flatten and process them here.
      const { filterParams = {}, sortParams, ...rest } = params;

      const queryParams = { ...rest, ...filterParams };
      if (sortParams) {
        // FIX: The backend controller expects the parameter to be 'sortBy', not 'sort'.
        queryParams.sortBy = sortParams;
      }

      // Process for comma-separated values and remove empty/null values
      const processedParams = {};
      for (const [key, value] of Object.entries(queryParams)) {
        if (Array.isArray(value) && value.length > 0) {
          processedParams[key] = value.join(',');
        } else if (value != null && value !== '') {
          processedParams[key] = value;
        }
      }

      const response = await axios.get(`${API_BASE_URL}/get`, { 
        params: processedParams,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required");
      }
      
      const response = await axios.get(`${API_BASE_URL}/get/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

// Fetch related products
export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async ({ id, limit = 8 }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required");
      }
      
      const response = await axios.get(`${API_BASE_URL}/get/${id}/related`, {
        params: { limit }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch related products"
      );
    }
  }
);

// Fetch filter options
export const fetchFilterOptions = createAsyncThunk(
  "products/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter-options`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch filter options"
      );
    }
  }
);

// =============================
// Slice
// =============================
const shopProductsSlice = createSlice({
  name: "products",
  initialState: {
    // Products list and pagination
    productList: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      limit: 20,
      hasNextPage: false,
      hasPrevPage: false,
    },
    
    // Current product and related products
    productDetails: null,
    relatedProducts: [],
    isLoading: false,

    
    // Filter options and current filters
    filterOptions: {},
    appliedFilters: {},
    
    // Loading states - separate for different operations
    loadingStates: {
      products: false,
      productDetails: false,
      relatedProducts: false,
      filterOptions: false,
    },
    
    // Errors - separate for different operations
    errors: {
      products: null,
      productDetails: null,
      relatedProducts: null,
      filterOptions: null,
    },
    
    // Search and sort state
    searchTerm: "",
    sortBy: "price-lowtohigh",
    
    // UI state
    isInitialized: false,
  },
  reducers: {
    // Clear individual errors
    clearProductsError(state) {
      state.errors.products = null;
    },
    clearProductDetailsError(state) {
      state.errors.productDetails = null;
    },
    clearRelatedProductsError(state) {
      state.errors.relatedProducts = null;
    },
    clearAllErrors(state) {
      state.errors = {
        products: null,
        productDetails: null,
        relatedProducts: null,
        filterOptions: null,
      };
    },
    
    // Clear data
    clearProduct(state) {
      state.product = null;
      state.relatedProducts = [];
    },
    clearProducts(state) {
      state.productList = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },
    
    // Set states manually (useful for SSR or cache)
    setProductDetails(state, action) {
      state.productDetails = action.payload;
    },
    setProducts(state, action) {
      state.productList = action.payload.data || [];
      state.pagination = action.payload.pagination || state.pagination;
    },
    
    // Update filters and search
    setAppliedFilters(state, action) {
      state.appliedFilters = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    
    // Reset to initial state
    resetProductState(state) {
      Object.assign(state, shopProductsSlice.getInitialState());
    },
    
    // Mark as initialized (useful for preventing unnecessary API calls)
    setInitialized(state, action) {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Filtered Products =====
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loadingStates.products = true;
        state.errors.products = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loadingStates.products = false;
        state.productList = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
        
        // Store applied filters and sort from response
        if (action.payload.filters) {
          state.appliedFilters = action.payload.filters.appliedFilters || {};
          state.sortBy = action.payload.filters.sortBy || state.sortBy;
        }
        
        state.isInitialized = true;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loadingStates.products = false;
        state.errors.products = action.payload;
        state.productList = [];
      })

      // ===== Product Details =====
        .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true; // Use the new isLoading property
        state.errors.productDetails = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false; // Use the new isLoading property
        state.productDetails = action.payload.data; // Use the new productDetails property
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false; // Use the new isLoading property
        state.errors.productDetails = action.payload;
        state.productDetails = null;
      })

      // ===== Related Products =====
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loadingStates.relatedProducts = true;
        state.errors.relatedProducts = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loadingStates.relatedProducts = false;
        state.relatedProducts = action.payload.data || [];
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loadingStates.relatedProducts = false;
        state.errors.relatedProducts = action.payload;
        state.relatedProducts = [];
      })

      // ===== Filter Options =====
      .addCase(fetchFilterOptions.pending, (state) => {
        state.loadingStates.filterOptions = true;
        state.errors.filterOptions = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.loadingStates.filterOptions = false;
        state.filterOptions = action.payload.data || {};
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.loadingStates.filterOptions = false;
        state.errors.filterOptions = action.payload;
      });
  },
});

// Export actions
export const { 
  clearProductsError,
  clearProductDetailsError, 
  clearRelatedProductsError,
  clearAllErrors,
  clearProduct, 
  clearProducts,
  setProductDetails,
  setProducts,
  setAppliedFilters,
  setSearchTerm,
  setSortBy,
  resetProductState,
  setInitialized
} = shopProductsSlice.actions;

// Export selectors for easy access
export const selectProducts = (state) => state.products.productList;
export const selectPagination = (state) => state.products.pagination;
export const selectProduct = (state) => state.products.product;
export const selectRelatedProducts = (state) => state.products.relatedProducts;
export const selectFilterOptions = (state) => state.products.filterOptions;
export const selectAppliedFilters = (state) => state.products.appliedFilters;
export const selectSearchTerm = (state) => state.products.searchTerm;
export const selectSortBy = (state) => state.products.sortBy;

// Loading selectors
export const selectProductsLoading = (state) => state.products.loadingStates.products;
export const selectProductDetailsLoading = (state) => state.products.loadingStates.productDetails;
export const selectRelatedProductsLoading = (state) => state.products.loadingStates.relatedProducts;
export const selectFilterOptionsLoading = (state) => state.products.loadingStates.filterOptions;

// Error selectors
export const selectProductsError = (state) => state.products.errors.products;
export const selectProductDetailsError = (state) => state.products.errors.productDetails;
export const selectRelatedProductsError = (state) => state.products.errors.relatedProducts;
export const selectFilterOptionsError = (state) => state.products.errors.filterOptions;

// Computed selectors
export const selectIsInitialized = (state) => state.products.isInitialized;
export const selectHasProducts = (state) => state.products.productList.length > 0;
export const selectTotalProducts = (state) => state.products.pagination.totalProducts;

export default shopProductsSlice.reducer;