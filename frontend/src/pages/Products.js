import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/products`);
        setProducts(res.data);
      } catch (e) {
        console.error('Failed to fetch products', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" data-testid="products-page">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#3B82F6] border border-[#3B82F6] bg-blue-900/20 px-3 py-1">
            Collection
          </span>
          <h1 className="font-['Outfit'] font-bold text-4xl sm:text-5xl text-[#F8FAFC] tracking-tight mt-4">
            Our Products
          </h1>
          <p className="mt-3 text-[#94A3B8] text-base max-w-lg">
            Each piece is designed from scratch and printed with precision.
          </p>
        </motion.div>

        {/* Product Grid - Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {products.map((product, i) => {
            // Bento layout: first item spans more
            const span = i === 0 ? 'md:col-span-7' : i === 1 ? 'md:col-span-5' : 'md:col-span-4';
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${span} group relative bg-[#0A101D] border border-white/10 hover:border-[#00E5FF]/30 transition-all duration-500 overflow-hidden glow-border`}
                data-testid={`product-card-${product.id}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-transparent to-transparent"></div>
                  
                  {/* Material Badge */}
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase border border-[#3B82F6] text-[#3B82F6] bg-blue-900/20 px-2 py-0.5">
                    {product.material}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-['Outfit'] font-semibold text-xl text-[#F8FAFC] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Colors */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.colors.map(color => (
                      <span key={color} className="text-[10px] text-[#94A3B8] border border-white/10 px-2 py-0.5 rounded-sm">
                        {color}
                      </span>
                    ))}
                  </div>

                  {/* Price + Add */}
                  <div className="flex items-center justify-between">
                    <span className="font-['Outfit'] font-bold text-2xl text-[#00E5FF]">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addItem(product)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#00E5FF] text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <Plus size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
