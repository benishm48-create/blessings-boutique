import { motion, useScroll, useSpring } from "framer-motion";

// A slender gold "thread" that draws across the top of the page as you scroll —
// a quiet callback to the stitch-rule signature used throughout the site.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gold-gradient"
    />
  );
}
