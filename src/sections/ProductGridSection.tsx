import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { useWooCommerceProducts } from '../hooks/useWooCommerce';
import { useCart } from '../context/CartContext';

export default function ProductGridSection() {
  const { addItem } = useCart();
  const { products, loading } = useWooCommerceProducts();

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}`,
      productId: product.id,
      name: product.name,
      category: product.categories[0]?.name || 'Research Compound',
      price: parseFloat(product.price),
      image: product.images[0]?.src || '/images/vial-placeholder.png',
    });
  };

  // Show only first 8 products on homepage
  const displayProducts = products.slice(0, 8);

  return (
    <section 
      id="products"
      className="relative bg-white z-30 py-16 lg:py-24 scroll-mt-[108px]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0B0D12]">
            Explore our products
          </h2>
          <Link 
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 text-[#2E6FF6] font-medium hover:underline"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E6FF6]" />
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="product-card group"
                >
                  {/* Image */}
                  <Link 
                    to={`/products/${product.slug}`}
                    className="relative aspect-square bg-[#F6F7F9] overflow-hidden block"
                  >
                    {product.images.length > 0 ? (
                      <img 
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                      {product.categories[0]?.name || 'Research Compound'}
                    </span>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="mt-1 text-lg font-semibold text-[#0B0D12] group-hover:text-[#2E6FF6] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-[#6B7280]">from</span>
                        <span className="ml-1 text-xl font-semibold text-[#0B0D12]">
                          ${product.price}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2E6FF6] text-white text-sm font-medium rounded-full hover:bg-[#1a5ad4] transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-8 text-center sm:hidden">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 text-[#2E6FF6] font-medium"
              >
                View all products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
