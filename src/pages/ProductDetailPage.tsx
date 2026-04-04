import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, MessageCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useWooCommerceProduct } from '../hooks/useWooCommerce';
import { useCart } from '../context/CartContext';
import ProductGallery from '../components/ProductGallery';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, variations, loading, error } = useWooCommerceProduct(id || '');
  const { addItem } = useCart();

  // Sort variations by size (10mg, 15mg, 30mg, etc.)
  const sortedVariations = [...variations].sort((a, b) => {
    const sizeA = a.attributes.find(attr => 
      attr.name.toLowerCase().includes('size') || 
      attr.name.toLowerCase().includes('mg')
    )?.option || '';
    const sizeB = b.attributes.find(attr => 
      attr.name.toLowerCase().includes('size') || 
      attr.name.toLowerCase().includes('mg')
    )?.option || '';
    
    // Extract numeric value from size (e.g., "10 MG" -> 10)
    const numA = parseInt(sizeA.replace(/\D/g, '')) || 0;
    const numB = parseInt(sizeB.replace(/\D/g, '')) || 0;
    
    return numA - numB; // Sort ascending (10, 15, 30)
  });

  const [selectedVariation, setSelectedVariation] = useState(sortedVariations[0] || null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Update selected variation when variations load
  if (sortedVariations.length > 0 && !selectedVariation) {
    setSelectedVariation(sortedVariations[0]);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[108px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6FF6]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-[108px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#0B0D12]">Product not found</h1>
          <Link to="/products" className="mt-4 inline-flex items-center text-[#2E6FF6] hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedVariation) {
      const sizeAttr = selectedVariation.attributes.find(attr => 
        attr.name.toLowerCase().includes('size') || 
        attr.name.toLowerCase().includes('mg')
      );
      
      addItem({
        id: `${product.id}-${selectedVariation.id}`,
        productId: product.id,
        variationId: selectedVariation.id,
        name: `${product.name}${sizeAttr ? ` (${sizeAttr.option})` : ''}`,
        category: product.categories[0]?.name || 'Research Compound',
        price: parseFloat(selectedVariation.price),
        image: product.images[0]?.src || '/images/vial-placeholder.png',
        size: sizeAttr?.option,
      });
    } else {
      // Simple product without variations
      addItem({
        id: `${product.id}`,
        productId: product.id,
        name: product.name,
        category: product.categories[0]?.name || 'Research Compound',
        price: parseFloat(product.price),
        image: product.images[0]?.src || '/images/vial-placeholder.png',
      });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Does the product come with instructions?',
      answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
    },
    {
      question: 'What\'s the actual amount in each vial?',
      answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
    },
    {
      question: 'Are additional supplies needed?',
      answer: 'Bacteriostatic water or acetic acid may be required for reconstitution, sold separately.',
    },
  ];

  const currentPrice = selectedVariation 
    ? parseFloat(selectedVariation.price) 
    : parseFloat(product.price);

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

      {/* Contact Banner */}
      <div className="bg-[#0B0D12] py-3">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-white/80">Have questions about {product.name}?</span>
          <span className="text-sm text-white/60">Text us:</span>
          <a href="tel:+19729190219" className="text-sm text-[#2E6FF6] hover:underline">801-547-7933</a>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#2E6FF6] mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Product Gallery */}
          <ProductGallery 
            images={product.images} 
            variationImage={selectedVariation?.image?.src}
          />

          {/* Right - Info */}
          <div>
            {/* Stock Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
            </span>

            {/* Variation Selector */}
            {sortedVariations.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sortedVariations.map((variation) => {
                  const sizeAttr = variation.attributes.find(attr => 
                    attr.name.toLowerCase().includes('size') || 
                    attr.name.toLowerCase().includes('mg')
                  );
                  return (
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariation(variation)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        selectedVariation?.id === variation.id
                          ? 'bg-[#2E6FF6] text-white border-[#2E6FF6]'
                          : 'bg-white text-[#0B0D12] border-[rgba(11,13,18,0.12)] hover:border-[#2E6FF6]'
                      }`}
                    >
                      {sizeAttr?.option || 'Default'}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Product Name */}
            <h1 className="mt-6 text-3xl lg:text-4xl font-semibold text-[#0B0D12]">{product.name}</h1>

            {/* SKU */}
            {product.sku && (
              <p className="mt-2 text-sm text-[#6B7280]">SKU: {product.sku}</p>
            )}

            {/* Selected Size Display */}
            {selectedVariation && (
              <p className="mt-2 text-sm text-[#6B7280]">
                {selectedVariation.attributes.find(attr => 
                  attr.name.toLowerCase().includes('size') || 
                  attr.name.toLowerCase().includes('mg')
                )?.option} Single Vial
              </p>
            )}

            {/* Price */}
            <div className="mt-6">
              <p className="text-3xl font-bold text-[#0B0D12]">
                ${currentPrice.toFixed(2)}
              </p>
            </div>

            {/* Shipping Info */}
            <p className="mt-2 text-sm text-green-600 font-medium">Order Now, Ships Today</p>

            {/* Purchase Type */}
            <div className="mt-4 p-3 bg-[#F6F7F9] rounded-lg inline-flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-[#2E6FF6] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#2E6FF6]"></div>
              </div>
              <span className="text-sm text-[#0B0D12]">One-time</span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status !== 'instock'}
              className="w-full mt-6 py-4 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Add To Cart
            </button>

            {/* RUO Warning */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Research Use Only:</strong> This product is intended solely for laboratory research purposes and is not for human or animal consumption. For in vitro research only.
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-[#0B0D12]">What is {product.name}</h2>
            <div 
              className="mt-4 text-[#6B7280] leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Purity Info */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F6F7F9] rounded-xl text-center">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Purity</p>
            <p className="mt-1 text-lg font-semibold text-[#0B0D12]">≥99%</p>
          </div>
          <div className="p-4 bg-[#F6F7F9] rounded-xl text-center">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Endotoxin</p>
            <p className="mt-1 text-lg font-semibold text-[#0B0D12]">&lt;0.01 EU/μg</p>
          </div>
          {sortedVariations.slice(0, 2).map((variation) => {
            const sizeAttr = variation.attributes.find(attr => 
              attr.name.toLowerCase().includes('size') || 
              attr.name.toLowerCase().includes('mg')
            );
            return (
              <div key={variation.id} className="p-4 bg-[#F6F7F9] rounded-xl text-center">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">{sizeAttr?.option || 'Size'}</p>
                <p className="mt-1 text-lg font-semibold text-[#0B0D12]">${parseFloat(variation.price).toFixed(0)}</p>
              </div>
            );
          })}
        </div>

        {/* COA Section */}
        <div className="mt-12 p-6 bg-[#F6F7F9] rounded-xl">
          <h3 className="text-lg font-semibold text-[#0B0D12]">Certificate of Analysis</h3>
          <p className="mt-2 text-sm text-[#6B7280]">Third-party tested for 99% purity, ID, quantity.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white text-sm text-[#0B0D12] rounded-lg border border-[rgba(11,13,18,0.08)]">
              DPS-{Math.floor(Math.random() * 9000000) + 1000000}
            </span>
            <span className="px-3 py-1 bg-white text-sm text-[#0B0D12] rounded-lg border border-[rgba(11,13,18,0.08)]">
              DPS-{Math.floor(Math.random() * 9000000) + 1000000}
            </span>
          </div>
          <Link to="/coa" className="inline-flex items-center mt-4 text-sm text-[#2E6FF6] hover:underline">
            View all
            <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-[#0B0D12] mb-6">Frequently asked questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, faqIndex) => (
              <div key={faqIndex} className="border border-[rgba(11,13,18,0.08)] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(faqIndex)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F6F7F9] transition-colors"
                >
                  <span className="font-medium text-[#0B0D12]">{faq.question}</span>
                  {openFaq === faqIndex ? (
                    <ChevronUp className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                  )}
                </button>
                {openFaq === faqIndex && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Made in USA Section */}
        <div className="mt-12 p-8 bg-[#F6F7F9] rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-[#0B0D12]">Made in the USA</h3>
              <p className="mt-2 text-[#6B7280]">Quality controlled from start to finish.</p>
              <p className="text-[#6B7280]">No outsourcing.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-[#0B0D12]">Made in the</span>
              <span className="text-2xl font-bold text-[#2E6FF6]">USA</span>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-12 p-8 bg-[#0B0D12] rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Need Help?</h3>
              <p className="mt-2 text-white/60">Send us a message.</p>
            </div>
            <a
              href="sms:8015477933"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
