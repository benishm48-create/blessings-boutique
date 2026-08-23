import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";

export default function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart, onQuickView, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group bg-white dark:bg-ink-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-shadow duration-500"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={product.hoverImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Wishlist */}
        <button
          aria-label="Add to wishlist"
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-ink-900/90 flex items-center justify-center
            shadow-soft transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-gold-dark text-gold-dark" : "text-ink dark:text-cream"}
          />
        </button>

        {/* Quick view — slides up on hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0
            transition-transform duration-400 bg-ink/85 text-white text-xs tracking-wide py-3
            flex items-center justify-center gap-2"
        >
          <Eye size={14} /> Quick View
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg text-ink dark:text-cream mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={13} className="fill-gold-dark text-gold-dark" />
          <span className="text-xs text-slate dark:text-cream/60">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-display text-lg text-gold-dark">₹{product.price.toLocaleString("en-IN")}</span>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            aria-label="Add to cart"
            className="w-9 h-9 rounded-full bg-ink dark:bg-cream text-white dark:text-ink flex items-center justify-center
              hover:bg-gold-dark dark:hover:bg-gold-dark dark:hover:text-white transition-colors"
          >
            <ShoppingBag size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
