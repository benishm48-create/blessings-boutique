import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const headline = "Where Elegance Meets Everyday Style";

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-pearl via-cream to-cream dark:from-ink-900 dark:via-ink-950 dark:to-ink-950"
    >
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-10 w-40 h-40 rounded-full bg-beige/30 blur-3xl animate-float" />
        <div className="absolute bottom-32 left-1/3 w-56 h-56 rounded-full bg-gold/20 blur-3xl animate-floatSlow" />
        <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-clay/10 blur-3xl animate-float" />
      </div>

      <div className="container-lux relative z-10 grid lg:grid-cols-2 gap-16 items-center pt-28 pb-16">
        {/* Left: text */}
        <motion.div style={{ y: textY, opacity }} className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow mb-5"
          >
            Blessings Boutique
          </motion.p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-ink dark:text-cream mb-6">
            {headline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <div className="stitch-rule" />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-slate dark:text-cream/70 text-base sm:text-lg leading-relaxed mb-9 max-w-md"
          >
            Discover timeless fashion crafted for women who love confidence,
            elegance, and comfort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#new-arrivals"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold"
            >
              Explore Collection
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline"
            >
              Book Appointment
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: image */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lift">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
              alt="Boutique fashion model wearing a Maison Élan design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
          </div>
          {/* Floating accent card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="absolute -bottom-6 -left-6 sm:-left-10 bg-white/90 dark:bg-ink-800/90 backdrop-blur-md
              rounded-2xl shadow-soft px-6 py-4 border border-beige/40"
          >
            <p className="font-display text-2xl text-gold-dark">1200+</p>
            <p className="text-xs text-slate dark:text-cream/60 tracking-wide">Handpicked pieces</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
