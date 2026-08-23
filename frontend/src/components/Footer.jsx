import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const quickLinks = ["Home", "About", "New Arrivals", "Contact"];
const collectionLinks = ["Bridal", "Party Wear", "Casual Wear", "Sarees"];
const socials = [Instagram, Facebook, Twitter, Youtube];

export default function Footer() {
  return (
    <footer className="bg-ink dark:bg-ink-950 text-cream/70 pt-20 pb-8">
      <div className="container-lux grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        <div>
          <p className="font-display text-2xl text-white mb-4">
            Blessings <span className="text-gold">Boutique</span>
          </p>
          <p className="text-sm leading-relaxed text-cream/50 max-w-xs">
            Timeless fashion, crafted for women who love confidence, elegance,
            and comfort — since day one.
          </p>
        </div>

        <div>
          <p className="text-white text-sm tracking-wide mb-4">Quick Links</p>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l}>
                <a href="#home" className="text-sm hover:text-gold transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white text-sm tracking-wide mb-4">Collections</p>
          <ul className="space-y-2.5">
            {collectionLinks.map((l) => (
              <li key={l}>
                <a href="#collections" className="text-sm hover:text-gold transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white text-sm tracking-wide mb-4">Stay Connected</p>
          <div className="flex gap-3 mb-6">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-lux pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-cream/40">© {new Date().getFullYear()} Blessings Boutique. All rights reserved.</p>
        <p className="text-xs text-cream/40">Crafted with care for timeless style.</p>
      </div>
    </footer>
  );
}
