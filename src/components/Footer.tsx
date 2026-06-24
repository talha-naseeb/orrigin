/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, Send, Check } from 'lucide-react';

interface FooterProps {
  onNavClick: (tabId: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#3B2314] text-[#F5F0E8] pt-16 pb-8 border-t border-[#3B2314]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#F5F0E8]/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="font-serif text-3xl font-bold tracking-widest text-[#C9A96E]">
                OR
              </div>
              <div className="text-xs uppercase tracking-[0.4em] font-sans text-[#F5F0E8] font-bold mt-1">
                ORIGINN
              </div>
            </div>
            <p className="font-sans text-xs text-[#F5F0E8]/75 leading-relaxed max-w-xs">
              Slow fashion meets modern minimalism. We build custom-crafted, sustainable hoodies and t-shirts locally sourced and sewn in Pakistan.
            </p>
            <div className="font-serif italic text-sm text-[#C9A96E]">
              "Wear Your Story. Your Story. Your Style."
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#C9A96E] mb-4">Discover</h3>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button onClick={() => onNavClick('shop')} className="text-[#F5F0E8]/80 hover:text-[#C9A96E] transition-colors focus:outline-none">
                  Shop Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('customize')} className="text-[#F5F0E8]/80 hover:text-[#C9A96E] transition-colors focus:outline-none">
                  Customization Tool
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('about')} className="text-[#F5F0E8]/80 hover:text-[#C9A96E] transition-colors focus:outline-none">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('sustainability')} className="text-[#F5F0E8]/80 hover:text-[#C9A96E] transition-colors focus:outline-none">
                  Our Objectives & Eco-Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#C9A96E] mb-4">Origins</h3>
            <p className="font-sans text-xs text-[#F5F0E8]/85 mb-3 leading-relaxed">
              Studio & Production:<br />
              Lahore & Multan, Pakistan
            </p>
            <p className="font-sans text-xs text-[#F5F0E8]/70 mb-4">
              Enquiries: care@originn.pk
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com/originn_official"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#F5F0E8]/20 flex items-center justify-center text-[#F5F0E8]/80 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@originn_official"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#F5F0E8]/20 flex items-center justify-center text-[#F5F0E8]/80 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all font-sans text-[10px] font-bold"
                aria-label="TikTok"
              >
                T
              </a>
              <span className="text-[11px] font-sans text-[#F5F0E8]/60">@originn_official</span>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#C9A96E] mb-4">Join the Slow Movement</h3>
            <p className="font-sans text-xs text-[#F5F0E8]/75 mb-4 leading-relaxed">
              Subscribe to get exclusive access to drop coordinates, upcycling workshops, and sustainable fashion insights in Pakistan.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#F5F0E8]/5 border border-[#F5F0E8]/20 rounded-lg py-2.5 pl-3.5 pr-12 text-xs text-[#F5F0E8] placeholder-[#F5F0E8]/40 focus:outline-none focus:border-[#C9A96E] transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#C9A96E] hover:bg-[#b0925c] text-[#3B2314] rounded-md transition-colors flex items-center justify-center focus:outline-none"
                aria-label="Submit email"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-[#C9A96E] text-[11px] font-sans mt-2">
                Thank you. Welcome to our story.
              </p>
            )}
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-[11px] text-[#F5F0E8]/40 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} ORIGINN Co. All Rights Reserved. Crafted with care in Lahore, Pakistan.</p>
          <div className="flex space-x-6">
            <span className="hover:text-[#C9A96E] transition-colors cursor-pointer">Ethical Standards</span>
            <span className="hover:text-[#C9A96E] transition-colors cursor-pointer">Privacy & Cookie Rights</span>
            <span className="hover:text-[#C9A96E] transition-colors cursor-pointer">Delivery & Returns (Pakistan)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
