import { motion } from 'framer-motion';

const capabilities = [
  {
    num: "01",
    title: "Development",
    desc: "Sleek interfaces and fluid mobile apps built to perform. I build from scratch using modern web technologies, ensuring your platform is fast, scalable, and completely responsive.",
    tech: ["React", "React Native", "Tailwind CSS", "Vercel"]
  },
  {
    num: "02",
    title: "Creative Direction",
    desc: "Scroll-stopping short-form videos and high-end graphic design. Tailored to hook your audience, edited to keep them watching.",
    tech: ["CapCut", "Canva", "Photoshop", "Premiere"]
  },
  {
    num: "03",
    title: "Operations & VA",
    desc: "Streamlining the day-to-day. I optimize your data management and leverage AI tools to automate your workflows, giving you back time to focus on growth",
    tech: ["Virtual Assistance", "AI Automation", "Notion", "Zapier"]
  }
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-sm font-mono text-black tracking-widest uppercase mb-24"
        >
          01 / Capabilities
        </motion.h3>

        <div className="border-t border-black/10">
          {capabilities.map((cap, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="py-12 md:py-16 border-b border-black/10 flex flex-col md:flex-row gap-8 md:gap-16 items-center group hover:bg-black/5 transition-colors"
            >
              <div className="md:w-1/4">
                <span className="text-4xl md:text-5xl font-light text-black">{cap.num}</span>
              </div>
              <div className="md:w-1/2">
                <h4 className="text-2xl md:text-4xl font-semibold tracking-tight text-black mb-4">{cap.title}</h4>
                <p className="text-lg text-[#222] font-light leading-relaxed mb-8 max-w-md">{cap.desc}</p>
              </div>
              <div className="md:w-1/4 flex items-start">
                <ul className="space-y-3 font-mono text-xs uppercase tracking-widest text-[#222]">
                  {cap.tech.map((item, i) => (
                    <li key={i} className="text-[#444]">- {item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
