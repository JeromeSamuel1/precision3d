import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('checking');
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }
    pollStatus(sessionId, 0);
  }, [sessionId]);

  const pollStatus = async (sid, attempts) => {
    if (attempts >= 5) {
      setStatus('timeout');
      return;
    }
    try {
      const res = await axios.get(`${API}/checkout/status/${sid}`);
      if (res.data.payment_status === 'paid') {
        setStatus('success');
        clearCart();
        return;
      }
      if (res.data.status === 'expired') {
        setStatus('expired');
        return;
      }
      // Keep polling
      setTimeout(() => pollStatus(sid, attempts + 1), 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center" data-testid="order-success-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 bg-[#0A101D] border border-white/10 text-center"
      >
        {status === 'checking' && (
          <>
            <Loader2 size={48} className="text-[#00E5FF] animate-spin mx-auto mb-4" />
            <h2 className="font-['Outfit'] font-bold text-2xl text-[#F8FAFC]" data-testid="checking-status">
              Verifying Payment...
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">Please wait while we confirm your order.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="font-['Outfit'] font-bold text-2xl text-[#F8FAFC]" data-testid="success-status">
              Payment Successful!
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              Thank you for your order. Your items will be printed and shipped soon.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-[#00E5FF] text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </>
        )}

        {(status === 'error' || status === 'expired' || status === 'timeout') && (
          <>
            <XCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-['Outfit'] font-bold text-2xl text-[#F8FAFC]" data-testid="error-status">
              {status === 'expired' ? 'Session Expired' : 'Something went wrong'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {status === 'timeout'
                ? 'Payment verification timed out. Check your email for confirmation.'
                : 'Please try again or contact support.'}
            </p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-[#00E5FF] text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
              data-testid="retry-button"
            >
              Return to Cart
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
