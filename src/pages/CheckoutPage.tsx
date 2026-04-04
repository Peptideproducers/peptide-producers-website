import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Bankful API integration component
function BankfulPaymentButton({ 
  amount, 
  shippingInfo,
  wooOrderId,
  wooOrderNumber 
}: { 
  amount: number; 
  shippingInfo: any;
  wooOrderId: number;
  wooOrderNumber: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the Netlify function to create Bankful payment
      const response = await fetch('/.netlify/functions/bankful-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email: shippingInfo.email,
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          orderId: `PP-${Date.now()}-${wooOrderId}`,
          wooOrderId,
          wooOrderNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      if (data.redirect_url) {
        // Redirect to Bankful hosted payment page
        window.location.href = data.redirect_url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-800">
          You will be redirected to our secure payment processor to complete your purchase.
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Order #{wooOrderNumber}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-[#6B7280]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure payment processed by Bankful
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [wooOrderId, setWooOrderId] = useState<number | null>(null);
  const [wooOrderNumber, setWooOrderNumber] = useState<string>('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-white pt-[108px]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-semibold text-[#0B0D12] mb-4">Your cart is empty</h1>
            <p className="text-[#6B7280] mb-8">Add some products before checking out.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      // Create order in WooCommerce first
      const response = await fetch('/.netlify/functions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variationId: item.variationId
          })),
          shippingInfo,
          totalPrice
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setWooOrderId(data.orderId);
      setWooOrderNumber(data.orderNumber);
      setStep('payment');
      window.scrollTo(0, 0);
    } catch (err: any) {
      setOrderError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white pt-[108px]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-semibold text-[#0B0D12] mb-4">Order Confirmed!</h1>
            <p className="text-[#6B7280] mb-8">
              Thank you for your order. We've sent a confirmation email to {shippingInfo.email}.
              <br />
              Your order will be shipped within 1 business day.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[108px]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Back Link */}
        <Link
          to={step === 'payment' ? '/checkout' : '/cart'}
          onClick={() => step === 'payment' && setStep('shipping')}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#2E6FF6] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 'payment' ? 'Back to Shipping' : 'Back to Cart'}
        </Link>

        <h1 className="text-3xl font-semibold text-[#0B0D12] mb-8">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#2E6FF6]' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-[#2E6FF6] text-white' : 'bg-green-100'}`}>
              {step === 'shipping' ? '1' : <CheckCircle className="w-5 h-5" />}
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#2E6FF6]' : 'text-[#9CA3AF]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-[#2E6FF6] text-white' : 'bg-gray-100'}`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="bg-[#F6F7F9] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5 text-[#2E6FF6]" />
                  <h2 className="text-xl font-semibold text-[#0B0D12]">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">First Name</label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">Last Name</label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">Email</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">Phone</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#0B0D12] mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">City</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">State</label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B0D12] mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingInfo.zip}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#0B0D12] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                      required
                    />
                  </div>
                </div>
                
                {orderError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-800">{orderError}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-[#F6F7F9] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-[#2E6FF6]" />
                  <h2 className="text-xl font-semibold text-[#0B0D12]">Payment Information</h2>
                </div>
                
                <div className="bg-white rounded-xl p-4 mb-6">
                  <p className="text-sm text-[#6B7280] mb-2">Shipping to:</p>
                  <p className="font-medium text-[#0B0D12]">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p className="text-[#6B7280]">{shippingInfo.address}</p>
                  <p className="text-[#6B7280]">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                </div>
                
                <BankfulPaymentButton 
                  amount={totalPrice} 
                  shippingInfo={shippingInfo}
                  wooOrderId={wooOrderId!}
                  wooOrderNumber={wooOrderNumber}
                />
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F6F7F9] rounded-xl p-6 sticky top-[124px]">
              <h2 className="text-xl font-semibold text-[#0B0D12] mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B0D12] truncate">{item.name}</p>
                      <p className="text-xs text-[#6B7280]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#0B0D12]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold text-[#0B0D12]">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
