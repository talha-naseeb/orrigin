/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Droplet,
  Fingerprint,
  BadgePercent,
  ShoppingBag,
  Trash2,
  CheckCircle,
  X,
  Plus,
  Minus,
  Heart,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  MapPin,
  ClipboardList
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import CustomizePreview from './components/CustomizePreview';
import CustomizeSteps from './components/CustomizeSteps';
import ProductCard from './components/ProductCard';

import {
  CustomizationState,
  CartItem,
  Order,
  Product,
  GarmentStyle,
  FabricType,
  GarmentColor,
  GarmentView
} from './types';

import {
  SAMPLE_PRODUCTS,
  WHY_ORIGINN_CARDS,
  OUR_OBJECTIVES,
  COLOR_DETAILS,
  GARMENT_STYLE_DETAILS,
  FABRIC_DETAILS,
  THREAD_COLORS
} from './data';

export default function App() {
  // Page Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');

  // E-commerce States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Modals Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Shop Page Filters State
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedFabricFilter, setSelectedFabricFilter] = useState<string>('all');

  // Customizer Core State (Step by step state)
  const [customizerStep, setCustomizerStep] = useState(1);
  const [custStyle, setCustStyle] = useState<GarmentStyle>('hoodie_oversized');
  const [custFabric, setCustFabric] = useState<FabricType>('organic_cotton');
  const [custColor, setCustColor] = useState<GarmentColor>('sand_beige');
  const [custView, setCustView] = useState<GarmentView>('front');
  const [custPatches, setCustPatches] = useState<any[]>([]);
  const [selectedPatchId, setSelectedPatchId] = useState<string | null>(null);
  
  // Custom text states
  const [custText, setCustText] = useState('');
  const [custTextLanguage, setCustTextLanguage] = useState<'en' | 'ur'>('en');
  const [custThreadColor, setCustThreadColor] = useState('#C9A96E'); // Default Gold
  const [custThreadColorName, setCustThreadColorName] = useState('Heritage Gold');
  const [custTextView, setCustTextView] = useState<GarmentView>('front');
  const [custTextX, setCustTextX] = useState(50);
  const [custTextY, setCustTextY] = useState(30);
  const [custTextScale, setCustTextScale] = useState(1.2);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [custSize, setCustSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');

  // Checkout Form States
  const [checkoutStep, setCheckoutStep] = useState<'cart_review' | 'shipping_form' | 'success'>('cart_review');
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('Lahore');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load persistence from local storage
  useEffect(() => {
    const cachedCart = localStorage.getItem('originn_cart');
    const cachedWishlist = localStorage.getItem('originn_wishlist');
    const cachedOrders = localStorage.getItem('originn_orders');

    if (cachedCart) setCart(JSON.parse(cachedCart));
    if (cachedWishlist) setWishlist(JSON.parse(cachedWishlist));
    if (cachedOrders) setOrders(JSON.parse(cachedOrders));
  }, []);

  // Save changes to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('originn_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist: Product[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('originn_wishlist', JSON.stringify(newWishlist));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('originn_orders', JSON.stringify(newOrders));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculate dynamic customization price (PKR)
  const basePrice = GARMENT_STYLE_DETAILS[custStyle]?.price || 3999;
  const patchesPrice = custPatches.length * 499;
  const textPrice = custText.trim() ? 199 : 0;
  const customizerTotalPrice = basePrice + patchesPrice + textPrice;

  // Add Item to Cart
  const handleAddToCart = () => {
    const currentCustomization: CustomizationState = {
      id: `custom-${Date.now()}`,
      style: custStyle,
      fabric: custFabric,
      color: custColor,
      patches: custPatches,
      customText: custText,
      textLanguage: custTextLanguage,
      threadColor: custThreadColor,
      threadColorName: custThreadColorName,
      textView: custTextView,
      textX: custTextX,
      textY: custTextY,
      textScale: custTextScale,
      size: custSize,
      price: customizerTotalPrice
    };

    const newCartItem: CartItem = {
      id: `cart-item-${Date.now()}`,
      customization: currentCustomization,
      size: custSize,
      quantity: 1,
      price: customizerTotalPrice
    };

    const updatedCart = [...cart, newCartItem];
    saveCart(updatedCart);
    setIsCartOpen(true);
    setCheckoutStep('cart_review');
    triggerToast('Custom design added to your Shopping Bag!');
  };

  // Add static product with customized defaults
  const handleCustomizeProduct = (product: Product) => {
    setCustStyle(product.style);
    setCustColor(product.color);
    setCustFabric(product.fabric);
    setCustPatches([]);
    setCustText('');
    setCustomizerStep(1);
    setActiveTab('customize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(`Loaded base ${product.name} in customizer.`);
  };

  // Toggle wishlist handler
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
      triggerToast('Removed from Wishlist.');
    } else {
      updated = [...wishlist, product];
      triggerToast('Added to Wishlist!');
    }
    saveWishlist(updated);
  };

  const handleUpdateCartQty = (itemId: string, direction: 'up' | 'down') => {
    const updated = cart.map((item) => {
      if (item.id === itemId) {
        const newQty = direction === 'up' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveCartItem = (itemId: string) => {
    const updated = cart.filter((item) => item.id !== itemId);
    saveCart(updated);
    triggerToast('Item removed from Shopping Bag.');
  };

  // Checkout submission handler
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress) {
      alert('Please fill in all delivery details.');
      return;
    }

    const orderTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `OR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: cart,
      total: orderTotal,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      paymentMethod,
      status: 'pending'
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    setLatestOrder(newOrder);
    setCheckoutStep('success');
    saveCart([]); // Empty cart upon successful order
    triggerToast('Order placed successfully! Shukriya.');
  };

  // Shop Filter Logics
  const filteredProducts = SAMPLE_PRODUCTS.filter((prod) => {
    const styleMatch = selectedStyleFilter === 'all' || prod.style === selectedStyleFilter;
    const colorMatch = selectedColorFilter === 'all' || prod.color === selectedColorFilter;
    const fabricMatch = selectedFabricFilter === 'all' || prod.fabric === selectedFabricFilter;
    return styleMatch && colorMatch && fabricMatch;
  });

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#3B2314] font-sans antialiased flex flex-col pt-20">
      
      {/* Dynamic Toast Alerts Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="global-toast"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#3B2314] text-[#F5F0E8] border border-[#C9A96E]/30 py-3 px-6 rounded-full shadow-lg z-[999] flex items-center gap-2.5 font-sans text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Page Routing Views */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Banner Section */}
              <section id="home-hero" className="relative py-24 sm:py-32 overflow-hidden flex items-center justify-center border-b border-[#3B2314]/5 bg-gradient-to-b from-[#F5F0E8] to-white/60">
                
                {/* Visual background lines representing fabric weave */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <svg width="100%" height="100%">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect width="40" height="40" fill="none" stroke="#3B2314" strokeWidth="1"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6 sm:space-y-8">
                  
                  {/* Small Brand Motif */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B0000]/5 border border-[#8B0000]/10 text-[#8B0000] text-[10px] font-sans font-bold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Slow Fashion Pakistan
                  </div>

                  {/* Elegant Serif Headline */}
                  <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-[#3B2314] leading-tight">
                    Wear Your Story.
                  </h1>

                  {/* Tagline Subtext */}
                  <p className="font-sans text-sm sm:text-base text-[#3B2314]/75 max-w-xl mx-auto leading-relaxed">
                    Custom clothing that defines you. Sustainable. Minimal. Meaningful. Individually cut and tailored in Punjab upon your exact order.
                  </p>

                  {/* Call-to-actions */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                      id="hero-customize-cta-btn"
                      onClick={() => setActiveTab('customize')}
                      className="bg-[#8B0000] hover:bg-[#7A1C1C] text-white px-7 py-3.5 rounded-lg text-xs uppercase tracking-widest font-sans font-bold shadow-md transition-all flex items-center gap-2 focus:outline-none"
                    >
                      Customize Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      id="hero-shop-cta-btn"
                      onClick={() => setActiveTab('shop')}
                      className="bg-white hover:bg-[#F5F0E8] text-[#3B2314] border border-[#3B2314]/20 px-7 py-3.5 rounded-lg text-xs uppercase tracking-widest font-sans font-bold transition-all focus:outline-none"
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>
              </section>

              {/* What is ORIGINN Section */}
              <section id="about-intro" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-5 space-y-5">
                      <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#C9A96E]">What is ORIGINN?</span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2314]">
                        A canvas for individual expression.
                      </h2>
                      <p className="font-sans text-sm text-[#3B2314]/75 leading-relaxed">
                        ORIGINN rejects the hyper-acceleration of modern fast retail. We believe your garments shouldn’t make you look like a clone. They should serve as blank backdrops for your exact stories, words, and handcrafted patch details.
                      </p>
                      <p className="font-sans text-sm text-[#3B2314]/75 leading-relaxed">
                        We sourced unbleached, combed organic cotton from Multan's historic farming fields and crafted our customizer so you can place heritage-inspired symbols where they make sense to you.
                      </p>
                      <div className="pt-3">
                        <button
                          id="intro-read-story-btn"
                          onClick={() => setActiveTab('about')}
                          className="text-xs uppercase tracking-widest font-sans font-bold text-[#8B0000] hover:text-[#7A1C1C] flex items-center gap-1.5 focus:outline-none"
                        >
                          Discover Our Brand Story
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                      {/* Artistic SVG placeholders represent premium organic cotton hoodie / tshirt details */}
                      <div className="bg-[#F5F0E8] p-6 rounded-2xl flex flex-col justify-between aspect-square border border-[#3B2314]/5 relative overflow-hidden">
                        <div className="w-12 h-12 text-[#8B0000] opacity-40">
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="10" y="10" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                            <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-semibold text-[#3B2314]">Organic Cotton Hoodies</h4>
                          <p className="font-sans text-[11px] text-[#3B2314]/60 mt-1">450 GSM Heavy loopback fleece.</p>
                        </div>
                      </div>

                      <div className="bg-[#F5F0E8] p-6 rounded-2xl flex flex-col justify-between aspect-square border border-[#3B2314]/5 relative overflow-hidden">
                        <div className="w-12 h-12 text-[#C9A96E] opacity-45">
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2"/>
                            <path d="M35 35 C45 25, 55 25, 65 35" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="50" cy="50" r="4" fill="currentColor"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-semibold text-[#3B2314]">Classic Comfort Tees</h4>
                          <p className="font-sans text-[11px] text-[#3B2314]/60 mt-1">combed combed cotton jersey.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* Why ORIGINN? Problem Cards Section */}
              <section id="why-originn" className="py-20 bg-[#F5F0E8]/50 border-t border-b border-[#3B2314]/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#8B0000]">Conscious Fashion</span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2314]">Why ORIGINN?</h2>
                    <p className="font-sans text-xs sm:text-sm text-[#3B2314]/65">
                      Understanding the friction of mass fast-fashion retail and how we address it.
                    </p>
                  </div>

                  <div id="why-originn-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WHY_ORIGINN_CARDS.map((card, idx) => {
                      return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-[#3B2314]/10 space-y-4 flex flex-col">
                          <div className="w-10 h-10 rounded-xl bg-[#8B0000]/5 flex items-center justify-center text-[#8B0000]">
                            {card.title === 'Overproduction' && <AlertTriangle className="w-5 h-5 stroke-[1.5]" />}
                            {card.title === 'Water Pollution' && <Droplet className="w-5 h-5 stroke-[1.5]" />}
                            {card.title === 'Impersonalization' && <Fingerprint className="w-5 h-5 stroke-[1.5]" />}
                            {card.title === 'Over Pricing' && <BadgePercent className="w-5 h-5 stroke-[1.5]" />}
                          </div>
                          <h3 className="font-serif text-lg font-semibold text-[#3B2314]">{card.title}</h3>
                          <p className="font-sans text-xs text-[#3B2314]/70 leading-relaxed flex-1">
                            {card.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </section>

              {/* Our Objectives Section */}
              <section id="our-objectives" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#C9A96E]">Our Roadmap</span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2314]">Brand Objectives</h2>
                    <p className="font-sans text-xs sm:text-sm text-[#3B2314]/65">
                      Setting ethical coordinates for circular garment production in Pakistan.
                    </p>
                  </div>

                  <div id="objectives-row" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {OUR_OBJECTIVES.map((obj, idx) => {
                      return (
                        <div key={idx} className="relative p-6 rounded-2xl border border-[#3B2314]/10 bg-[#F5F0E8]/20 flex flex-col justify-between aspect-[5/6]">
                          <span className="font-serif text-4xl font-bold text-[#C9A96E]/50 leading-none">
                            {obj.num}
                          </span>
                          <div className="space-y-2 mt-4">
                            <h3 className="font-serif text-base font-bold text-[#3B2314]">{obj.title}</h3>
                            <p className="font-sans text-[11px] text-[#3B2314]/70 leading-relaxed">
                              {obj.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </section>

              {/* Instagram Feed / Social Proof Section */}
              <section id="instagram-feed" className="py-20 bg-[#F5F0E8]/30 border-t border-[#3B2314]/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  
                  <div className="space-y-3 mb-12">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#8B0000]">Social Coordinates</span>
                    <h2 className="font-serif text-3xl font-bold text-[#3B2314]">Follow the Journey</h2>
                    <p className="font-sans text-xs text-[#3B2314]/65">Join our community in Pakistani slow fashion. Use #WearYourStory</p>
                  </div>

                  <div id="insta-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Minimal aesthetic layout representing local community posts */}
                    <div className="group relative aspect-square bg-[#3E2F26] text-[#F5F0E8] p-5 flex flex-col justify-between rounded-xl overflow-hidden shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider opacity-60">@originn_official</div>
                      <div className="text-left space-y-1.5">
                        <p className="font-serif italic text-xs leading-relaxed">"Placed a custom calligraphy patch on my sleeve. Literally wears my heart."</p>
                        <span className="text-[9px] font-sans opacity-50">— Zara K., Lahore</span>
                      </div>
                    </div>

                    <div className="group relative aspect-square bg-white text-[#3B2314] p-5 flex flex-col justify-between rounded-xl overflow-hidden border border-[#3B2314]/10 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-[#3B2314]/50">@originn_official</div>
                      <div className="text-left space-y-1.5">
                        <p className="font-serif italic text-xs leading-relaxed">"The unbleached cream fabric feels so premium. GOTS organic certified."</p>
                        <span className="text-[9px] font-sans text-[#3B2314]/50">— Bilal S., Islamabad</span>
                      </div>
                    </div>

                    <div className="group relative aspect-square bg-[#7A1C1C] text-white p-5 flex flex-col justify-between rounded-xl overflow-hidden shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider opacity-60">@originn_official</div>
                      <div className="text-left space-y-1.5">
                        <p className="font-serif italic text-xs leading-relaxed">"No unneeded plastic tags or synthetic coloring. Pure circular luxury."</p>
                        <span className="text-[9px] font-sans opacity-50">— Amna R., Multan</span>
                      </div>
                    </div>

                    <div className="group relative aspect-square bg-white text-[#3B2314] p-5 flex flex-col justify-between rounded-xl overflow-hidden border border-[#3B2314]/10 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-[#3B2314]/50">@originn_official</div>
                      <div className="text-left space-y-1.5">
                        <p className="font-serif italic text-xs leading-relaxed">"My custom embroidered tagline in Nastaliq gets compliments everywhere!"</p>
                        <span className="text-[9px] font-sans text-[#3B2314]/50">— Daniyal A., Karachi</span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              {/* Shop Page Headers */}
              <div className="mb-10 text-center sm:text-left space-y-2">
                <h1 className="font-serif text-4xl font-bold text-[#3B2314]">The Core Collection</h1>
                <p className="font-sans text-xs sm:text-sm text-[#3B2314]/65">
                  Select a blank canvas silhouette below. Each item can be styled and customized to your exact choice.
                </p>
              </div>

              {/* Filters Panel */}
              <div id="shop-filters-panel" className="bg-[#F5F0E8] p-4 rounded-2xl border border-[#3B2314]/10 mb-8 flex flex-wrap gap-4 items-center justify-between">
                
                {/* Active selectors row */}
                <div className="flex flex-wrap gap-3">
                  {/* Style selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold text-[#3B2314]/60 uppercase tracking-wider">Garment Style</label>
                    <select
                      id="filter-style"
                      value={selectedStyleFilter}
                      onChange={(e) => setSelectedStyleFilter(e.target.value)}
                      className="bg-white border border-[#3B2314]/10 rounded-lg py-1.5 px-3 text-xs font-sans text-[#3B2314] focus:outline-none"
                    >
                      <option value="all">All Silhouettes</option>
                      <option value="hoodie_oversized">Oversized Hoodie</option>
                      <option value="hoodie_relaxed">Relaxed Hoodie</option>
                      <option value="tshirt_classic">Classic T-Shirt</option>
                    </select>
                  </div>

                  {/* Color selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold text-[#3B2314]/60 uppercase tracking-wider">Colorways</label>
                    <select
                      id="filter-color"
                      value={selectedColorFilter}
                      onChange={(e) => setSelectedColorFilter(e.target.value)}
                      className="bg-white border border-[#3B2314]/10 rounded-lg py-1.5 px-3 text-xs font-sans text-[#3B2314] focus:outline-none"
                    >
                      <option value="all">All Botanical Shades</option>
                      <option value="sand_beige">Sand Beige</option>
                      <option value="cream_white">Cream White</option>
                      <option value="deep_crimson">Deep Crimson</option>
                      <option value="earth_brown">Earth Brown</option>
                      <option value="olive_green">Olive Green</option>
                    </select>
                  </div>

                  {/* Fabric selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold text-[#3B2314]/60 uppercase tracking-wider">Raw Material</label>
                    <select
                      id="filter-fabric"
                      value={selectedFabricFilter}
                      onChange={(e) => setSelectedFabricFilter(e.target.value)}
                      className="bg-white border border-[#3B2314]/10 rounded-lg py-1.5 px-3 text-xs font-sans text-[#3B2314] focus:outline-none"
                    >
                      <option value="all">All Sustainable Fibers</option>
                      <option value="organic_cotton">Organic Cotton</option>
                      <option value="recycled_poly">Recycled Poly</option>
                      <option value="bamboo_blend">Bamboo Blend</option>
                    </select>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  id="reset-filters-btn"
                  onClick={() => {
                    setSelectedStyleFilter('all');
                    setSelectedColorFilter('all');
                    setSelectedFabricFilter('all');
                  }}
                  className="text-xs font-sans font-bold text-[#8B0000] hover:text-red-700 underline focus:outline-none"
                >
                  Clear All Filters
                </button>
              </div>

              {/* Dynamic products list */}
              {filteredProducts.length > 0 ? (
                <div id="shop-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((prod) => {
                    const isWish = wishlist.some((item) => item.id === prod.id);
                    return (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onCustomize={handleCustomizeProduct}
                        isWishlisted={isWish}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-[#3B2314]/10 space-y-4">
                  <span className="text-4xl">🌱</span>
                  <h3 className="font-serif text-lg font-bold text-[#3B2314]">No matching canvas found</h3>
                  <p className="font-sans text-xs text-[#3B2314]/60 max-w-sm mx-auto">
                    We only carry authentic botanical shades and organic blends. Please adjust your filters or reset.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedStyleFilter('all');
                      setSelectedColorFilter('all');
                      setSelectedFabricFilter('all');
                    }}
                    className="bg-[#3B2314] hover:bg-[#8B0000] text-white px-5 py-2 rounded-lg text-xs font-sans uppercase font-bold tracking-wider"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'customize' && (
            <motion.div
              key="customize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Live Preview Canvas Column */}
                <div className="lg:col-span-5 h-full">
                  <CustomizePreview
                    style={custStyle}
                    color={custColor}
                    view={custView}
                    setView={setCustView}
                    patches={custPatches}
                    setPatches={setCustPatches}
                    selectedPatchId={selectedPatchId}
                    setSelectedPatchId={setSelectedPatchId}
                    customText={custText}
                    textLanguage={custTextLanguage}
                    threadColor={custThreadColor}
                    threadColorName={custThreadColorName}
                    textView={custTextView}
                    setTextView={setCustTextView}
                    textX={custTextX}
                    textY={custTextY}
                    textScale={custTextScale}
                    setTextX={setCustTextX}
                    setTextY={setCustTextY}
                    setTextScale={setCustTextScale}
                    isTextSelected={isTextSelected}
                    setIsTextSelected={setIsTextSelected}
                  />
                </div>

                {/* Right Step Configurations Options Sidebar Column */}
                <div className="lg:col-span-7 h-full">
                  <CustomizeSteps
                    currentStep={customizerStep}
                    setCurrentStep={setCustomizerStep}
                    style={custStyle}
                    setStyle={setCustStyle}
                    fabric={custFabric}
                    setFabric={setCustFabric}
                    color={custColor}
                    setColor={setCustColor}
                    view={custView}
                    setView={setCustView}
                    patches={custPatches}
                    setPatches={setCustPatches}
                    selectedPatchId={selectedPatchId}
                    setSelectedPatchId={setSelectedPatchId}
                    customText={custText}
                    setCustomText={setCustText}
                    textLanguage={custTextLanguage}
                    setTextLanguage={setCustTextLanguage}
                    threadColor={custThreadColor}
                    setThreadColor={setCustThreadColor}
                    threadColorName={custThreadColorName}
                    setThreadColorName={setCustThreadColorName}
                    textView={custTextView}
                    setTextView={setCustTextView}
                    size={custSize}
                    setSize={setCustSize}
                    onAddToCart={handleAddToCart}
                    totalPrice={customizerTotalPrice}
                  />
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-12"
            >
              {/* Editorial storytelling page */}
              <div className="text-center space-y-3">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#8B0000]">Our Origins</span>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3B2314]">Your Story. Your Style.</h1>
                <p className="font-serif italic text-sm text-[#C9A96E]">"Wear Your Story. Made Just For You."</p>
              </div>

              <div className="prose prose-stone font-serif text-sm sm:text-base text-[#3B2314]/85 leading-relaxed space-y-6">
                <p>
                  ORIGINN was born from the frustration of fast fashion—the endless overproduction, standard clone-like prints, toxic wastewater, and a retail system designed to make you fit in, rather than stand out.
                </p>
                <p>
                  We saw beautiful local Pakistani fabrics being manufactured for global exports, while unneeded excess fabrics went straight into landfills. We realized there was a better way. A slower way.
                </p>
                <p>
                  By creating an unbleached botanical blank canvas and an interactive custom placement editor, we handed the design control back to where it belongs: to you.
                </p>
                <p className="font-bold text-[#8B0000]">
                  "Custom is the new normal. Made just for you. Not for everyone."
                </p>
                <p>
                  Every organic thread, zero-water dye bath, and upcycled patch is verified locally. We produce with independent sewing and embroidery guilds across Lahore and Multan, paying fair ethical living wages to preserve local heritage.
                </p>
              </div>

              {/* Artisan Team Grid */}
              <div className="pt-10 border-t border-[#3B2314]/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-1">
                  <span className="text-2xl">🌱</span>
                  <h4 className="font-serif text-sm font-bold text-[#3B2314]">Sustainable Sourcing</h4>
                  <p className="font-sans text-[11px] text-[#3B2314]/60">GOTS certified organic unbleached cotton from Multan.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl">🪡</span>
                  <h4 className="font-serif text-sm font-bold text-[#3B2314]">Local Tailoring</h4>
                  <p className="font-sans text-[11px] text-[#3B2314]/60">Individually cut, sewn and hand-assembled in Lahore.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl">✨</span>
                  <h4 className="font-serif text-sm font-bold text-[#3B2314]">No Inventory Waste</h4>
                  <p className="font-sans text-[11px] text-[#3B2314]/60">We only purchase and dye materials once you place your design.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sustainability' && (
            <motion.div
              key="sustainability"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-12"
            >
              <div className="text-center space-y-3">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#31572C]">Ecological Footprint</span>
                <h1 className="font-serif text-4xl font-bold text-[#3B2314]">Circular Sustainable Practices</h1>
                <p className="font-sans text-xs text-[#3B2314]/60">Designing out waste and toxic chemical dye cycles from Pakistan's textile system.</p>
              </div>

              {/* Interactive Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#ECF3EC] p-5 rounded-2xl border border-[#31572C]/10 space-y-3">
                  <span className="inline-block bg-[#31572C] text-[#ECF3EC] text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-0.5 rounded">
                    Zero Water Dyeing
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#31572C]">Waterless Dyes</h4>
                  <p className="font-sans text-[11px] text-[#31572C]/80 leading-relaxed">
                    By utilizing organic pigment suspensions in a closed-loop spray process, we eliminate the intensive toxic wash cycles that pollute precious Indus Valley drinking water.
                  </p>
                </div>

                <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#C9A96E]/20 space-y-3">
                  <span className="inline-block bg-[#C9A96E] text-[#3B2314] text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-0.5 rounded">
                    Circular Upcycling
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#3B2314]">Upcycled Patches</h4>
                  <p className="font-sans text-[11px] text-[#3B2314]/80 leading-relaxed">
                    We rescue premium surplus cotton export cuts from high-grade knit mills, sorting and upcycling them into the custom embroidery patch backdrops available in our design tool.
                  </p>
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3">
                  <span className="inline-block bg-amber-700 text-amber-50 text-[9px] uppercase tracking-wider font-sans font-bold px-2 py-0.5 rounded">
                    100% Traceable
                  </span>
                  <h4 className="font-serif text-base font-bold text-amber-900">Local Pakistan Hubs</h4>
                  <p className="font-sans text-[11px] text-amber-900/80 leading-relaxed">
                    Every garment is shipped via localized clean courier partners, reducing transit carbon miles from overseas factories. Zero middlemen, fair local pricing.
                  </p>
                </div>
              </div>

              {/* Circular Economy Insights */}
              <div className="bg-white p-6 rounded-2xl border border-[#3B2314]/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#3B2314]">Fashion Circular Economy Insights</h3>
                <div className="space-y-3 font-sans text-xs text-[#3B2314]/85 leading-relaxed">
                  <p>
                    <strong>Linear vs. Circular Models:</strong> The linear "take-make-waste" model dumps up to 85% of textiles directly into garbage. A circular model retains high-quality fibers inside the loop by designing for durability and ease of upcycling.
                  </p>
                  <p>
                    <strong>Empowering Local Growth:</strong> By routing local unbleached cotton directly to Pakistani customizers, we avoid massive international cargo freight pollution and distribute fair wages directly back to Multan cotton harvesters.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavClick={setActiveTab} />

      {/* Slide-over Right Drawer: SHOPPING BAG & CHECKOUT */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="relative w-full max-w-md bg-[#F5F0E8] h-full shadow-2xl flex flex-col z-10 border-l border-[#3B2314]/10"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#3B2314]/10 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#3B2314] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#8B0000]" />
                  Your Shopping Bag
                </h3>
                <button
                  id="close-cart-drawer-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-[#3B2314]/60 hover:text-[#3B2314] focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Body based on checkout state */}
              {checkoutStep === 'cart_review' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length > 0 ? (
                      cart.map((item) => {
                        const styleName = GARMENT_STYLE_DETAILS[item.customization?.style || 'tshirt_classic']?.name;
                        const fabricName = FABRIC_DETAILS[item.customization?.fabric || 'organic_cotton']?.name.split(' (')[0];
                        const colorName = COLOR_DETAILS[item.customization?.color || 'sand_beige']?.name;
                        
                        return (
                          <div key={item.id} className="bg-white p-3.5 rounded-xl border border-[#3B2314]/10 flex gap-3 relative">
                            {/* Visual small preview garment icon */}
                            <div className="w-16 h-16 rounded-lg bg-[#F5F0E8] shrink-0 flex items-center justify-center p-2 border border-[#3B2314]/5">
                              <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M90 130 C120 120, 200 120, 310 130 L325 210 L325 440 L75 440 Z" fill={COLOR_DETAILS[item.customization?.color || 'sand_beige']?.hex} stroke="#3B2314" strokeWidth="8"/>
                              </svg>
                            </div>

                            {/* Spec details */}
                            <div className="space-y-1 font-sans text-xs flex-1">
                              <h4 className="font-serif text-xs font-bold text-[#3B2314] line-clamp-1">Customized {styleName}</h4>
                              <p className="text-[10px] text-[#3B2314]/60">{fabricName} • {colorName} • Size {item.size}</p>
                              {item.customization?.customText && (
                                <p className="text-[10px] text-[#8B0000] font-semibold">Embroidery: "{item.customization.customText}"</p>
                              )}
                              {item.customization?.patches && item.customization.patches.length > 0 && (
                                <p className="text-[10px] text-[#C9A96E] font-semibold">Art Patches: {item.customization.patches.length} placed</p>
                              )}
                              
                              {/* Quantity selectors */}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => handleUpdateCartQty(item.id, 'down')}
                                  className="w-5 h-5 rounded border border-[#3B2314]/20 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-[11px] text-[#3B2314]">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateCartQty(item.id, 'up')}
                                  className="w-5 h-5 rounded border border-[#3B2314]/20 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Price / Delete */}
                            <div className="text-right flex flex-col justify-between items-end">
                              <button
                                onClick={() => handleRemoveCartItem(item.id)}
                                className="text-gray-400 hover:text-[#8B0000]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-serif text-xs font-bold text-[#8B0000] whitespace-nowrap">
                                PKR {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 space-y-3">
                        <span className="text-3xl">🛒</span>
                        <h4 className="font-serif text-sm font-semibold text-[#3B2314]">Your Bag is empty</h4>
                        <p className="font-sans text-[10px] text-[#3B2314]/60 max-w-xs mx-auto">
                          Add customized hoodies or classic combed-cotton t-shirts to begin wearing your story.
                        </p>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            setActiveTab('customize');
                          }}
                          className="bg-[#3B2314] hover:bg-[#8B0000] text-white py-2 px-5 rounded-lg text-xs font-sans uppercase font-bold tracking-wider"
                        >
                          Go Customize
                        </button>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-white border-t border-[#3B2314]/10 space-y-4 font-sans text-xs">
                      <div className="flex justify-between font-bold text-sm text-[#3B2314]">
                        <span>Bag Subtotal</span>
                        <span className="font-serif">
                          PKR {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#31572C] leading-relaxed bg-[#ECF3EC] p-2.5 rounded-lg border border-[#31572C]/10">
                        📦 Free Standard Shipping across Pakistan. Delivery estimated in 7–10 working days.
                      </p>
                      <button
                        id="proceed-checkout-btn"
                        onClick={() => setCheckoutStep('shipping_form')}
                        className="w-full bg-[#8B0000] hover:bg-[#7A1C1C] text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-sans font-bold shadow text-center focus:outline-none"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Checkout details form */}
              {checkoutStep === 'shipping_form' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      
                      {/* Back to Cart button */}
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('cart_review')}
                        className="text-[10px] font-sans font-bold text-[#3B2314] hover:text-[#8B0000] flex items-center gap-1 focus:outline-none"
                      >
                        ← Back to Shopping Bag
                      </button>

                      <h4 className="font-serif text-base font-bold text-[#3B2314] border-b border-[#3B2314]/10 pb-2">
                        Delivery & Checkout details
                      </h4>

                      <div className="space-y-3 font-sans text-xs">
                        {/* Name input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3B2314]/75 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            placeholder="e.g. Talha Naseeb"
                            className="w-full bg-white border border-[#3B2314]/15 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#8B0000]"
                          />
                        </div>

                        {/* Email input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3B2314]/75 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={shippingEmail}
                            onChange={(e) => setShippingEmail(e.target.value)}
                            placeholder="e.g. customer@domain.com"
                            className="w-full bg-white border border-[#3B2314]/15 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#8B0000]"
                          />
                        </div>

                        {/* Phone input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3B2314]/75 mb-1">Mobile Phone (Pakistan)</label>
                          <input
                            type="tel"
                            required
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            placeholder="e.g. 0300-1234567"
                            className="w-full bg-white border border-[#3B2314]/15 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#8B0000]"
                          />
                        </div>

                        {/* Address input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3B2314]/75 mb-1">Shipping Address</label>
                          <textarea
                            required
                            rows={2}
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="e.g. House 45, Street 2, DHA Phase 5"
                            className="w-full bg-white border border-[#3B2314]/15 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#8B0000]"
                          />
                        </div>

                        {/* City Dropdown Selection for Pakistan focus */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3B2314]/75 mb-1">City</label>
                          <select
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            className="w-full bg-white border border-[#3B2314]/15 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#8B0000]"
                          >
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                            <option value="Multan">Multan</option>
                            <option value="Faisalabad">Faisalabad</option>
                            <option value="Peshawar">Peshawar</option>
                            <option value="Quetta">Quetta</option>
                            <option value="Sialkot">Sialkot</option>
                          </select>
                        </div>

                        {/* Payment Options Selection */}
                        <div className="pt-2 border-t border-[#3B2314]/10">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3B2314]/75 mb-2">Payment Method</label>
                          <div id="payment-methods" className="space-y-2">
                            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#3B2314]/10 bg-white cursor-pointer hover:border-[#8B0000] transition-colors">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="accent-[#8B0000]"
                              />
                              <div>
                                <span className="font-bold text-[11px] block">Cash on Delivery (COD)</span>
                                <span className="text-[10px] text-[#3B2314]/50">Pay in PKR upon physical delivery. Safe & simple.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#3B2314]/10 bg-white cursor-pointer hover:border-[#8B0000] transition-colors">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'bank_transfer'}
                                onChange={() => setPaymentMethod('bank_transfer')}
                                className="accent-[#8B0000]"
                              />
                              <div>
                                <span className="font-bold text-[11px] block">Bank Transfer (HBL Bank)</span>
                                <span className="text-[10px] text-[#3B2314]/50">Transfer directly to HBL Islamic Pakistan and send slip.</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {paymentMethod === 'bank_transfer' && (
                          <div className="bg-[#F5F0E8] p-3 rounded-lg border border-[#C9A96E]/30 space-y-1 text-[10px] text-[#3B2314]">
                            <p className="font-bold">ORIGINN Bank coordinates:</p>
                            <p>Bank: Habib Bank Limited (HBL) Islamic</p>
                            <p>Account No: 2419-0984-2616-98</p>
                            <p>IBAN: PK72HBLI24190984261698</p>
                            <p className="text-[#8B0000] font-semibold mt-1">Please email payment transfer confirmation slip to care@originn.pk with your order ID.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="p-4 bg-white border-t border-[#3B2314]/10 space-y-3 font-sans text-xs">
                      <div className="flex justify-between font-bold text-sm">
                        <span>Grand Total (PKR)</span>
                        <span className="font-serif">
                          PKR {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#8B0000] hover:bg-[#7A1C1C] text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-sans font-bold shadow text-center focus:outline-none"
                      >
                        Place Order (Complete Purchase)
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Order Confirmation success screen */}
              {checkoutStep === 'success' && (
                <div className="flex-1 p-6 space-y-5 flex flex-col justify-center items-center text-center font-sans">
                  <CheckCircle className="w-16 h-16 text-[#31572C]" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-bold text-[#3B2314]">Thank You (Shukriya)</h4>
                    <p className="text-xs text-[#31572C] uppercase tracking-widest font-bold">Your Story is in Production</p>
                  </div>
                  
                  <p className="text-xs text-[#3B2314]/75 max-w-xs leading-relaxed">
                    We have successfully logged your custom design. Our local Punjab artisans are now cutting and stitching your garment.
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-[#3B2314]/10 w-full text-xs text-[#3B2314] space-y-2 text-left">
                    <p><strong>Order ID:</strong> {latestOrder?.id}</p>
                    <p><strong>Deliver To:</strong> {latestOrder?.shippingName}</p>
                    <p><strong>Contact No:</strong> {latestOrder?.shippingPhone}</p>
                    <p><strong>Address:</strong> {latestOrder?.shippingAddress}, {latestOrder?.shippingCity}</p>
                    <p><strong>Payment Mode:</strong> {latestOrder?.paymentMethod === 'cod' ? 'Cash on Delivery (PKR)' : 'Direct Bank Slip'}</p>
                    <p className="border-t border-[#3B2314]/5 pt-2 font-bold text-[#8B0000] text-right">
                      Total Order: PKR {latestOrder?.total.toLocaleString()}
                    </p>
                  </div>

                  <button
                    id="finish-order-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep('cart_review');
                      setActiveTab('home');
                    }}
                    className="bg-[#3B2314] hover:bg-[#8B0000] text-[#F5F0E8] py-2.5 px-6 rounded-lg text-xs uppercase tracking-wider font-bold transition-colors w-full"
                  >
                    Return to Home Page
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over Right Drawer: WISHLIST */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="relative w-full max-w-md bg-[#F5F0E8] h-full shadow-2xl flex flex-col z-10 border-l border-[#3B2314]/10"
            >
              <div className="p-4 sm:p-5 border-b border-[#3B2314]/10 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#3B2314] flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#8B0000] fill-[#8B0000]" />
                  Your Wishlist
                </h3>
                <button
                  id="close-wishlist-drawer"
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 text-[#3B2314]/60 hover:text-[#3B2314] focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {wishlist.length > 0 ? (
                  wishlist.map((prod) => {
                    const isHoodie = prod.style.includes('hoodie');
                    const colorHex = COLOR_DETAILS[prod.color]?.hex || '#D9D2C5';
                    return (
                      <div key={prod.id} className="bg-white p-3 rounded-xl border border-[#3B2314]/10 flex gap-3 items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Mini visual */}
                          <div className="w-12 h-12 bg-[#F5F0E8] rounded-md shrink-0 flex items-center justify-center p-1.5">
                            {isHoodie ? (
                              <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 L80 430 L50 430 C40 380, 35 240, 55 170 Z" fill={colorHex} stroke="#3B2314" strokeWidth="15"/>
                              </svg>
                            ) : (
                              <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M90 130 C120 120, 150 120, 200 120 L310 130 L325 210 L325 440 L75 440 Z" fill={colorHex} stroke="#3B2314" strokeWidth="15"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-serif text-xs font-bold text-[#3B2314]">{prod.name}</h4>
                            <p className="text-[10px] text-[#3B2314]/50">PKR {prod.price.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            id={`wishlist-customize-btn-${prod.id}`}
                            onClick={() => {
                              setIsWishlistOpen(false);
                              handleCustomizeProduct(prod);
                            }}
                            className="bg-[#3B2314] hover:bg-[#8B0000] text-white py-1 px-3 rounded text-[10px] uppercase font-sans font-bold"
                          >
                            Customize
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(prod)}
                            className="text-gray-300 hover:text-[#8B0000]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 space-y-3">
                    <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                    <h4 className="font-serif text-xs font-semibold text-[#3B2314]">Wishlist is empty</h4>
                    <p className="font-sans text-[10px] text-[#3B2314]/50 max-w-xs mx-auto">
                      Save botanical shades or organic combinations you love here for future customization.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over Right Drawer: PROFILE & PAKISTAN SETTINGS */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="relative w-full max-w-md bg-[#F5F0E8] h-full shadow-2xl flex flex-col z-10 border-l border-[#3B2314]/10"
            >
              <div className="p-4 sm:p-5 border-b border-[#3B2314]/10 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#3B2314] flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#8B0000]" />
                  Your Profile & Orders (Pakistan)
                </h3>
                <button
                  id="close-profile-drawer"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 text-[#3B2314]/60 hover:text-[#3B2314] focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans text-xs">
                
                {/* Local user indicators */}
                <div className="bg-white p-4 rounded-xl border border-[#3B2314]/10 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3B2314] text-[#F5F0E8] flex items-center justify-center font-bold">
                      PK
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#3B2314]">Local Guest Account</h4>
                      <p className="text-[10px] text-[#31572C] font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Region: Pakistan (PKR)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders list */}
                <div className="space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#3B2314] flex items-center gap-1.5">
                    Order History ({orders.length})
                  </h4>
                  {orders.length > 0 ? (
                    orders.map((ord) => {
                      return (
                        <div key={ord.id} className="bg-white p-3.5 rounded-xl border border-[#3B2314]/10 space-y-2">
                          <div className="flex justify-between items-center border-b border-[#3B2314]/5 pb-1.5">
                            <span className="font-mono text-[10px] font-bold text-[#3B2314]">{ord.id}</span>
                            <span className="bg-[#31572C]/15 text-[#31572C] font-sans font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                              {ord.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-[10px] text-[#3B2314]/75">
                            <p><strong>Order Date:</strong> {ord.date}</p>
                            <p><strong>Deliver To:</strong> {ord.shippingName} ({ord.shippingPhone})</p>
                            <p><strong>City:</strong> {ord.shippingCity}</p>
                            <p><strong>Items:</strong> {ord.items.length} customizable garment(s)</p>
                          </div>
                          
                          <div className="flex justify-between items-center border-t border-[#3B2314]/5 pt-2">
                            <span className="text-[10px] text-gray-400">Payment: {ord.paymentMethod.toUpperCase()}</span>
                            <span className="font-serif font-bold text-[#8B0000]">PKR {ord.total.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 bg-white/50 rounded-xl border border-dashed border-[#3B2314]/15">
                      <p className="text-[10px] text-[#3B2314]/50">No previous orders logged.</p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    );
  }
