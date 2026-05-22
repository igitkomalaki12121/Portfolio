import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-mono text-sm tracking-widest text-[#a0a0a0] mb-8 uppercase">CRISTEVE JADE</h2>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.9] mb-12 uppercase text-black">
            System &<br />
            <span className="text-[#444]">Aesthetic.</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-12"
        >
          <p className="text-lg md:text-2xl text-[#222] max-w-2xl font-light leading-relaxed">
            I combine clean development, high-end visual design, and AI-powered workflows to help brands grow faster. Less friction, more execution.
          </p>
          
          <a href="#work" className="group flex items-center gap-4 text-sm font-mono tracking-widest uppercase pb-2 border-b border-black/20 hover:border-black transition-all w-max text-black">
            <span>Explore Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
