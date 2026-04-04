import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { useWooCommerceProducts } from '../hooks/useWooCommerce';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error } = useWooCommerceProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories.some(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[108px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6FF6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-[108px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-[#2E6FF6] hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[108px]">
      {/* RUO Banner */}
      <div className="bg-[#F6F7F9] border-b border-[rgba(11,13,18,0.08)] py-2">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <p className="text-xs text-center text-[#6B7280]">
            <span className="font-semibold">Research Use Only:</span> All products currently listed on this site are for research purposes ONLY.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <h2 className="text-lg font-semibold text-[#0B0D12] mb-4">Product Catalog</h2>
            <nav className="space-y-1">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="flex items-center justify-between py-2 px-3 text-sm text-[#6B7280] hover:text-[#2E6FF6] hover:bg-[#F6F7F9] rounded-lg transition-colors"
                >
                  {product.name}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-[#0B0D12]">Explore our products</h1>
              <p className="mt-2 text-[#6B7280]">All orders ship same day from our US facility.</p>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search by product name or type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F6F7F9] border border-transparent rounded-xl text-[#0B0D12] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2E6FF6] focus:bg-white transition-colors"
              />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group bg-white border border-[rgba(11,13,18,0.08)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-[#F6F7F9] p-6 flex items-center justify-center">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5 text-center">
                    {product.sku && (
                      <p className="text-xs text-[#9CA3AF] mb-1">SKU: {product.sku}</p>
                    )}
                    {product.categories.length > 0 && (
                      <p className="text-xs text-[#9CA3AF] mb-1">{product.categories[0].name}</p>
                    )}
                    <h3 className="text-lg font-semibold text-[#0B0D12] mb-2">{product.name}</h3>
                    <p className="text-sm text-[#6B7280] mb-3">
                      from <span className="text-lg font-semibold text-[#0B0D12]">${product.price}</span>
                    </p>
                    <span className="inline-flex items-center justify-center px-6 py-2 bg-[#2E6FF6] text-white text-sm font-medium rounded-full group-hover:bg-[#1a5ad4] transition-colors">
                      Learn More
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6B7280]">No products found matching your search.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
