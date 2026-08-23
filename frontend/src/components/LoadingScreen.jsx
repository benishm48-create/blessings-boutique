import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center gap-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl text-ink tracking-wide"
          >
            Blessings <span className="text-gold-dark">Boutique</span>
          </motion.p>
          <motion.div className="w-32 h-[2px] bg-beige/40 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gold-gradient"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
