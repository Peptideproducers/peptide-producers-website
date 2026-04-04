import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-[108px]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-semibold text-[#0B0D12] mb-4">Your cart is empty</h1>
            <p className="text-[#6B7280] mb-8">Looks like you haven't added any products yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[108px]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <h1 className="text-3xl font-semibold text-[#0B0D12] mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-[#F6F7F9] rounded-xl"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-[#6B7280] uppercase tracking-wide">{item.category}</p>
                      <Link to={`/products/${item.productId}`} className="text-lg font-semibold text-[#0B0D12] hover:text-[#2E6FF6] transition-colors">
                        {item.name}
                      </Link>
                      {item.size && (
                        <p className="text-sm text-[#6B7280]">Size: {item.size}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#9CA3AF] hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 hover:border-[#2E6FF6] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 hover:border-[#2E6FF6] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Price */}
                    <p className="text-lg font-semibold text-[#0B0D12]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F6F7F9] rounded-xl p-6 sticky top-[124px]">
              <h2 className="text-xl font-semibold text-[#0B0D12] mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-[#0B0D12]">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/products"
                className="w-full flex items-center justify-center gap-2 mt-3 text-[#2E6FF6] font-medium hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
