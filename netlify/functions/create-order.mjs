// Create order in WooCommerce and return order ID
// Then redirect to Bankful for payment

const WOO_URL = 'https://darrohnjon-sqlio.wpcomstaging.com';
const CONSUMER_KEY = 'ck_184f3b9f79977d4882c09c4cae9f34cf8ffb50d9';
const CONSUMER_SECRET = 'cs_9d30110b017dcefccff9b6196e25eeed65c6b19d';

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { 
      items, 
      shippingInfo, 
      totalPrice,
      billingInfo
    } = body;

    // Build line items for WooCommerce
    const lineItems = items.map(item => ({
      product_id: parseInt(item.productId),
      quantity: item.quantity,
      ...(item.variationId && { variation_id: parseInt(item.variationId) })
    }));

    // Create order in WooCommerce
    const orderData = {
      status: 'pending', // Will be updated to 'processing' after payment
      currency: 'USD',
      total: totalPrice.toString(),
      billing: {
        first_name: billingInfo?.firstName || shippingInfo.firstName,
        last_name: billingInfo?.lastName || shippingInfo.lastName,
        address_1: billingInfo?.address || shippingInfo.address,
        city: billingInfo?.city || shippingInfo.city,
        state: billingInfo?.state || shippingInfo.state,
        postcode: billingInfo?.zip || shippingInfo.zip,
        country: 'US',
        email: shippingInfo.email,
        phone: shippingInfo.phone
      },
      shipping: {
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        address_1: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postcode: shippingInfo.zip,
        country: 'US'
      },
      line_items: lineItems,
      shipping_lines: [
        {
          method_id: 'free_shipping',
          method_title: 'Free Shipping',
          total: '0.00'
        }
      ],
      meta_data: [
        {
          key: '_payment_method',
          value: 'bankful'
        },
        {
          key: '_payment_method_title',
          value: 'Credit Card (Bankful)'
        }
      ]
    };

    // Create order in WooCommerce
    const response = await fetch(`${WOO_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WooCommerce error:', errorData);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to create order', 
          details: errorData 
        })
      };
    }

    const order = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber: order.number
      })
    };

  } catch (error) {
    console.error('Error creating order:', error);
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
