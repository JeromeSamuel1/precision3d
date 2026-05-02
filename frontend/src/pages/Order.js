import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Order() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const cartItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      const res = await axios.post(`${API}/checkout`, {
        items: cartItems,
        origin_url: window.location.origin
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" data-testid="order-page">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-['Outfit'] font-bold text-4xl sm:text-5xl text-[#F8FAFC] tracking-tight">
            Your Order
          </h1>
          <p className="mt-3 text-[#94A3B8] text-base">
            Review your items and proceed to checkout.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-[#94A3B8] text-lg" data-testid="empty-order-message">Your cart is empty</p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-[#00E5FF] text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
            >
              Browse Products
            </a>
          </motion.div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-4 bg-[#0A101D] border border-white/10"
                  data-testid={`order-item-${item.id}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#F8FAFC] font-medium">{item.name}</h3>
                    <p className="text-[#00E5FF] font-semibold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
                        data-testid={`order-decrease-${item.id}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[#F8FAFC] text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
                        data-testid={`order-increase-${item.id}`}
                      >
                        <Plus size={12} />
                      </button>
                      <span className="text-[#94A3B8] text-sm ml-2">
                        = ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#94A3B8] hover:text-red-400 transition-colors self-start"
                    data-testid={`order-remove-${item.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-[#0A101D] border border-white/10" data-testid="order-summary">
                <h3 className="font-['Outfit'] font-semibold text-lg text-[#F8FAFC] mb-4">Order Summary</h3>
                
                <div className="space-y-2 border-b border-white/10 pb-4 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#94A3B8]">{item.name} x{item.quantity}</span>
                      <span className="text-[#F8FAFC]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#94A3B8] font-medium">Total</span>
                  <span className="font-['Outfit'] font-bold text-2xl text-[#00E5FF]" data-testid="order-total">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Stripe Checkout */}
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-[#00E5FF] text-[#040914] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  data-testid="stripe-checkout-button"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  {loading ? 'Processing...' : 'Pay with Stripe'}
                </button>

                <p className="text-[#94A3B8] text-xs text-center mt-3">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
