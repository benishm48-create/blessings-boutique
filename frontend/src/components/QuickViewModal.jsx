import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag } from "lucide-react";

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream dark:bg-ink-900 rounded-2xl overflow-hidden max-w-2xl w-full grid sm:grid-cols-2 shadow-lift relative"
            >
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-ink-800/90 flex items-center justify-center"
              >
                <X size={16} />
              </button>
              <div className="aspect-[3/4] sm:aspect-auto">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="font-display text-2xl text-ink dark:text-cream mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  <Star size={14} className="fill-gold-dark text-gold-dark" />
                  <span className="text-sm text-slate dark:text-cream/60">{product.rating} rating</span>
                </div>
                <p className="text-slate dark:text-cream/60 text-sm leading-relaxed mb-6">
                  A signature Maison Élan piece — thoughtfully tailored from
                  premium fabric, finished by hand, and made to be worn for
                  years to come.
                </p>
                <p className="font-display text-2xl text-gold-dark mb-6">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="btn-gold"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
