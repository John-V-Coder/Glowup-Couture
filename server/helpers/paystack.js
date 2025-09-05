const https = require('https');
require('dotenv').config();

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseURL = 'https://api.paystack.co';
  }

  // Make API request to Paystack
  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsedData);
            } else {
              reject(new Error(parsedData.message || 'Request failed'));
            }
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data && (method === 'POST' || method === 'PUT')) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Initialize transaction
  async initializeTransaction(transactionData) {
    try {
      const response = await this.makeRequest('/transaction/initialize', 'POST', transactionData);
      return response;
    } catch (error) {
      throw new Error(`Failed to initialize transaction: ${error.message}`);
    }
  }

  // Verify transaction
  async verifyTransaction(reference) {
    try {
      const response = await this.makeRequest(`/transaction/verify/${reference}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to verify transaction: ${error.message}`);
    }
  }

  // Get transaction details
  async getTransaction(transactionId) {
    try {
      const response = await this.makeRequest(`/transaction/${transactionId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error.message}`);
    }
  }

  // Create customer
  async createCustomer(customerData) {
    try {
      const response = await this.makeRequest('/customer', 'POST', customerData);
      return response;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // List banks (for bank transfer)
  async listBanks() {
    try {
      const response = await this.makeRequest('/bank');
      return response;
    } catch (error) {
      throw new Error(`Failed to list banks: ${error.message}`);
    }
  }

  // Create transfer recipient
  async createTransferRecipient(recipientData) {
    try {
      const response = await this.makeRequest('/transferrecipient', 'POST', recipientData);
      return response;
    } catch (error) {
      throw new Error(`Failed to create transfer recipient: ${error.message}`);
    }
  }

  // Initiate transfer (for refunds)
  async initiateTransfer(transferData) {
    try {
      const response = await this.makeRequest('/transfer', 'POST', transferData);
      return response;
    } catch (error) {
      throw new Error(`Failed to initiate transfer: ${error.message}`);
    }
  }

  // Generate payment link
  generatePaymentLink(reference, amount, email) {
    const params = new URLSearchParams({
      reference,
      amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
      email,
      key: this.publicKey
    });
    
    return `https://checkout.paystack.com/v2/checkout?${params.toString()}`;
  }

  // Webhook signature verification
  verifyWebhookSignature(payload, signature) {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return hash === signature;
  }
}

module.exports = new PaystackService();