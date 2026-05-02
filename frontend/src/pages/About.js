import { motion } from 'framer-motion';
import { Printer, Heart, Lightbulb } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6" data-testid="about-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#3B82F6] border border-[#3B82F6] bg-blue-900/20 px-3 py-1">
            Our Story
          </span>
          <h1 className="font-['Outfit'] font-bold text-4xl sm:text-5xl text-[#F8FAFC] tracking-tight mt-4">
            About Precision<span className="text-[#00E5FF]">3D</span>
          </h1>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1760446410542-04b48d60bfb3"
                alt="Our 3D printing studio"
                className="w-full aspect-[4/3] object-cover border border-white/10"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#00E5FF]/30 -z-10"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="font-['Outfit'] font-semibold text-2xl text-[#F8FAFC]">
              Built by Creators,<br />For Creators
            </h2>
            <p className="text-[#94A3B8] leading-relaxed">
              Precision3D started with a simple idea: design unique products that bring joy. 
              Every item in our catalog is designed from scratch, tested rigorously, and printed 
              with the finest materials available.
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
              We believe in the power of precision engineering. Our printers operate at 0.1mm 
              layer resolution, ensuring every piece has smooth surfaces and tight tolerances 
              that you can feel the moment you pick it up.
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
              From fidget toys to party accessories, each product represents hours of design 
              iteration and quality testing. We don't just print things — we craft experiences.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-['Outfit'] font-bold text-3xl text-[#F8FAFC] tracking-tight mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Printer,
                title: 'Precision First',
                desc: 'Every product is printed at the highest resolution possible. We never cut corners on quality.'
              },
              {
                icon: Lightbulb,
                title: 'Original Design',
                desc: 'We design every product ourselves. You won\'t find these anywhere else — they\'re uniquely ours.'
              },
              {
                icon: Heart,
                title: 'Made with Care',
                desc: 'Each piece is inspected by hand before shipping. If it doesn\'t meet our standards, it doesn\'t ship.'
              }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-[#0A101D] border border-white/10 hover:border-[#00E5FF]/20 transition-all duration-300"
                data-testid={`value-card-${i}`}
              >
                <value.icon size={24} className="text-[#00E5FF] mb-4" />
                <h3 className="font-['Outfit'] font-semibold text-lg text-[#F8FAFC] mb-2">{value.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
