import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
          <div className="w-8 h-8 border border-[#00E5FF] rotate-45 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#00E5FF] rotate-0"></div>
          </div>
          <span className="font-['Outfit'] font-bold text-lg tracking-tight text-[#F8FAFC]">
            Precision<span className="text-[#00E5FF]">3D</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-300 ${
                location.pathname === link.path
                  ? 'text-[#00E5FF]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 border border-white/10 rounded-sm hover:border-[#00E5FF]/50 transition-colors duration-300"
            data-testid="cart-button"
          >
            <ShoppingCart size={18} className="text-[#F8FAFC]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00E5FF] text-[#040914] text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#F8FAFC]"
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
            data-testid="mobile-menu"
          >
            <nav className="px-6 py-4 flex flex-col gap-3">
              {links.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 ${
                    location.pathname === link.path ? 'text-[#00E5FF]' : 'text-[#94A3B8]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
