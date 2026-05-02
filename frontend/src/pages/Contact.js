import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" data-testid="contact-page">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#3B82F6] border border-[#3B82F6] bg-blue-900/20 px-3 py-1">
            Get in Touch
          </span>
          <h1 className="font-['Outfit'] font-bold text-4xl sm:text-5xl text-[#F8FAFC] tracking-tight mt-4">
            Contact Us
          </h1>
          <p className="mt-3 text-[#94A3B8] text-base max-w-lg">
            Have a question or custom request? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="p-8 bg-[#0A101D] border border-white/10 text-center" data-testid="contact-success">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
                <h3 className="font-['Outfit'] font-semibold text-xl text-[#F8FAFC]">Message Sent!</h3>
                <p className="text-[#94A3B8] text-sm mt-2">We'll get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2 border border-[#00E5FF] text-[#00E5FF] text-sm hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <label className="text-[#94A3B8] text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A101D] border border-white/10 text-[#F8FAFC] placeholder-[#64748b] focus:border-[#00E5FF] focus:outline-none transition-colors"
                    placeholder="Your name"
                    required
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] text-sm block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A101D] border border-white/10 text-[#F8FAFC] placeholder-[#64748b] focus:border-[#00E5FF] focus:outline-none transition-colors"
                    placeholder="you@email.com"
                    required
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] text-sm block mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0A101D] border border-white/10 text-[#F8FAFC] placeholder-[#64748b] focus:border-[#00E5FF] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project or question..."
                    required
                    data-testid="contact-message-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 border border-[#00E5FF] text-[#00E5FF] font-medium text-sm hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300 disabled:opacity-50"
                  data-testid="contact-submit-button"
                >
                  <Send size={14} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-6 bg-[#0A101D] border border-white/10">
              <Mail size={20} className="text-[#00E5FF] mb-3" />
              <h4 className="font-['Outfit'] font-medium text-[#F8FAFC] mb-1">Email</h4>
              <p className="text-[#94A3B8] text-sm">hello@precision3d.com</p>
            </div>
            <div className="p-6 bg-[#0A101D] border border-white/10">
              <MessageSquare size={20} className="text-[#00E5FF] mb-3" />
              <h4 className="font-['Outfit'] font-medium text-[#F8FAFC] mb-1">Custom Orders</h4>
              <p className="text-[#94A3B8] text-sm">
                Need something special? Describe your idea and we'll work with you to bring it to life.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
