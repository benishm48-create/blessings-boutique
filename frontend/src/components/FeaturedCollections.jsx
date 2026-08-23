import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { collections } from "../data/content";

export default function FeaturedCollections() {
  return (
    <section id="collections" className="py-24 md:py-32 bg-cream dark:bg-ink-950">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="eyebrow mb-3">Curated For You</p>
          <h2 className="section-heading">Featured Collections</h2>
          <div className="stitch-rule mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-lift
                transition-shadow duration-500 cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl text-white mb-1">{c.name}</h3>
                <p className="text-white/70 text-sm mb-4">{c.tagline}</p>
                <span
                  className="inline-flex items-center gap-2 text-white text-sm font-body
                    border-b border-transparent group-hover:border-gold pb-1
                    -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100
                    transition-all duration-400"
                >
                  Shop Now <ArrowRight size={15} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
