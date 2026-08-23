import { motion } from "framer-motion";

export default function BoutiqueStory() {
  return (
    <section id="story" className="py-24 md:py-32 bg-pearl dark:bg-ink-900 overflow-hidden">
      <div className="container-lux grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lift">
            <img
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop"
              alt="Interior of the Maison Élan boutique atelier"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 sm:-right-10 w-40 h-40 rounded-2xl overflow-hidden shadow-soft border-4 border-cream dark:border-ink-950 hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400&auto=format&fit=crop"
              alt="Tailor at work in the atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="section-heading mb-4">Crafted with Passion, Worn with Pride</h2>
          <div className="stitch-rule" />
          <p className="text-slate dark:text-cream/70 leading-relaxed mb-5">
            Maison Élan began as a single sewing table in a small studio, driven
            by a simple belief — that every woman deserves clothing that feels
            as good as it looks. Two decades later, that belief still guides
            every stitch.
          </p>
          <p className="text-slate dark:text-cream/70 leading-relaxed mb-9">
            Our artisans blend traditional craftsmanship with modern
            silhouettes, sourcing fabrics that age beautifully and designs
            that never go out of style. This is fashion built to be lived in,
            not just looked at.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn-gold"
          >
            Visit Our Store
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
