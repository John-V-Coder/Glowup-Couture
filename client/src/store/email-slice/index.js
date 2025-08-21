import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Newsletter subscription
export const subscribeToNewsletter = createAsyncThunk(
  'email/subscribeToNewsletter',
  async ({ email, preferences }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/subscribe`,
        { email, preferences }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Subscription failed');
    }
  }
);

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = createAsyncThunk(
  'email/unsubscribeFromNewsletter',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/unsubscribe`,
        { token }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unsubscribe failed');
    }
  }
);

// Submit support ticket
export const submitSupportTicket = createAsyncThunk(
  'email/submitSupportTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/support`,
        ticketData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Support ticket submission failed');
    }
  }
);

// Send marketing campaign (admin only)
export const sendMarketingCampaign = createAsyncThunk(
  'email/sendMarketingCampaign',
  async (campaignData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/marketing-campaign`,
        campaignData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Marketing campaign failed');
    }
  }
);

// Get email templates (admin only)
export const getEmailTemplates = createAsyncThunk(
  'email/getEmailTemplates',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/email/template`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch email templates');
    }
  }
);

// Create/Update email template (admin only)
export const saveEmailTemplate = createAsyncThunk(
  'email/saveEmailTemplate',
  async (templateData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/template`,
        templateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save email template');
    }
  }
);


const emailSlice = createSlice({
  name: 'email',
  initialState: {
    isLoading: false,
    subscriptionStatus: null,
    resetRequestStatus: null, // Note: This state property does not seem to be used by any of the async thunks. Consider if it's needed.
    supportTicketStatus: null,
    campaignStatus: null,
    templates: null, // Changed from [null] to [] for better initial state of an array
    error: null,
    successMessage: null
  },
  reducers: {
    clearEmailStatus: (state) => {
      state.subscriptionStatus = null;
      state.resetRequestStatus = null;
      state.supportTicketStatus = null;
      state.campaignStatus = null;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Newsletter subscription
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionStatus = 'success';
        state.successMessage = action.payload.message;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.isLoading = false;
        state.subscriptionStatus = 'failed';
        state.error = action.payload;
      })

      // Unsubscribe
      .addCase(unsubscribeFromNewsletter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unsubscribeFromNewsletter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(unsubscribeFromNewsletter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Support ticket
      .addCase(submitSupportTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitSupportTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supportTicketStatus = 'success';
        state.successMessage = action.payload.message;
      })
      .addCase(submitSupportTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.supportTicketStatus = 'failed';
        state.error = action.payload;
      })

      // Marketing campaign
      .addCase(sendMarketingCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMarketingCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaignStatus = 'success';
        state.successMessage = action.payload.message;
      })
      .addCase(sendMarketingCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.campaignStatus = 'failed';
        state.error = action.payload;
      })

      // Email templates - Get
      .addCase(getEmailTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Ensure error is cleared on pending
      })
      .addCase(getEmailTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload.templates;
        state.error = null; // Ensure no lingering error if successful
      })
      .addCase(getEmailTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Email templates - Save/Update
      .addCase(saveEmailTemplate.pending, (state) => { // Added pending case for saveEmailTemplate
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveEmailTemplate.fulfilled, (state, action) => {
        state.isLoading = false; // Set loading to false on fulfillment
        state.successMessage = action.payload.message;
        const index = state.templates.findIndex(t => t._id === action.payload.template._id);
        if (index >= 0) {
          state.templates[index] = action.payload.template;
        } else {
          state.templates.push(action.payload.template);
        }
        state.error = null; // Ensure no lingering error if successful
      })
      .addCase(saveEmailTemplate.rejected, (state, action) => { // Added rejected case for saveEmailTemplate
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearEmailStatus, clearError } = emailSlice.actions;
export default emailSlice.reducer;
