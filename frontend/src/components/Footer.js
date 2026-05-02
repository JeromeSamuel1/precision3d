import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040914] py-12 px-6" data-testid="main-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 border border-[#00E5FF] rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#00E5FF]"></div>
            </div>
            <span className="font-['Outfit'] font-bold text-sm text-[#F8FAFC]">
              Precision<span className="text-[#00E5FF]">3D</span>
            </span>
          </Link>
          <p className="text-[#94A3B8] text-xs max-w-xs">
            Premium 3D-printed products designed with precision and crafted with care.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12">
          <div>
            <h4 className="font-['Outfit'] font-medium text-[#F8FAFC] text-sm mb-3">Shop</h4>
            <div className="space-y-2">
              <Link to="/products" className="block text-[#94A3B8] text-xs hover:text-[#00E5FF] transition-colors">
                All Products
              </Link>
              <Link to="/order" className="block text-[#94A3B8] text-xs hover:text-[#00E5FF] transition-colors">
                Cart
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-['Outfit'] font-medium text-[#F8FAFC] text-sm mb-3">Company</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-[#94A3B8] text-xs hover:text-[#00E5FF] transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-[#94A3B8] text-xs hover:text-[#00E5FF] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5">
        <p className="text-[#64748b] text-xs">
          &copy; {new Date().getFullYear()} Precision3D. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
