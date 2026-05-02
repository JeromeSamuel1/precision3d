import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden" data-testid="hero-section">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1741997852892-c66495f0d3c5"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040914] via-[#040914]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-transparent to-[#040914]/50"></div>
        </div>

        {/* Animated glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-[#3B82F6] border border-[#3B82F6] bg-blue-900/20 px-3 py-1 mb-6">
              Precision Engineered
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="font-['Outfit'] font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-[#F8FAFC] max-w-3xl"
          >
            Transform Ideas<br />
            Into <span className="text-[#00E5FF]">Reality</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 text-base md:text-lg text-[#94A3B8] max-w-xl leading-relaxed"
          >
            Premium 3D-printed products designed with precision and crafted with care. 
            From desk toys to accessories, each piece is engineered for perfection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-6 py-3 border border-[#00E5FF] text-[#00E5FF] font-medium text-sm hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
              data-testid="shop-now-button"
            >
              Shop Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-[#94A3B8] font-medium text-sm hover:border-white/30 hover:text-[#F8FAFC] transition-all duration-300"
              data-testid="learn-more-button"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-['Outfit'] font-bold text-3xl sm:text-4xl text-[#F8FAFC] tracking-tight">
              Why Precision<span className="text-[#00E5FF]">3D</span>
            </h2>
            <p className="mt-3 text-[#94A3B8] text-base max-w-lg">
              Every product is designed and printed in-house with meticulous attention to detail.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: 'Layer-Perfect Printing',
                desc: 'Ultra-fine 0.1mm layer resolution for smooth surfaces and tight tolerances.',
              },
              {
                icon: Zap,
                title: 'Original Designs',
                desc: 'Every product is designed from scratch. Unique pieces you won\'t find anywhere else.',
              },
              {
                icon: Shield,
                title: 'Premium Materials',
                desc: 'PLA+, PETG, and specialty filaments chosen for durability and aesthetics.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 bg-[#0A101D] border border-white/10 hover:border-[#00E5FF]/30 transition-all duration-300 group glow-border"
                data-testid={`feature-card-${i}`}
              >
                <feature.icon
                  size={28}
                  className="text-[#00E5FF] mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-['Outfit'] font-semibold text-lg text-[#F8FAFC] mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6" data-testid="cta-section">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="p-12 md:p-16 border border-white/10 bg-[#0A101D] relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent"></div>
            <h2 className="font-['Outfit'] font-bold text-3xl sm:text-4xl text-[#F8FAFC] tracking-tight">
              Ready to explore?
            </h2>
            <p className="mt-4 text-[#94A3B8] text-base max-w-md mx-auto">
              Browse our collection of precision-crafted 3D printed products.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-[#00E5FF] text-[#040914] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-all duration-300"
              data-testid="cta-browse-button"
            >
              Browse Products
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
