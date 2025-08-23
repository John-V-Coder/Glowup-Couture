// Default email templates to be inserted into the database
const defaultTemplates = [
  {
    name: 'welcome',
    subject: 'Welcome to {{companyName}}! 🎉',
    category: 'auth',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to {{companyName}}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DAA520, #F5DEB3); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8B4513; margin: 0; font-size: 28px;">Welcome to {{companyName}}!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #DAA520;">Hello {{userName}}! 👋</h2>
          
          <p>Thank you for joining the {{companyName}} family! We're thrilled to have you on board.</p>
          
          <p>As a member, you'll enjoy:</p>
          <ul style="color: #666;">
            <li>🎯 Exclusive access to new collections</li>
            <li>💰 Special member-only discounts</li>
            <li>📦 Priority shipping on orders</li>
            <li>🎁 Birthday surprises and rewards</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{websiteUrl}}/shop/listing" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Start Shopping Now
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you have any questions, feel free to reach out to our support team at {{supportEmail}}.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Welcome to {{companyName}}!
      
      Hello {{userName}},
      
      Thank you for joining the {{companyName}} family! We're thrilled to have you on board.
      
      As a member, you'll enjoy:
      - Exclusive access to new collections
      - Special member-only discounts
      - Priority shipping on orders
      - Birthday surprises and rewards
      
      Start shopping now: {{websiteUrl}}/shop/listing
      
      If you have any questions, contact us at {{supportEmail}}.
      
      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'userName', description: 'User\'s name', required: true },
      { name: 'userEmail', description: 'User\'s email', required: true }
    ]
  },
  {
  name: 'password-reset',
  subject: 'Reset Your {{companyName}} Password',
  category: 'auth',

  htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #FFFBEA; padding: 30px; border-bottom: 1px solid #eee; text-align: center;">
          <h1 style="color: #5C4033; font-size: 28px; margin: 0; font-weight: 700;">Glowup Couture</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #5C4033; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Hello {{userName}},</h2>
          <p style="margin-bottom: 15px; font-size: 16px;">
            You recently requested to reset your password for your {{companyName}} account.
          </p>
          <p style="margin-bottom: 20px; font-size: 16px;">
            Please use the following <strong>6-digit verification code</strong> to complete the process:
          </p>

          <!-- Code Box -->
          <div style="background-color: #F7E7CE; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 1px solid #EEDFCC;">
            <strong style="font-size: 36px; color: #5C4033; letter-spacing: 5px; display: block;">{{resetCode}}</strong>
          </div>

          <p style="margin-bottom: 15px; font-size: 16px;">
            This code is valid for <strong>15 minutes</strong>. For your security, do not share this code with anyone.
          </p>
          <p style="margin-bottom: 15px; font-size: 16px;">
            If you did not request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F7E7CE; padding: 25px; border-top: 1px solid #EEDFCC; text-align: center; font-size: 14px; color: #5C4033;">
          <p style="margin: 0;">Thank you,</p>
          <p style="margin: 5px 0 0;">The {{companyName}} Team</p>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            If you have any questions, feel free to contact us at 
            <a href="mailto:{{supportEmail}}" style="color: #5C4033; text-decoration: underline;">{{supportEmail}}</a> 
            or visit our website: 
            <a href="{{websiteUrl}}" style="color: #5C4033; text-decoration: underline;">{{websiteUrl}}</a>
          </p>
          <p style="margin: 10px 0 0; font-size: 12px; color: #777;">
            &copy; {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `,

  textContent: `
    Password Reset Request

    Hello {{userName}},

    We received a request to reset your password for your {{companyName}} account.

    Please use the following 6-digit verification code to complete the process:
    {{resetCode}}

    This code will expire in 15 minutes for security reasons.

    If you didn't request this password reset, please ignore this email.

    Need help? Contact us at {{supportEmail}}.

    © {{currentYear}} {{companyName}}. All rights reserved.
  `,

  variables: [
    { name: 'userName', description: 'User\'s name', required: true },
    { name: 'resetCode', description: 'Password reset Code', required: true }
  ]
},

  {
    name: 'order-confirmation',
    subject: 'Order Confirmed! {{orderId}} - {{companyName}} 📦',
    category: 'order',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DAA520, #F5DEB3); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8B4513; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #DAA520;">Thank you {{userName}}! 🎉</h2>
          
          <p>Your order has been confirmed and is being processed.</p>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #B8860B; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> {{orderId}}</p>
            <p><strong>Total Amount:</strong> KES {{orderTotal}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
          </div>
          
          <h3 style="color: #B8860B;">Shipping Address</h3>
          <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">{{shippingAddress}}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{websiteUrl}}/shop/account" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Track Your Order
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Order Confirmed!
      
      Thank you {{userName}}!
      
      Your order has been confirmed and is being processed.
      
      Order Details:
      - Order ID: {{orderId}}
      - Total Amount: KES {{orderTotal}}
      - Estimated Delivery: {{estimatedDelivery}}
      
      Shipping Address: {{shippingAddress}}
      
      Track your order: {{websiteUrl}}/shop/account
      
      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'userName', description: 'Customer name', required: true },
      { name: 'orderId', description: 'Order ID', required: true },
      { name: 'orderTotal', description: 'Order total amount', required: true },
      { name: 'estimatedDelivery', description: 'Estimated delivery date', required: false },
      { name: 'shippingAddress', description: 'Shipping address', required: true }
    ]
  },
  {
    name: 'order-status-update',
    subject: 'Order Update: {{orderId}} - {{orderStatus}} 📋',
    category: 'order',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DAA520, #F5DEB3); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8B4513; margin: 0; font-size: 28px;">Order Status Update</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #DAA520;">Hello {{userName}}!</h2>
          
          <p>Your order status has been updated.</p>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> {{orderId}}</p>
            <p><strong>Status:</strong> <span style="color: #B8860B; font-weight: bold;">{{orderStatus}}</span></p>
            {{#trackingNumber}}<p><strong>Tracking Number:</strong> {{trackingNumber}}</p>{{/trackingNumber}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{websiteUrl}}/shop/account" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View Order Details
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Order Status Update
      
      Hello {{userName}},
      
      Your order status has been updated.
      
      Order ID: {{orderId}}
      Status: {{orderStatus}}
      {{#trackingNumber}}Tracking Number: {{trackingNumber}}{{/trackingNumber}}
      
      View order details: {{websiteUrl}}/shop/account
      
      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'userName', description: 'Customer name', required: true },
      { name: 'orderId', description: 'Order ID', required: true },
      { name: 'orderStatus', description: 'Current order status', required: true },
      { name: 'trackingNumber', description: 'Tracking number', required: false }
    ]
  },
  {
    name: 'support-response',
    subject: 'Re: {{ticketId}} - {{companyName}} Support Response 💬',
    category: 'support',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Support Response</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DAA520, #F5DEB3); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8B4513; margin: 0; font-size: 28px;">Support Response</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #DAA520;">Hello {{userName}}!</h2>
          
          <p>Thank you for contacting {{companyName}} support. Here's our response to your inquiry:</p>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> {{ticketId}}</p>
            <p><strong>Support Agent:</strong> {{supportAgent}}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DAA520;">
            <h3 style="color: #B8860B; margin-top: 0;">Our Response:</h3>
            <p>{{responseMessage}}</p>
          </div>
          
          <p>If you need further assistance, please reply to this email or contact us at {{supportEmail}}.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{websiteUrl}}/shop/home" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Continue Shopping
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Support Response
      
      Hello {{userName}},
      
      Thank you for contacting {{companyName}} support.
      
      Ticket ID: {{ticketId}}
      Support Agent: {{supportAgent}}
      
      Our Response:
      {{responseMessage}}
      
      If you need further assistance, contact us at {{supportEmail}}.
      
      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'userName', description: 'Customer name', required: true },
      { name: 'ticketId', description: 'Support ticket ID', required: true },
      { name: 'responseMessage', description: 'Support response message', required: true },
      { name: 'supportAgent', description: 'Support agent name', required: false }
    ]
  },
  {
    name: 'marketing-campaign',
    subject: '{{campaignTitle}} - {{companyName}} 🛍️',
    category: 'marketing',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{campaignTitle}}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DAA520, #F5DEB3); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8B4513; margin: 0; font-size: 28px;">{{campaignTitle}}</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #DAA520;">Hello {{userName}}!</h2>
          
          <div style="margin: 20px 0;">
            {{campaignContent}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ctaUrl}}" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
              {{ctaText}}
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            You're receiving this email because you subscribed to {{companyName}} updates.<br>
            <a href="{{unsubscribeUrl}}" style="color: #999;">Unsubscribe</a> | 
            <a href="{{websiteUrl}}" style="color: #999;">Visit Website</a>
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      {{campaignTitle}}
      
      Hello {{userName}},
      
      {{campaignContent}}
      
      {{ctaText}}: {{ctaUrl}}
      
      You're receiving this email because you subscribed to {{companyName}} updates.
      Unsubscribe: {{unsubscribeUrl}}
      
      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'userName', description: 'Customer name', required: true },
      { name: 'campaignTitle', description: 'Campaign title', required: true },
      { name: 'campaignContent', description: 'Campaign content', required: true },
      { name: 'ctaText', description: 'Call-to-action text', required: false },
      { name: 'ctaUrl', description: 'Call-to-action URL', required: false },
      { name: 'unsubscribeUrl', description: 'Unsubscribe URL', required: true }
    ]
  },
  {
    name: 'subscription-confirmation',
    subject: 'Welcome to {{companyName}} Newsletter! 📧',
    category: 'marketing',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter Subscription</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DAA520, #F5DEB3); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8B4513; margin: 0; font-size: 28px;">Newsletter Subscription Confirmed!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #DAA520;">Welcome {{userName}}! 🎉</h2>
          
          <p>Thank you for subscribing to the {{companyName}} newsletter!</p>
          
          <p>You'll now receive:</p>
          <ul style="color: #666;">
            <li>🆕 New product announcements</li>
            <li>💰 Exclusive sales and discounts</li>
            <li>👗 Style tips and fashion trends</li>
            <li>📦 Order updates and shipping notifications</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{websiteUrl}}/shop/listing" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Start Shopping
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Don't want to receive these emails? <a href="{{unsubscribeUrl}}" style="color: #999;">Unsubscribe here</a>
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Newsletter Subscription Confirmed!
      
      Welcome {{userName}}!
      
      Thank you for subscribing to the {{companyName}} newsletter!
      
      You'll now receive:
      - New product announcements
      - Exclusive sales and discounts
      - Style tips and fashion trends
      - Order updates and shipping notifications
      
      Start shopping: {{websiteUrl}}/shop/listing
      
      Unsubscribe: {{unsubscribeUrl}}
      
      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'userName', description: 'Subscriber name', required: true },
      { name: 'unsubscribeUrl', description: 'Unsubscribe URL', required: true }
    ]
  }
];

module.exports = { defaultTemplates };