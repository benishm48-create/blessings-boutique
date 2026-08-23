import { motion } from "framer-motion";
import { products } from "../data/content";
import ProductCard from "./ProductCard";

export default function NewArrivals({ wishlist, onToggleWishlist, onAddToCart, onQuickView }) {
  return (
    <section id="new-arrivals" className="py-24 md:py-32 bg-pearl dark:bg-ink-900">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="eyebrow mb-3">Just In</p>
          <h2 className="section-heading">New Arrivals</h2>
          <div className="stitch-rule mx-auto" />
          <p className="text-slate dark:text-cream/60 mt-4">
            Fresh from the atelier — the newest additions to our collection.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
