import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X, Moon, Sun } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Collections", href: "#collections" },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Categories", href: "#collections" },
  { label: "About", href: "#story" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ cartCount, onCartClick, darkMode, onToggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-cream/90 dark:bg-ink-950/90 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container-lux flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-display text-2xl tracking-wide text-ink dark:text-cream"
        >
          Blessings <span className="text-gold-dark">Boutique</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="relative font-body text-sm text-ink/80 dark:text-cream/80 hover:text-gold-dark
                  transition-colors duration-300 group"
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-gold-dark transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 text-ink dark:text-cream hover:text-gold-dark transition-colors"
          >
            <Search size={19} />
          </button>
          <button
            aria-label="Toggle dark mode"
            onClick={onToggleDark}
            className="p-2 text-ink dark:text-cream hover:text-gold-dark transition-colors"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            aria-label="Shopping cart"
            onClick={onCartClick}
            className="relative p-2 text-ink dark:text-cream hover:text-gold-dark transition-colors"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-dark text-white text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen((m) => !m)}
            className="lg:hidden p-2 text-ink dark:text-cream"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Search bar dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="container-lux py-4">
              <input
                autoFocus
                type="text"
                placeholder="Search for dresses, sarees, kurtis…"
                className="w-full bg-transparent border-b border-ink/20 dark:border-cream/20 py-2
                  font-body text-sm placeholder:text-slate focus:outline-none focus:border-gold-dark"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <ul className="container-lux flex flex-col gap-5 py-6">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="font-display text-xl text-ink dark:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
