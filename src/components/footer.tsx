import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const socialLinks = [
  {
    label: 'Email',
    href: 'mailto:ladracristeve@gmail.com',
    display: 'ladracristeve@gmail.com',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/igitkomalaki12121',
    display: 'https://github.com/igitkomalaki12121',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/cristeve-jade-ladra-905309364/',
    display: 'https://www.linkedin.com/in/cristeve-jade-ladra-905309364/',
  },
];

export default function Footer() {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto flex flex-col justify-between min-h-[50vh]">
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-black uppercase text-balance">
            Let's build<br />
            <span className="text-[#444]">something</span><br />
            iconic.
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12"
        >
          <div className="flex flex-col gap-8 md:gap-16">
            {socialLinks.map((link) => (
              <div key={link.label} className="space-y-2">
                <a
                  href={link.href}
                  className="group flex items-center gap-2 text-sm font-mono tracking-widest uppercase hover:text-black text-[#111] transition-colors"
                >
                  {link.label}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0 translate-x-1 group-hover:translate-x-0" />
                </a>
                <a
                  href={link.href}
                  className="block text-[11px] text-[#444] hover:text-black transition-colors break-all"
                >
                  {link.display}
                </a>
              </div>
            ))}
          </div>

          <div className="text-xs font-mono text-[#444] uppercase tracking-widest text-right">
            <p>(c) {new Date().getFullYear()} CJADE.studio</p>
            <p className="mt-2">All Rights Reserved</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
