import { useState, useEffect } from 'react';
import { getProducts, getProductBySlug, getProductVariations, type WooCommerceProduct, type WooCommerceVariation } from '../services/woocommerce';

export const useWooCommerceProducts = () => {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        // Sort products alphabetically by name
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sortedData);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useWooCommerceProduct = (slug: string) => {
  const [product, setProduct] = useState<WooCommerceProduct | null>(null);
  const [variations, setVariations] = useState<WooCommerceVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductBySlug(slug);
        if (productData) {
          setProduct(productData);
          if (productData.variations.length > 0) {
            const variationsData = await getProductVariations(productData.id);
            setVariations(variationsData);
          }
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, variations, loading, error };
};
