import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PRODUCTS = [
  {
    id: 1,
    name: 'Fidget Cone',
    description: 'A satisfying spiral-textured cone designed for tactile stimulation. Precision-printed with smooth layer adhesion and available in multiple colors.',
    price: 5.00,
    material: 'PLA',
    image: '/../img/fidgetcone.png',
    colors: ['White', 'Black', 'Green', 'Red', 'Blue'],
  },
  {
    id: 2,
    name: 'Infinity Cube',
    description: 'A compact, foldable fidget cube with satisfying articulation. Engineered for smooth movement and everyday durability.',
    price: 4.00,
    material: 'PLA',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    colors: ['White', 'Black', 'Green', 'Orange', 'Purple'],
  },
];

export default function Products() {
  const { addItem } = useCart();
  const [added, setAdded] = useState({});

  const handleAdd = (product) => {
    addItem(product);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1500);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {PRODUCTS.map((product, i) => {
            const span = i === 0 ? 'md:col-span-7' : 'md:col-span-5';
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

                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.colors.map(color => (
                      <span key={color} className="text-[10px] text-[#94A3B8] border border-white/10 px-2 py-0.5 rounded-sm">
                        {color}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-['Outfit'] font-bold text-2xl text-[#00E5FF]">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAdd(product)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#00E5FF] text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <Plus size={14} />
                      {added[product.id] ? 'Added!' : 'Add to Cart'}
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
