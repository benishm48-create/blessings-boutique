import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../data/content";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[index];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-cream dark:bg-ink-950">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="eyebrow mb-3">Kind Words</p>
          <h2 className="section-heading">What Our Clients Say</h2>
          <div className="stitch-rule mx-auto" />
        </motion.div>

        <div
          className="max-w-3xl mx-auto relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote className="mx-auto mb-6 text-gold/40" size={40} />

          <div className="min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="font-display text-xl sm:text-2xl text-ink dark:text-cream leading-relaxed mb-7">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold"
                  />
                  <div className="text-left">
                    <p className="font-body text-sm font-medium text-ink dark:text-cream">{t.name}</p>
                    <p className="text-xs text-slate dark:text-cream/50">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(t.rating) ? "fill-gold-dark text-gold-dark" : "text-beige"}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-ink/15 dark:border-cream/20 flex items-center justify-center hover:border-gold-dark hover:text-gold-dark transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-gold-dark" : "w-1.5 bg-beige"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-ink/15 dark:border-cream/20 flex items-center justify-center hover:border-gold-dark hover:text-gold-dark transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
