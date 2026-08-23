import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedCollections from "./components/FeaturedCollections";
import NewArrivals from "./components/NewArrivals";
import WhyChooseUs from "./components/WhyChooseUs";
import BoutiqueStory from "./components/BoutiqueStory";
import Testimonials from "./components/Testimonials";
import InstagramGallery from "./components/InstagramGallery";
import Newsletter from "./components/Newsletter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import CartDrawer from "./components/CartDrawer";
import QuickViewModal from "./components/QuickViewModal";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Simple loading sequence on first mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  // Keep the <html> class in sync with dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  };

  return (
    <>
      <LoadingScreen show={loading} />
      <ScrollProgress />

      <Navbar
        cartCount={cartItems.reduce((sum, i) => sum + i.qty, 0)}
        onCartClick={() => setCartOpen(true)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      <main>
        <Hero />
        <FeaturedCollections />
        <NewArrivals
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onQuickView={setQuickViewProduct}
        />
        <WhyChooseUs />
        <BoutiqueStory />
        <Testimonials />
        <InstagramGallery />
        <Newsletter />
        <Contact />
      </main>

      <Footer />
      <BackToTop />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onOrderPlaced={() => setCartItems([])}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </>
  );
}
