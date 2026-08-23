// Replace Bouti/src/components/CartDrawer.jsx with this version.
// Adds a shipping-details form + calls the real /api/checkout/ endpoint.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { api } from "../api";

export default function CartDrawer({ open, onClose, items, onUpdateQty, onRemove, onOrderPlaced }) {
  const [step, setStep] = useState("cart"); // cart | form | success
  const [form, setForm] = useState({ customer_name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        payment_method: "cod",
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      };
      const result = await api.checkout(payload);
      setOrder(result);
      setStep("success");
      onOrderPlaced?.(); // let App.jsx clear the cart
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("cart"), 400); // reset after the drawer animates out
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-cream dark:bg-ink-950 z-[80]
              shadow-lift flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-ink/10 dark:border-cream/10">
              <h3 className="font-display text-xl text-ink dark:text-cream flex items-center gap-2">
                <ShoppingBag size={18} />
                {step === "cart" && `Your Bag (${items.length})`}
                {step === "form" && "Shipping Details"}
                {step === "success" && "Order Confirmed"}
              </h3>
              <button onClick={handleClose} aria-label="Close cart" className="p-1 hover:text-gold-dark">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {step === "cart" && (
                items.length === 0 ? (
                  <p className="text-slate dark:text-cream/50 text-sm text-center mt-12">
                    Your bag is empty. Time to treat yourself.
                  </p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-display text-sm text-ink dark:text-cream mb-1">{item.name}</p>
                        <p className="text-gold-dark text-sm mb-2">₹{item.price.toLocaleString("en-IN")}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            className="w-6 h-6 rounded-full border border-ink/20 dark:border-cream/20 flex items-center justify-center">
                            <Minus size={11} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            className="w-6 h-6 rounded-full border border-ink/20 dark:border-cream/20 flex items-center justify-center">
                            <Plus size={11} />
                          </button>
                          <button onClick={() => onRemove(item.id)} aria-label="Remove item"
                            className="ml-auto text-slate hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {step === "form" && (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  {["customer_name", "email", "phone", "address", "city", "state", "pincode"].map((field) => (
                    <input
                      key={field}
                      required
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl border border-ink/10 dark:border-cream/10 bg-transparent
                        text-sm focus:outline-none focus:border-gold-dark transition-colors"
                    />
                  ))}
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
                    {loading ? "Placing order..." : `Place Order — ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </form>
              )}

              {step === "success" && order && (
                <div className="text-center space-y-3 mt-8">
                  <p className="font-display text-lg text-ink dark:text-cream">Thank you, {order.customer_name}!</p>
                  <p className="text-sm text-slate dark:text-cream/60">
                    Order #{order.id} confirmed. A confirmation email is on its way.
                  </p>
                  {order.whatsapp_link && (
                    <a href={order.whatsapp_link} target="_blank" rel="noreferrer"
                      className="inline-block text-sm text-gold-dark underline">
                      Message us on WhatsApp about this order
                    </a>
                  )}
                </div>
              )}
            </div>

            {step === "cart" && items.length > 0 && (
              <div className="px-6 py-6 border-t border-ink/10 dark:border-cream/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate dark:text-cream/60">Subtotal</span>
                  <span className="font-display text-xl text-ink dark:text-cream">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <button onClick={() => setStep("form")} className="btn-gold w-full">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
