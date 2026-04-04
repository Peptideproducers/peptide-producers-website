// Webhook to receive payment status updates from Bankful
// Updates WooCommerce order status accordingly

const WOO_URL = 'https://darrohnjon-sqlio.wpcomstaging.com';
const CONSUMER_KEY = 'ck_184f3b9f79977d4882c09c4cae9f34cf8ffb50d9';
const CONSUMER_SECRET = 'cs_9d30110b017dcefccff9b6196e25eeed65c6b19d';

export const handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Bankful webhook received:', body);

    // Extract order info from webhook
    // Bankful sends various data depending on the event type
    const { 
      trans_status_name, 
      trans_request_id,
      xtl_order_id,
      amount 
    } = body;

    // Find the WooCommerce order by the order ID we passed
    // We stored the WooCommerce order ID in xtl_order_id or trans_request_id
    let wooOrderId = null;
    
    // Try to extract order ID from various possible fields
    if (xtl_order_id && xtl_order_id.startsWith('PP-')) {
      // The order ID might be embedded in our custom order ID
      // Format: PP-{timestamp}-{wooOrderId}
      const parts = xtl_order_id.split('-');
      if (parts.length >= 3) {
        wooOrderId = parts[2];
      }
    }

    if (!wooOrderId) {
      console.log('Could not extract WooCommerce order ID from webhook');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Webhook received but no order ID found' })
      };
    }

    // Determine new status based on Bankful status
    let newStatus = 'pending';
    if (trans_status_name === 'APPROVED' || trans_status_name === 'SUCCESS') {
      newStatus = 'processing';
    } else if (trans_status_name === 'FAILED' || trans_status_name === 'DECLINED') {
      newStatus = 'failed';
    } else if (trans_status_name === 'PENDING') {
      newStatus = 'on-hold';
    }

    // Update order in WooCommerce
    const updateResponse = await fetch(`${WOO_URL}/wp-json/wc/v3/orders/${wooOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
      },
      body: JSON.stringify({
        status: newStatus,
        meta_data: [
          {
            key: '_bankful_transaction_id',
            value: trans_request_id || ''
          },
          {
            key: '_bankful_status',
            value: trans_status_name || ''
          }
        ]
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Failed to update order:', errorData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update order' })
      };
    }

    const updatedOrder = await updateResponse.json();
    console.log('Order updated successfully:', updatedOrder.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Order status updated',
        orderId: updatedOrder.id,
        newStatus: newStatus
      })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
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
