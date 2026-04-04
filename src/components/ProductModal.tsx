import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '../context/CartContext';
import { getProduct, getProductVariations, type WooCommerceProduct, type WooCommerceVariation } from '../services/woocommerce';

interface ProductModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<WooCommerceProduct | null>(null);
  const [variations, setVariations] = useState<WooCommerceVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<WooCommerceVariation | null>(null);
  const [loading, setLoading] = useState(false);

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
    
    const numA = parseInt(sizeA.replace(/\D/g, '')) || 0;
    const numB = parseInt(sizeB.replace(/\D/g, '')) || 0;
    
    return numA - numB;
  });

  useEffect(() => {
    if (productId && isOpen) {
      setLoading(true);
      getProduct(productId).then(productData => {
        if (productData) {
          setProduct(productData);
          if (productData.variations.length > 0) {
            getProductVariations(productData.id).then(variationsData => {
              setVariations(variationsData);
              // Set first sorted variation as selected
              const sorted = [...variationsData].sort((a, b) => {
                const sizeA = a.attributes.find(attr => 
                  attr.name.toLowerCase().includes('size') || 
                  attr.name.toLowerCase().includes('mg')
                )?.option || '';
                const sizeB = b.attributes.find(attr => 
                  attr.name.toLowerCase().includes('size') || 
                  attr.name.toLowerCase().includes('mg')
                )?.option || '';
                const numA = parseInt(sizeA.replace(/\D/g, '')) || 0;
                const numB = parseInt(sizeB.replace(/\D/g, '')) || 0;
                return numA - numB;
              });
              setSelectedVariation(sorted[0] || null);
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
    } else {
      setProduct(null);
      setVariations([]);
      setSelectedVariation(null);
    }
  }, [productId, isOpen]);

  if (!product) return null;

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
      onClose();
    } else {
      addItem({
        id: `${product.id}`,
        productId: product.id,
        name: product.name,
        category: product.categories[0]?.name || 'Research Compound',
        price: parseFloat(product.price),
        image: product.images[0]?.src || '/images/vial-placeholder.png',
      });
      onClose();
    }
  };

  const currentPrice = selectedVariation 
    ? parseFloat(selectedVariation.price) 
    : parseFloat(product.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name} - Product Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E6FF6]" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            {/* Product Image */}
            <div className="bg-[#F6F7F9] p-8 flex items-center justify-center">
              {product.images.length > 0 ? (
                <img 
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-full max-w-[280px] h-auto object-contain"
                />
              ) : (
                <div className="w-full max-w-[280px] aspect-square bg-gray-200 rounded-lg" />
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8">
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-[#F6F7F9] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>

              {/* Category */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2E6FF6]/10 text-[#2E6FF6] text-xs font-medium rounded-full">
                {product.categories[0]?.name || 'Research Compound'}
              </span>

              {/* Product Name */}
              <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-[#0B0D12]">
                {product.name}
              </h2>

              {/* SKU */}
              {product.sku && (
                <p className="mt-2 text-sm text-[#6B7280]">SKU: {product.sku}</p>
              )}

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
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                          selectedVariation?.id === variation.id
                            ? 'bg-[#2E6FF6] text-white border-[#2E6FF6]'
                            : 'bg-white text-[#0B0D12] border-[rgba(11,13,18,0.12)] hover:border-[#2E6FF6]'
                        }`}
                      >
                        {sizeAttr?.option || 'Default'} - ${parseFloat(variation.price).toFixed(0)}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Price */}
              <div className="mt-4">
                <span className="text-2xl font-bold text-[#0B0D12]">
                  ${currentPrice.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              {product.short_description && (
                <div 
                  className="mt-4 text-sm text-[#6B7280] leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Key Features */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-[#0B0D12] uppercase tracking-wide">
                  Key Features
                </h3>
                <ul className="mt-2 space-y-1">
                  {[
                    '≥99% purity verified by HPLC',
                    'Manufactured in USA',
                    'Third-party batch tested',
                    'Certificate of Analysis included',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#2E6FF6] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* RUO Warning */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Research Use Only:</strong> This product is intended solely for laboratory research purposes and is not for human or animal consumption.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - ${currentPrice.toFixed(2)}
                </button>
                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="w-full py-3 bg-white text-[#0B0D12] font-medium rounded-full border border-[rgba(11,13,18,0.12)] hover:bg-[#F6F7F9] transition-colors flex items-center justify-center"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
