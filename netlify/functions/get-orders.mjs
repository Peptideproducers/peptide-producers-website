// Get order history by email from WooCommerce

const WOO_URL = 'https://darrohnjon-sqlio.wpcomstaging.com';
const CONSUMER_KEY = 'ck_184f3b9f79977d4882c09c4cae9f34cf8ffb50d9';
const CONSUMER_SECRET = 'cs_9d30110b017dcefccff9b6196e25eeed65c6b19d';

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Get email from query params
    const params = new URLSearchParams(event.queryStringParameters);
    const email = params.get('email');

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Fetch orders from WooCommerce by billing email
    const response = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders?billing_email=${encodeURIComponent(email)}&per_page=50`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WooCommerce error:', errorData);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to fetch orders', 
          details: errorData 
        })
      };
    }

    const orders = await response.json();

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      number: order.number,
      status: order.status,
      date: order.date_created,
      total: parseFloat(order.total),
      currency: order.currency,
      items: order.line_items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      })),
      shipping: order.shipping
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orders: formattedOrders
      })
    };

  } catch (error) {
    console.error('Error fetching orders:', error);
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
