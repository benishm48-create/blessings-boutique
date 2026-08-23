import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="py-20 md:py-28 bg-gold-gradient">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mx-auto text-center"
        >
          <Mail className="mx-auto mb-4 text-white" size={28} />
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
            Join the Inner Circle
          </h2>
          <p className="text-white/85 mb-8">
            Be first to know about new collections, private sales, and styling notes.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3.5 rounded-full bg-white/95 text-ink placeholder:text-slate
                font-body text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-8 py-3.5 rounded-full bg-ink text-white font-body text-sm tracking-wide hover:bg-ink-800 transition-colors"
            >
              {submitted ? (
                <span className="flex items-center gap-2">
                  <Check size={16} /> Subscribed
                </span>
              ) : (
                "Subscribe"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
