import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { instagramPosts } from "../data/content";

export default function InstagramGallery() {
  return (
    <section className="py-24 md:py-32 bg-pearl dark:bg-ink-900">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="eyebrow mb-3">Follow Along</p>
          <h2 className="section-heading">@blessingsboutique</h2>
          <div className="stitch-rule mx-auto" />
        </motion.div>

        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {instagramPosts.map((src, i) => (
            <motion.a
              href="#"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group relative block break-inside-avoid rounded-xl overflow-hidden"
            >
              <img
                src={src}
                alt="Maison Élan on Instagram"
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-400 flex items-center justify-center">
                <Instagram
                  size={22}
                  className="text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
                />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="btn-outline">
            <Instagram size={16} /> Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
