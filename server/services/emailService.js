const { createTransporter } = require('../config/email');
const EmailTemplate = require('../models/EmailTemplate');
const EmailSubscription = require('../models/EmailSubscription');

class EmailService {
  constructor() {
    this.transporter = createTransporter();
    this.fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    this.companyName = 'Glowup Couture';
  }

  // Replace template variables with actual values
  replaceVariables(content, variables = {}) {
    let processedContent = content;
    
    // Default variables available in all templates
    const defaultVars = {
      companyName: this.companyName,
      currentYear: new Date().getFullYear(),
      supportEmail: process.env.SUPPORT_EMAIL || this.fromEmail,
      websiteUrl: process.env.CLIENT_URL || 'https://glowupcouture.com',
      ...variables
    };

    Object.keys(defaultVars).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedContent = processedContent.replace(regex, defaultVars[key] || '');
    });

    return processedContent;
  }

  // Send email using template
  async sendTemplateEmail(templateName, to, variables = {}) {
    try {
      const template = await EmailTemplate.findOne({ 
        name: templateName, 
        isActive: true 
      });

      if (!template) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      const htmlContent = this.replaceVariables(template.htmlContent, variables);
      const textContent = this.replaceVariables(template.textContent, variables);
      const subject = this.replaceVariables(template.subject, variables);

      const mailOptions = {
        from: `${this.companyName} <${this.fromEmail}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}:`, result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.message);
      throw error;
    }
  }

  // Send custom email without template
  async sendCustomEmail({ to, subject, html, text, attachments = [] }) {
    try {
      const mailOptions = {
        from: `${this.companyName} <${this.fromEmail}>`,
        to,
        subject,
        html,
        text,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Custom email sent successfully to ${to}:`, result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error(`Failed to send custom email to ${to}:`, error.message);
      throw error;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(userEmail, userName) {
    return this.sendTemplateEmail('welcome', userEmail, {
      userName,
      userEmail
    });
  }

  // Password reset email
 async sendPasswordResetEmail(userEmail, userName, resetCode) {
  return this.sendTemplateEmail('password-reset', userEmail, {
    subject: 'Password Reset Request',
    userName,
    resetCode // only the numeric code, no link
  });
}
  // Order confirmation email
  async sendOrderConfirmationEmail(userEmail, orderData) {
    return this.sendTemplateEmail('order-confirmation', userEmail, {
      userName: orderData.userName,
      orderId: orderData.orderId,
      orderTotal: orderData.total,
      orderItems: orderData.items,
      shippingAddress: orderData.shippingAddress,
      estimatedDelivery: orderData.estimatedDelivery
    });
  }

  // Order status update email
  async sendOrderStatusEmail(userEmail, orderData) {
    return this.sendTemplateEmail('order-status-update', userEmail, {
      userName: orderData.userName,
      orderId: orderData.orderId,
      orderStatus: orderData.status,
      trackingNumber: orderData.trackingNumber
    });
  }

  // Customer support response email
  async sendSupportResponseEmail(userEmail, supportData) {
    return this.sendTemplateEmail('support-response', userEmail, {
      userName: supportData.userName,
      ticketId: supportData.ticketId,
      responseMessage: supportData.message,
      supportAgent: supportData.agentName
    });
  }

  // Marketing campaign email
  async sendMarketingEmail(userEmail, campaignData) {
    return this.sendTemplateEmail('marketing-campaign', userEmail, {
      userName: campaignData.userName,
      campaignTitle: campaignData.title,
      campaignContent: campaignData.content,
      ctaUrl: campaignData.ctaUrl,
      ctaText: campaignData.ctaText,
      unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe?token=${campaignData.unsubscribeToken}`
    });
  }

  // Newsletter subscription confirmation
  async sendSubscriptionConfirmationEmail(userEmail, userName, unsubscribeToken) {
    return this.sendTemplateEmail('subscription-confirmation', userEmail, {
      userName,
      unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe?token=${unsubscribeToken}`
    });
  }

  // Bulk email sending for marketing campaigns
  async sendBulkMarketingEmails(campaignData) {
    try {
      const subscribers = await EmailSubscription.find({
        isActive: true,
        'preferences.marketing': true
      });

      const results = {
        sent: 0,
        failed: 0,
        errors: []
      };

      // Send emails in batches to avoid overwhelming the email service
      const batchSize = 10;
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const promises = batch.map(async (subscriber) => {
          try {
            await this.sendMarketingEmail(subscriber.email, {
              ...campaignData,
              userName: subscriber.firstName || 'Valued Customer',
              unsubscribeToken: subscriber.unsubscribeToken
            });
            results.sent++;
          } catch (error) {
            results.failed++;
            results.errors.push({
              email: subscriber.email,
              error: error.message
            });
          }
        });

        await Promise.all(promises);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`📧 Bulk email campaign completed: ${results.sent} sent, ${results.failed} failed`);
      return results;

    } catch (error) {
      console.error('❌ Bulk email campaign failed:', error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();