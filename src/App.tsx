import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Menu, 
  Instagram, 
  Facebook, 
  Twitter, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  MessageCircle,
  Zap
} from 'lucide-react';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

const WHATSAPP_NUMBER = "03056137786";
const WHATSAPP_LINK = `https://wa.me/923056137786`;

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check for product detail view in URL
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        setDetailProduct(product);
      }
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product: Product) => {
    const message = `Assalam-o-Alaikum, I want to buy ${product.name} (${product.weight}) for Rs. ${product.salePrice}.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openProductDetail = (product: Product) => {
    window.open(`/?product=${product.id}`, '_blank');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render minimal product detail view if in detail mode
  if (detailProduct) {
    return (
      <div className="min-h-screen bg-brand-cream p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-stone-200">
          <div className="md:w-1/2 aspect-[2/3]">
            <img 
              src={detailProduct.image} 
              alt={detailProduct.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-brand-gold font-bold uppercase tracking-widest text-xs mb-4">{detailProduct.weight}</span>
            <h1 className="text-4xl font-serif text-brand-green mb-6">{detailProduct.name}</h1>
            <p className="text-stone-600 mb-8 leading-relaxed">{detailProduct.description}</p>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-4xl font-serif font-bold text-brand-green">Rs. {detailProduct.salePrice}</span>
              <span className="text-xl text-stone-400 line-through">Rs. {detailProduct.price}</span>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => buyNow(detailProduct)}
                className="w-full bg-brand-gold text-brand-green py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> Buy Now
              </button>
              <button 
                onClick={() => window.close()}
                className="w-full bg-stone-100 text-stone-600 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-200 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!activePage) return null;

    const pages: Record<string, { title: string, content: string }> = {
      'about': {
        title: 'About Us',
        content: 'Chitral Collection is dedicated to bringing the purest, most authentic natural treasures from the high mountains of Chitral to your doorstep. Our flagship product, Pure Shilajeet, is sourced directly from the pristine Hindu Kush range and purified using traditional methods to preserve its incredible mineral profile.'
      },
      'contact': {
        title: 'Contact Us',
        content: `We are here to help! Reach out to us for any queries about our products or your orders.\n\nEmail: contact@chitralcollection.com\nWhatsApp: ${WHATSAPP_NUMBER}\nAddress: Main Bazar, Chitral, KP, Pakistan`
      },
      'privacy': {
        title: 'Privacy Policy',
        content: 'Your privacy is important to us. We only collect information necessary to process your orders and provide a better shopping experience. We never share your data with third parties.'
      },
      'refund': {
        title: 'Refund Policy',
        content: 'If you are not satisfied with your purchase, you can return it within 14 days of delivery. The product must be in its original packaging and unused.'
      },
      'terms': {
        title: 'Terms & Conditions',
        content: 'By using Chitralcollection.com, you agree to our terms of service. All products are sold as natural supplements and should be used as directed.'
      }
    };

    const page = pages[activePage];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 bg-brand-cream overflow-y-auto p-6 md:p-20"
      >
        <button 
          onClick={() => setActivePage(null)}
          className="absolute top-6 right-6 p-2 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-serif mb-8 text-brand-green">{page.title}</h2>
          <div className="prose prose-stone lg:prose-xl whitespace-pre-wrap text-stone-700">
            {page.content}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-brand-green">
      {/* Sticky Header */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-brand-green py-3 shadow-xl' : 'bg-brand-green py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 lg:hidden text-white hover:text-brand-gold transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white leading-none">Chitral Collection</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold mt-1">Premium Herbal Care</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-gold transition-colors">Home</button>
              <a href="#products" className="hover:text-brand-gold transition-colors">Shop</a>
              <button onClick={() => setActivePage('about')} className="hover:text-brand-gold transition-colors">About</button>
              <button onClick={() => setActivePage('contact')} className="hover:text-brand-gold transition-colors">Contact</button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-white hover:text-brand-gold transition-all hover:scale-110"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-gold text-brand-green text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-brand-green">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-brand-green pt-20">
        <img 
          src="https://picsum.photos/seed/herbal/1920/1080?blur=3" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
          alt="Chitral Mountains"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green/80 via-transparent to-brand-green"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
            <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-[10px]">100% Organic & Pure</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1]"
          >
            Nature's Secret for <br />
            <span className="italic text-brand-gold">Eternal Vitality</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-stone-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Experience the power of Original Pure Chitrali Shilajeet. 
            Hand-sourced from the highest peaks of the Hindu Kush mountains.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#products"
              className="w-full sm:w-auto bg-brand-gold text-brand-green px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-brand-gold-light transition-all transform hover:scale-105 shadow-2xl shadow-brand-gold/20"
            >
              Shop Collection
            </a>
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </a>
          </motion.div>
        </div>
      </header>

      {/* Product Grid */}
      <main id="products" className="flex-grow py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-brand-cream">
        <div className="text-center mb-24">
          <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[11px] mb-4 block">Premium Selection</span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-green mb-6">Our Pure Shilajeet</h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
          {PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex flex-col"
            >
              <div 
                className="relative aspect-[2/3] overflow-hidden rounded-3xl bg-stone-200 mb-8 shadow-lg cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-5 left-5">
                  <span className="bg-brand-green/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/10">
                    {product.weight}
                  </span>
                </div>
                {product.price > product.salePrice && (
                  <div className="absolute top-5 right-5">
                    <span className="bg-brand-gold text-brand-green px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      Save Rs. {product.price - product.salePrice}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-grow space-y-4 px-2">
                <div className="flex items-center gap-1 text-brand-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="text-[10px] text-stone-400 font-bold ml-2">(4.9/5)</span>
                </div>
                <h3 className="text-2xl font-serif text-brand-green leading-tight min-h-[3rem]">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Price</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-serif font-bold text-brand-green">Rs. {product.salePrice}</span>
                      <span className="text-sm text-stone-400 line-through">Rs. {product.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1 block">Weight</span>
                    <span className="text-sm font-bold text-stone-700">{product.weight}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-stone-100 text-stone-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 transition-all border border-stone-200"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => buyNow(product)}
                    className="bg-brand-green text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-olive transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-green/10"
                  >
                    <Zap className="w-3 h-3 fill-brand-gold" /> Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* WhatsApp Section */}
      <section className="bg-white py-20 px-4 border-t border-stone-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-4">
            <MessageCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-green">Need Help or Want to Order?</h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed">
            For Orders or More Queries, Contact Us on WhatsApp. We are available 24/7 to assist you.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              className="inline-flex items-center gap-4 bg-green-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
            >
              <MessageCircle className="w-6 h-6" /> {WHATSAPP_NUMBER}
            </a>
            <span className="text-xs text-stone-400 uppercase tracking-[0.3em] font-bold">Click to start chat</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-green text-stone-400 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold tracking-tight text-white leading-none">Chitral Collection</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-black mt-2">Premium Herbal Care</span>
            </div>
            <p className="text-sm leading-relaxed font-light text-stone-400/80">
              Chitral Collection brings you the purest Himalayan treasures. Our Shilajeet is hand-purified using traditional methods to ensure maximum potency and authenticity.
            </p>
            <div className="flex gap-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-green transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-green transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-green transition-all"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-serif text-xl mb-8">Quick Navigation</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-gold transition-colors">Home Page</button></li>
              <li><a href="#products" className="hover:text-brand-gold transition-colors">Shop Collection</a></li>
              <li><button onClick={() => setActivePage('about')} className="hover:text-brand-gold transition-colors">Our Story</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-brand-gold transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-xl mb-8">Customer Care</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li><button onClick={() => setActivePage('privacy')} className="hover:text-brand-gold transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActivePage('refund')} className="hover:text-brand-gold transition-colors">Refund & Returns</button></li>
              <li><button onClick={() => setActivePage('terms')} className="hover:text-brand-gold transition-colors">Terms of Service</button></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Shipping Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-xl mb-8">Get in Touch</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex gap-4"><MapPin className="w-5 h-5 text-brand-gold shrink-0" /> <span className="leading-relaxed">Main Bazar, Chitral, KP, Pakistan</span></li>
              <li className="flex gap-4"><Phone className="w-5 h-5 text-brand-gold shrink-0" /> <span>{WHATSAPP_NUMBER}</span></li>
              <li className="flex gap-4"><Mail className="w-5 h-5 text-brand-gold shrink-0" /> <span>contact@chitralcollection.com</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-500">
            © {new Date().getFullYear()} Chitral Collection. Premium Herbal Brand. Designed for Chitralcollection.com
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a 
        href={WHATSAPP_LINK}
        target="_blank"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-50 bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-600/40 flex items-center justify-center group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-white text-stone-800 px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-stone-100">
          Chat with us
        </span>
      </motion.a>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-brand-green/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-brand-cream shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-stone-200 flex justify-between items-center bg-white">
                <h2 className="text-3xl font-serif text-brand-green">Your Basket ({cartCount})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-6">
                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="font-serif text-2xl">Your basket is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-brand-green text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-lg"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-32 rounded-2xl overflow-hidden bg-stone-200 shrink-0 shadow-md">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-serif text-xl leading-tight text-brand-green">{item.name}</h3>
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-2">{item.weight}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center bg-white border border-stone-200 rounded-full p-1 shadow-sm">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:text-brand-gold transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="w-10 text-center text-sm font-black text-brand-green">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:text-brand-gold transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="text-right">
                            <p className="text-brand-green font-black text-lg">Rs. {item.salePrice * item.quantity}</p>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-[9px] text-red-500 uppercase tracking-widest font-black mt-2 hover:underline"
                            >
                              Remove Item
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-stone-200 bg-white space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-400 uppercase tracking-[0.2em] text-[10px] font-black">Subtotal Amount</span>
                    <span className="text-3xl font-serif font-bold text-brand-green">Rs. {cartTotal}</span>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full bg-brand-green text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-olive transition-all shadow-xl shadow-brand-green/20">
                      Proceed to Checkout
                    </button>
                    <button 
                      onClick={() => {
                        const message = `Assalam-o-Alaikum, I want to place an order for:\n${cart.map(item => `- ${item.name} (${item.weight}) x ${item.quantity}`).join('\n')}\nTotal: Rs. ${cartTotal}`;
                        window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-600/10"
                    >
                      <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-brand-green/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-xs bg-brand-cream shadow-2xl p-10"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex flex-col">
                  <span className="text-2xl font-serif font-bold tracking-tight text-brand-green leading-none">Chitral Collection</span>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-black mt-2">Premium Herbal Care</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-10">
                <button onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-3xl font-serif text-brand-green hover:text-brand-gold transition-colors">Home</button>
                <a href="#products" onClick={() => setIsMenuOpen(false)} className="block text-3xl font-serif text-brand-green hover:text-brand-gold transition-colors">Shop All</a>
                <button onClick={() => { setIsMenuOpen(false); setActivePage('about'); }} className="block text-3xl font-serif text-brand-green hover:text-brand-gold transition-colors">Our Story</button>
                <button onClick={() => { setIsMenuOpen(false); setActivePage('contact'); }} className="block text-3xl font-serif text-brand-green hover:text-brand-gold transition-colors">Contact Us</button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay Pages */}
      <AnimatePresence>
        {renderPage()}
      </AnimatePresence>
    </div>
  );
}
