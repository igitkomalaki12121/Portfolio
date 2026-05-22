import { motion } from 'framer-motion';

export default function Philosophy() {
  return (
    <section id="philosophy" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-32">
        <div className="md:w-1/3">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono text-[#666] tracking-widest uppercase sticky top-32"
          >
            00 / Philosophy
          </motion.h3>
        </div>
        <div className="md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-3xl md:text-5xl font-medium leading-tight tracking-tight text-white mb-12">
              Building at the intersection of <span className="text-[#666] italic">engineering precision</span> and <span className="italic text-[#a0a0a0]">creative intuition</span>.
            </p>
            <p className="text-xl md:text-2xl text-[#888] font-light leading-relaxed max-w-2xl">
              I make sure the work gets done smoothly. I use the development methods create content that is carefully chosen and set up administrative systems that work well. All of this is made better by the latest artificial intelligence tools. This helps me build digital systems that help brands like Amazon or Google grow from the inside out. I create ecosystems that help brands grow from the inside out. The digital ecosystems I build are strong. Help brands, like these grow.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
