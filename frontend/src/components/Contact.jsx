// Replace Bouti/src/components/Contact.jsx with this version.
// Only handleSubmit changed — it now POSTs to /api/contact and shows the WhatsApp link.
// (Full file included so you can drop-in replace; unchanged JSX is kept as-is.)

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { api } from "../api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [waLink, setWaLink] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await api.sendContact(form);
      setSent(true);
      setWaLink(result.whatsapp_link);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      setError(err.message);
    }
  };

  const details = [
    { icon: MapPin, label: "Address", value: "42 Silk Route Avenue, Nagercoil, Tamil Nadu, India" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Mail, label: "Email", value: "hello@maisonelan.com" },
    { icon: Clock, label: "Opening Hours", value: "Mon – Sat, 10:00 AM – 8:00 PM" },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-cream dark:bg-ink-950">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="eyebrow mb-3">Get In Touch</p>
          <h2 className="section-heading">Visit or Write to Us</h2>
          <div className="stitch-rule mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-soft h-64">
              <iframe
                title="Boutique location map"
                src="https://www.google.com/maps?q=Nagercoil,Tamil%20Nadu,India&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-ink-800 shadow-soft">
                  <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                    <d.icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate dark:text-cream/50 mb-0.5">{d.label}</p>
                    <p className="text-sm text-ink dark:text-cream">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-ink-800 rounded-2xl shadow-soft p-8 space-y-5"
          >
            <div>
              <label className="text-xs text-slate dark:text-cream/50 mb-1.5 block">Your Name</label>
              <input
                name="name" required value={form.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-ink/10 dark:border-cream/10 bg-transparent
                  text-sm focus:outline-none focus:border-gold-dark transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-xs text-slate dark:text-cream/50 mb-1.5 block">Email Address</label>
              <input
                type="email" name="email" required value={form.email} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-ink/10 dark:border-cream/10 bg-transparent
                  text-sm focus:outline-none focus:border-gold-dark transition-colors"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-slate dark:text-cream/50 mb-1.5 block">Message</label>
              <textarea
                name="message" required rows={4} value={form.message} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-ink/10 dark:border-cream/10 bg-transparent
                  text-sm focus:outline-none focus:border-gold-dark transition-colors resize-none"
                placeholder="I'd love to book a fitting appointment…"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
              className="btn-gold w-full"
            >
              {sent ? "Message Sent ✓" : (<>Send Message <Send size={15} /></>)}
            </motion.button>
            {sent && waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="block text-center text-xs text-gold-dark underline">
                Chat with us on WhatsApp instead
              </a>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
