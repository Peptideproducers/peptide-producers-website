import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Package, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

interface Order {
  id: number;
  number: string;
  total: number;
  status: string;
  date: string;
  currency: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderTrackingPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);
    setOrders([]);

    try {
      // Fetch orders from WooCommerce via Netlify function
      const response = await fetch(`/.netlify/functions/get-orders?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[108px]">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#2E6FF6] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0B0D12] mb-2">Track Your Order</h1>
          <p className="text-[#6B7280] mb-8">
            Enter your email address to view your order history and track shipments.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F6F7F9] border border-gray-200 rounded-xl text-[#0B0D12] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2E6FF6] transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#2E6FF6] text-white font-medium rounded-full hover:bg-[#1a5ad4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {searched && !loading && orders.length === 0 && !error && (
            <div className="bg-[#F6F7F9] rounded-xl p-6">
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-[#2E6FF6] mb-4" />
                <h3 className="text-xl font-semibold text-[#0B0D12] mb-2">
                  No Orders Found
                </h3>
                <p className="text-[#6B7280] max-w-md mx-auto mb-6">
                  We couldn't find any orders associated with this email address. Make sure you entered the correct email used during checkout.
                </p>
                <p className="text-sm text-[#6B7280]">
                  Can't find your order? Check your spam folder or{' '}
                  <a href="mailto:info@peptideproducers.com" className="text-[#2E6FF6] hover:underline">
                    contact us
                  </a>
                  {' '}with your order details.
                </p>
              </div>
            </div>
          )}

          {/* Orders Display */}
          {orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0B0D12]">Your Orders ({orders.length})</h3>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#F6F7F9] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium text-[#0B0D12]">Order #{order.number}</p>
                        <p className="text-sm text-[#6B7280]">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#0B0D12]">${(order.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-[#6B7280] capitalize">{order.status.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-2">Items</p>
                    <div className="space-y-1">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-[#0B0D12]">{item.name || 'Unknown Item'} x{item.quantity || 1}</span>
                          <span className="text-[#6B7280]">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
