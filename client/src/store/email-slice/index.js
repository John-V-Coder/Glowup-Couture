import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- USER-FACING THUNKS ---

// Newsletter subscription (email only)
export const subscribeToNewsletter = createAsyncThunk(
  'email/subscribeToNewsletter',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/subscribe`,
        { email }
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
      // The server expects the token as a query parameter
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/email/unsubscribe?token=${token}`
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

// --- ADMIN-FACING THUNKS ---

// Send marketing campaign
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
        `${import.meta.env.VITE_API_URL}/api/email/templates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The server response is now in `response.data.data`
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch email templates');
    }
  }
);

// Save email template
export const saveEmailTemplate = createAsyncThunk(
  'email/saveEmailTemplate',
  async (templateData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/templates`,
        templateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The server response is now in `response.data.data`
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save email template');
    }
  }
);

// Get all newsletter subscribers (admin only)
export const getNewsletterSubscribers = createAsyncThunk(
  'email/getNewsletterSubscribers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/email/subscribers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure we return an array even if backend sends null
      return response.data?.data || [];

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);


const emailSlice = createSlice({
  name: 'email',
  initialState: {
    isLoading: false,
    subscriptionStatus: null,
    supportTicketStatus: null,
    campaignStatus: null,
    templates: [],
    subscribers: [],
    error: null,
    successMessage: null,
    ticketId: null // New field for support ticket ID
  },
  reducers: {
    clearEmailStatus: (state) => {
      state.subscriptionStatus = null;
      state.supportTicketStatus = null;
      state.campaignStatus = null;
      state.error = null;
      state.successMessage = null;
      state.ticketId = null;
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
        state.subscriptionStatus = null;
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
        state.supportTicketStatus = null;
      })
      .addCase(submitSupportTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supportTicketStatus = 'success';
        state.successMessage = action.payload.message;
        state.ticketId = action.payload.ticketId; // Store the new ticket ID
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
        state.campaignStatus = null;
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
        state.error = null;
      })
      .addCase(getEmailTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        // Action payload now contains just the array of templates
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(getEmailTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Email templates - Save/Update
      .addCase(saveEmailTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveEmailTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        // action.payload is the new or updated template object
        const newTemplate = action.payload;
        
        // Find if template already exists and update, otherwise add
        const index = state.templates.findIndex(t => t._id === newTemplate._id);
        if (index >= 0) {
          state.templates[index] = newTemplate;
        } else {
          state.templates.push(newTemplate);
        }
        
        state.successMessage = 'Template saved successfully';
        state.error = null;
      })
      .addCase(saveEmailTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Newsletter subscribers - Get
      .addCase(getNewsletterSubscribers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.subscribers = [];
      })
      .addCase(getNewsletterSubscribers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Action payload is the array of subscribers
        state.subscribers = action.payload;
        state.successMessage = 'Subscribers fetched successfully';
        state.error = null;
      })
      .addCase(getNewsletterSubscribers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearEmailStatus, clearError } = emailSlice.actions;
export default emailSlice.reducer;