import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
  isGuestUser: false,
};

// Helper function to get guest cart from session storage
const getGuestCart = () => {
  try {
    const guestCart = sessionStorage.getItem('guestCart');
    return guestCart ? JSON.parse(guestCart) : { items: [] };
  } catch (error) {
    console.error('Error reading guest cart:', error);
    return { items: [] };
  }
};

// Helper function to save guest cart to session storage
const saveGuestCart = (cart) => {
  try {
    sessionStorage.setItem('guestCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, size, productDetails }, { getState }) => { // LABLE 1: Added 'size' to parameters
    const state = getState();
    
    // If no user ID (guest user), handle locally
    if (!userId) {
      const guestCart = getGuestCart();
      // LABLE 2: Modified findIndex to include 'size' for guest cart
      const existingItemIndex = guestCart.items.findIndex(
        item => item.productId === productId && item.size === size 
      );
      
      if (existingItemIndex !== -1) {
        guestCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Store complete product information for guest cart
        const cartItem = {
          productId,
          quantity,
          size, // LABLE 3: Added 'size' to the cart item object for guest cart
          title: productDetails?.title || 'Product',
          image: productDetails?.image || '',
          price: productDetails?.price || 0,
          salePrice: productDetails?.salePrice || 0,
          category: productDetails?.category || 'General Product'
        };
        guestCart.items.push(cartItem);
      }
      
      saveGuestCart(guestCart);
      return { success: true, data: guestCart };
    }

    // Authenticated user - use API
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
      {
        userId,
        productId,
        quantity,
        size, // LABLE 4: Added 'size' to the API request body for authenticated users
      }
    );

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { getState }) => {
    const state = getState();
    
    // If no user ID (guest user), get from session storage
    if (!userId) {
      const guestCart = getGuestCart();
      return { success: true, data: guestCart };
    }

    // Authenticated user - use API
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, size }, { getState }) => { // LABLE 5: Added 'size' to parameters
    const state = getState();
    
    // If no user ID (guest user), handle locally
    if (!userId) {
      const guestCart = getGuestCart();
      // LABLE 6: Modified filter condition to include 'size' for guest cart
      guestCart.items = guestCart.items.filter(
        item => item.productId !== productId || item.size !== size 
      );
      saveGuestCart(guestCart);
      return { success: true, data: guestCart };
    }

    // Authenticated user - use API
    // LABLE 7: Added 'size' to the API delete URL parameters for authenticated users
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}/${size}`
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity, size }, { getState }) => { // LABLE 8: Added 'size' to parameters
    const state = getState();
    
    // If no user ID (guest user), handle locally
    if (!userId) {
      const guestCart = getGuestCart();
      // LABLE 9: Modified findIndex to include 'size' for guest cart
      const itemIndex = guestCart.items.findIndex(
        item => item.productId === productId && item.size === size
      );
      
      if (itemIndex !== -1) {
        guestCart.items[itemIndex].quantity = quantity;
        if (quantity <= 0) {
          guestCart.items.splice(itemIndex, 1);
        }
      }
      
      saveGuestCart(guestCart);
      return { success: true, data: guestCart };
    }

    // Authenticated user - use API
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
      {
        userId,
        productId,
        quantity,
        size, // LABLE 10: Added 'size' to the API request body for authenticated users
      }
    );

    return response.data;
  }
);

// New action to load guest cart on app start
export const loadGuestCart = createAsyncThunk(
  "cart/loadGuestCart",
  async () => {
    const guestCart = getGuestCart();
    return { success: true, data: guestCart };
  }
);

// New action to merge guest cart with user cart after login
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (userId) => {
    const guestCart = getGuestCart();
    
    if (guestCart.items.length === 0) {
      return { success: true, data: { items: [] } };
    }

    // Merge each item from guest cart to user cart
    for (const item of guestCart.items) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
        {
          userId,
          productId: item.productId,
          quantity: item.quantity,
          size: item.size, // LABLE 11: Added 'size' when merging guest cart items to user cart
        }
      );
    }

    // Clear guest cart
    sessionStorage.removeItem('guestCart');
    
    // Fetch updated user cart
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    setGuestUser: (state, action) => {
      state.isGuestUser = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      if (state.isGuestUser) {
        sessionStorage.removeItem('guestCart');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.isGuestUser = !action.payload.data.userId;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.isGuestUser = !action.payload.data.userId;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(loadGuestCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.data;
        state.isGuestUser = true;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.data;
        state.isGuestUser = false;
      });
  },
});

export const { setGuestUser, clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;