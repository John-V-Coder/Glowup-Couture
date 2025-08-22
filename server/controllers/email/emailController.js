const emailService = require('../../services/emailService');
const EmailSubscription = require('../../models/EmailSubscription');
const EmailTemplate = require('../../models/EmailTemplate');
const { notifyAdminOfNewOrder } = require('../../utils/emailHelpers');

// Subscribe to newsletter
// Subscribe to newsletter (supports auto-fill for authenticated users)
const subscribeToNewsletter = async (req, res) => {
  try {
    // Use authenticated user's info if available
    const email = req.user?.email || req.body.email;
    const firstName = req.user?.firstName || req.body.firstName || '';
    const lastName = req.user?.lastName || req.body.lastName || '';
    const preferences = req.body.preferences || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if already subscribed
    let subscription = await EmailSubscription.findOne({ email });

    if (subscription) {
      if (subscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed'
        });
      } else {
        // Reactivate subscription
        subscription.isActive = true;
        subscription.firstName = firstName || subscription.firstName;
        subscription.lastName = lastName || subscription.lastName;
        subscription.preferences = { ...subscription.preferences, ...preferences };
        await subscription.save();
      }
    } else {
      // Create new subscription
      subscription = new EmailSubscription({
        email,
        firstName,
        lastName,
        preferences: {
          marketing: true,
          orderUpdates: true,
          newProducts: true,
          sales: true,
          ...preferences
        },
        source: req.user ? 'account' : 'website'
      });
      await subscription.save();
    }

    // Send confirmation email
    await emailService.sendSubscriptionConfirmationEmail(
      email,
      firstName || 'Valued Customer',
      subscription.unsubscribeToken
    );

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
};


// Unsubscribe from newsletter
const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required'
      });
    }

    const subscription = await EmailSubscription.findOne({ unsubscribeToken: token });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Invalid unsubscribe token'
      });
    }

    subscription.isActive = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter'
    });
  }
};



// Send customer support email
const sendSupportEmail = async (req, res) => {
  try {
    const { name, email, subject, message, orderId = null } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Generate ticket ID
    const ticketId = `GC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Send email to support team
    const supportEmailContent = `
      <h2>New Customer Support Request</h2>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr>
      <p><em>This email was sent from the Glowup Couture website contact form.</em></p>
    `;

    await emailService.sendCustomEmail({
      to: process.env.SUPPORT_EMAIL || this.fromEmail,
      subject: `[Support] ${subject} - Ticket #${ticketId}`,
      html: supportEmailContent,
      text: `New support request from ${name} (${email})\nTicket: ${ticketId}\nSubject: ${subject}\nMessage: ${message}`
    });

    // Send confirmation email to customer
    const customerConfirmation = `
      <h2>Thank you for contacting Glowup Couture!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p><strong>Your Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>Please keep this ticket ID for your reference.</p>
      <br>
      <p>Best regards,<br>Glowup Couture Support Team</p>
    `;

    await emailService.sendCustomEmail({
      to: email,
      subject: `Support Request Received - Ticket #${ticketId}`,
      html: customerConfirmation,
      text: `Thank you for contacting Glowup Couture! Your ticket ID is ${ticketId}. We will respond within 24 hours.`
    });

    res.status(200).json({
      success: true,
      message: 'Support request sent successfully',
      ticketId
    });

  } catch (error) {
    console.error('Support email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send support request'
    });
  }
};

// Send marketing campaign
const sendMarketingCampaign = async (req, res) => {
  try {
    const {
      title,
      content,
      ctaText = 'Shop Now',
      ctaUrl = process.env.CLIENT_URL,
      targetAudience = 'all'
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Campaign title and content are required'
      });
    }

    const campaignData = {
      title,
      content,
      ctaText,
      ctaUrl
    };

    const results = await emailService.sendBulkMarketingEmails(campaignData);

    res.status(200).json({
      success: true,
      message: 'Marketing campaign sent successfully',
      results
    });

  } catch (error) {
    console.error('Marketing campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send marketing campaign'
    });
  }
};

// Get email templates
const getEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find({ isActive: true });

    res.status(200).json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email templates'
    });
  }
};

// Create or update email template
const saveEmailTemplate = async (req, res) => {
  try {
    const { name, subject, htmlContent, textContent, category, variables = [] } = req.body;

    if (!name || !subject || !htmlContent || !textContent || !category) {
      return res.status(400).json({
        success: false,
        message: 'All template fields are required'
      });
    }

    const template = await EmailTemplate.findOneAndUpdate(
      { name },
      {
        name,
        subject,
        htmlContent,
        textContent,
        category,
        variables,
        isActive: true
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Email template saved successfully',
      data: template
    });

  } catch (error) {
    console.error('Save template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save email template'
    });
  }
};

// New: Send order notification
const sendOrderNotification = async (order) => {
  try {
    if (!order || !order.customerEmail || !order._id) {
      console.error('Order notification failed: Missing order details');
      return;
    }

    // Send confirmation email to customer
    await emailService.sendOrderConfirmationEmail(order);

    // Notify admin of new order
    await notifyAdminOfNewOrder(order);

    console.log(`Order notification sent for order: ${order._id}`);
  } catch (error) {
    console.error('Order notification error:', error);
  }
};

// New: Get all newsletter subscribers
const getNewsletterSubscribers = async (req, res) => {
  try {
    // Find all active subscribers
    const subscribers = await EmailSubscription.find({ isActive: true }).select('email firstName lastName preferences createdAt');

    res.status(200).json({
      success: true,
      message: 'Newsletter subscribers fetched successfully',
      data: subscribers
    });

  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter subscribers'
    });
  }
};


module.exports = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  sendSupportEmail,
  sendMarketingCampaign,
  getEmailTemplates,
  saveEmailTemplate,
  sendOrderNotification,
  getNewsletterSubscribers
};