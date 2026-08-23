import { motion } from "framer-motion";
import { Gem, Sparkles, Gift, Truck, Shield, Heart } from "lucide-react";
import { whyChooseUs } from "../data/content";

const icons = { gem: Gem, sparkles: Sparkles, gift: Gift, truck: Truck, shield: Shield, heart: Heart };

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-cream dark:bg-ink-950">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="eyebrow mb-3">Our Promise</p>
          <h2 className="section-heading">Why Choose Us</h2>
          <div className="stitch-rule mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-white dark:bg-ink-800 shadow-soft hover:shadow-lift transition-shadow duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mb-5">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-display text-xl text-ink dark:text-cream mb-2">{item.title}</h3>
                <p className="text-slate dark:text-cream/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
