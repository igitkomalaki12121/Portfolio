import { motion } from 'framer-motion';
import { useEffect, useState, type MouseEvent } from 'react';

const navItems = [
  { href: '#philosophy', label: 'Phil' },
  { href: '#capabilities', label: 'Capab' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkOverlay, setIsDarkOverlay] = useState(false);

  useEffect(() => {
    const darkSectionIds = ['#philosophy', '#work'];
    const darkSections = darkSectionIds
      .map((id) => document.querySelector(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!darkSections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const hasDarkVisible = entries.some((entry) => entry.isIntersecting);
        setIsDarkOverlay(hasDarkVisible);
      },
      {
        root: null,
        rootMargin: '-80px 0px 0px 0px',
        threshold: [0, 0.05, 0.2],
      },
    );

    darkSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const target = document.querySelector(href) as HTMLElement | null;

    window.setTimeout(() => {
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = href;
      }
      setIsLoading(false);
    }, 240);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={
          `fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-300 ${
            isDarkOverlay
              ? 'bg-slate-950/80 text-white shadow-black/30 backdrop-blur-xl'
              : 'bg-white/10 text-black shadow-black/10 backdrop-blur-sm'
          }`
        }
      >
        <div className="font-bold tracking-tighter text-lg sm:text-xl">
          <span className="hidden sm:inline">CJADE.studio</span>
          <span className="inline sm:hidden">CJADE</span>
        </div>
        <div className="flex gap-4 sm:gap-6 text-[0.65rem] sm:text-sm font-mono tracking-wide">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={`transition-colors uppercase ${
                isDarkOverlay ? 'text-slate-100 hover:text-white' : 'text-black hover:text-black'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {isLoading && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-white/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white/95 px-6 py-5 shadow-xl shadow-black/10">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-black" />
            <div className="text-sm uppercase tracking-[0.24em] text-black/80">Loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
