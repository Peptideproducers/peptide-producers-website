import axios from 'axios';

const STORE_URL = 'https://darrohnjon-sqlio.wpcomstaging.com';
const CONSUMER_KEY = 'ck_184f3b9f79977d4882c09c4cae9f34cf8ffb50d9';
const CONSUMER_SECRET = 'cs_9d30110b017dcefccff9b6196e25eeed65c6b19d';

const woocommerceApi = axios.create({
  baseURL: `${STORE_URL}/wp-json/wc/v3`,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
});

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
  attributes: {
    id: number;
    name: string;
    options: string[];
  }[];
  variations: number[];
  stock_status: string;
  sku: string;
}

export interface WooCommerceVariation {
  id: number;
  price: string;
  regular_price: string;
  attributes: {
    name: string;
    option: string;
  }[];
  stock_status: string;
  image?: {
    id: number;
    src: string;
    alt: string;
  };
}

export const getProducts = async (): Promise<WooCommerceProduct[]> => {
  try {
    const response = await woocommerceApi.get('/products', {
      params: {
        per_page: 100,
        status: 'publish',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (id: number): Promise<WooCommerceProduct | null> => {
  try {
    const response = await woocommerceApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getProductBySlug = async (slug: string): Promise<WooCommerceProduct | null> => {
  try {
    const response = await woocommerceApi.get('/products', {
      params: {
        slug,
        status: 'publish',
      },
    });
    if (response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

export const getProductVariations = async (productId: number): Promise<WooCommerceVariation[]> => {
  try {
    const response = await woocommerceApi.get(`/products/${productId}/variations`, {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching variations:', error);
    return [];
  }
};

export const createOrder = async (orderData: {
  payment_method: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  line_items: {
    product_id: number;
    variation_id?: number;
    quantity: number;
  }[];
}) => {
  try {
    const response = await woocommerceApi.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
