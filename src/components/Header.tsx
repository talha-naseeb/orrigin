/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Heart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenProfile: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenProfile
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Collection' },
    { id: 'customize', label: 'Customize' },
    { id: 'about', label: 'Brand Story' },
    { id: 'sustainability', label: 'Sustainability' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5F0E8]/90 backdrop-blur-md shadow-sm border-b border-[#3B2314]/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo - OR monogram with word ORIGINN underneath */}
          <button
            id="logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="font-serif text-2xl font-bold tracking-widest text-[#8B0000] leading-none transition-transform duration-300 group-hover:scale-105">
              OR
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#3B2314] font-semibold mt-0.5">
              ORIGINN
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative font-sans text-xs uppercase tracking-widest font-medium py-2 transition-colors duration-200 focus:outline-none ${
                    isActive ? 'text-[#8B0000]' : 'text-[#3B2314]/80 hover:text-[#8B0000]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B0000]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Icons Bar */}
          <div id="header-icons" className="flex items-center space-x-3 sm:space-x-5">
            {/* Wishlist Button */}
            <button
              id="wishlist-trigger-btn"
              onClick={onOpenWishlist}
              className="p-2 text-[#3B2314] hover:text-[#8B0000] transition-colors relative focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C9A96E] text-[#3B2314] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#F5F0E8]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="p-2 text-[#3B2314] hover:text-[#8B0000] transition-colors relative focus:outline-none"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#8B0000] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#F5F0E8]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Profile (Pakistan localization) */}
            <button
              id="profile-trigger-btn"
              onClick={onOpenProfile}
              className="p-2 text-[#3B2314] hover:text-[#8B0000] transition-colors focus:outline-none"
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#3B2314] hover:text-[#8B0000] transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#F5F0E8] border-b border-[#3B2314]/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left font-sans text-xs uppercase tracking-widest font-semibold py-3 px-4 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#8B0000]/10 text-[#8B0000]'
                      : 'text-[#3B2314] hover:bg-[#3B2314]/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-[#3B2314]/5 flex items-center justify-between px-4 text-xs text-[#3B2314]/60 font-sans">
                <span>📍 Pakistan (PKR)</span>
                <span>Tagline: Your Story. Your Style.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
