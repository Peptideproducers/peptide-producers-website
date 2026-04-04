// Bankful Hosted Payment Page API Integration
// Production Environment

import crypto from 'crypto';

const BANKFUL_API_URL = 'https://api.paybybankful.com/front-calls/go-in/hosted-page-pay';
const MERCHANT_USERNAME = process.env.BANKFUL_USERNAME || 'info@peptideproducers.com';
const MERCHANT_PASSWORD = process.env.BANKFUL_PASSWORD || 'Utes34313431!';

// Generate HMAC-SHA256 signature for Bankful API
function generateSignature(payload, salt) {
  // Remove signature field if present
  const { signature, ...payloadWithoutSig } = payload;
  
  // Sort keys alphabetically
  const sortedKeys = Object.keys(payloadWithoutSig).sort();
  
  // Concatenate as key1value1key2value2... (no separators)
  let payloadString = '';
  for (const key of sortedKeys) {
    const value = payloadWithoutSig[key];
    // Exclude null, undefined, or empty string values
    if (value !== null && value !== undefined && value !== '') {
      payloadString += `${key}${value}`;
    }
  }
  
  // Generate HMAC-SHA256
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(payloadString);
  return hmac.digest('hex');
}

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { 
      amount, 
      email, 
      firstName, 
      lastName, 
      phone, 
      address, 
      city, 
      state, 
      zip,
      orderId 
    } = body;

    // Validate required fields
    if (!amount || !email || !firstName || !lastName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Build the request payload
    const payload = {
      req_username: MERCHANT_USERNAME,
      transaction_type: 'CAPTURE',
      amount: amount.toString(),
      request_currency: 'USD',
      cust_email: email,
      cust_fname: firstName,
      cust_lname: lastName,
      cust_phone: phone || '',
      bill_addr: address || '',
      bill_addr_city: city || '',
      bill_addr_state: state || '',
      bill_addr_zip: zip || '',
      bill_addr_country: 'US',
      xtl_order_id: orderId || `PP-${Date.now()}`,
      cart_name: 'Peptide-Producers',
      url_cancel: 'https://peptideproducers.com/checkout?status=cancel',
      url_complete: 'https://peptideproducers.com/checkout?status=success',
      url_failed: 'https://peptideproducers.com/checkout?status=failed',
      url_callback: 'https://peptideproducers.com/.netlify/functions/bankful-webhook',
      url_pending: 'https://peptideproducers.com/checkout?status=pending',
      return_redirect_url: 'Y'
    };

    // Generate signature
    const signature = generateSignature(payload, MERCHANT_PASSWORD);
    payload.signature = signature;

    // Call Bankful API
    const response = await fetch(BANKFUL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Bankful API error:', data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Bankful API error', 
          details: data 
        })
      };
    }

    // Return the redirect URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        redirect_url: data.redirect_url
      })
    };

  } catch (error) {
    console.error('Error processing checkout:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
