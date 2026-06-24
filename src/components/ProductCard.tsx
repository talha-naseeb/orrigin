/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { COLOR_DETAILS, GARMENT_STYLE_DETAILS } from '../data';
import { Heart, Sliders, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  key?: string | number;
}

export default function ProductCard({
  product,
  onCustomize,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  const colorHex = COLOR_DETAILS[product.color]?.hex || '#D9D2C5';
  const isHoodie = product.style.includes('hoodie');

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-[#3B2314]/10 shadow-sm overflow-hidden flex flex-col group h-full"
    >
      {/* Visual Garment Stage Representation */}
      <div className="relative aspect-[4/5] bg-[#F5F0E8]/35 flex items-center justify-center p-6 border-b border-[#3B2314]/5 overflow-hidden">
        
        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full border shadow-sm transition-all z-10 focus:outline-none ${
            isWishlisted
              ? 'bg-[#8B0000] border-[#8B0000] text-white'
              : 'bg-white border-[#3B2314]/10 text-[#3B2314]/75 hover:text-[#8B0000] hover:scale-105'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Dynamic Photorealistic Illustration of the Garment */}
        <div className="w-full max-w-[160px] aspect-square flex items-center justify-center drop-shadow-[0_8px_16px_rgba(59,35,20,0.12)] group-hover:scale-105 transition-transform duration-500">
          {isHoodie ? (
            <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id={`hoodie-card-clip-${product.id}`}>
                  <path d="M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 L80 430 C65 430, 50 440, 50 430 C40 380, 35 240, 55 170 Z" />
                  <path d="M125 102 C125 40, 275 40, 275 102 C275 125, 230 145, 200 145 C170 145, 125 125, 125 102 Z" />
                  <path d="M70 120 L30 200 C15 250, 5 320, 10 380 L35 385 L52 230" />
                  <path d="M330 120 L370 200 C385 250, 395 320, 390 380 L365 385 L348 230" />
                  <rect x="75" y="445" width="250" height="20" rx="2" />
                </clipPath>
              </defs>
              <path d="M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 L80 430 C65 430, 50 440, 50 430 C40 380, 35 240, 55 170 Z" fill={colorHex} />
              <path d="M125 102 C125 40, 275 40, 275 102 C275 125, 230 145, 200 145 C170 145, 125 125, 125 102 Z" fill={colorHex} />
              <path d="M70 120 L30 200 L10 380 L35 385 L52 230" fill={colorHex} />
              <path d="M330 120 L370 200 L390 380 L365 385 L348 230" fill={colorHex} />
              <image 
                href="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
                x="-30" 
                y="-10" 
                width="460" 
                height="510" 
                clipPath={`url(#hoodie-card-clip-${product.id})`}
                style={{ mixBlendMode: 'multiply', opacity: 0.98, pointerEvents: 'none', filter: 'saturate(0) brightness(1.35) contrast(1.15)' }}
              />
            </svg>
          ) : (
            <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id={`tshirt-card-clip-${product.id}`}>
                  <path d="M90 130 C120 120, 150 120, 200 120 C250 120, 280 120, 310 130 L325 210 C335 270, 330 380, 325 440 C325 450, 315 455, 300 455 L100 455 C85 455, 75 450, 75 440 C70 380, 65 270, 75 210 Z" />
                  <path d="M90 130 L45 190 C40 198, 48 205, 58 202 L95 185" />
                  <path d="M310 130 L355 190 C360 198, 352 205, 342 202 L305 185" />
                </clipPath>
              </defs>
              <path d="M90 130 C120 120, 150 120, 200 120 C250 120, 280 120, 310 130 L325 210 C335 270, 330 380, 325 440 C325 450, 315 455, 300 455 L100 455 C85 455, 75 450, 75 440 C70 380, 65 270, 75 210 Z" fill={colorHex} />
              <path d="M90 130 L45 190 C40 198, 48 205, 58 202 L95 185" fill={colorHex} />
              <path d="M310 130 L355 190 C360 198, 352 205, 342 202 L305 185" fill={colorHex} />
              <image 
                href="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                x="-10" 
                y="10" 
                width="420" 
                height="470" 
                clipPath={`url(#tshirt-card-clip-${product.id})`}
                style={{ mixBlendMode: 'multiply', opacity: 0.98, pointerEvents: 'none', filter: 'saturate(0) brightness(1.02) contrast(1.05)' }}
              />
            </svg>
          )}
        </div>

        {/* Eco Badge Indicator overlays */}
        <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
          <span className="bg-[#3B2314] text-[#F5F0E8] font-sans text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded">
            Sustainable
          </span>
          <span className="bg-[#C9A96E] text-[#3B2314] font-sans text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded">
            Customizable
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="flex items-start justify-between gap-1">
          <div>
            <h4 className="font-serif text-sm font-bold text-[#3B2314] leading-tight group-hover:text-[#8B0000] transition-colors">
              {product.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-sans font-semibold text-[#3B2314]/60 capitalize bg-[#F5F0E8] px-2 py-0.5 rounded border border-[#3B2314]/5">
                {COLOR_DETAILS[product.color]?.name}
              </span>
              <span className="text-[10px] font-sans text-[#3B2314]/60">
                {product.style.includes('oversized') ? 'Oversized Fit' : 'Relaxed Fit'}
              </span>
            </div>
          </div>
          <span className="font-serif font-bold text-[#8B0000] text-sm whitespace-nowrap pt-0.5">
            PKR {product.price.toLocaleString()}
          </span>
        </div>

        <p className="font-sans text-[11px] text-[#3B2314]/70 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Social stats */}
        <div className="flex items-center justify-between text-[10px] font-sans text-[#3B2314]/65 pt-2 border-t border-[#3B2314]/5 mt-auto">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#C9A96E] stroke-none" />
            <span className="font-bold text-[#3B2314]">{product.rating}</span>
            <span>({product.reviewsCount} reviews)</span>
          </div>
          <span className="text-[#31572C] font-semibold">100% Traceable Cotton</span>
        </div>

        {/* Action button */}
        <button
          id={`customize-direct-btn-${product.id}`}
          onClick={() => onCustomize(product)}
          className="w-full bg-[#3B2314] hover:bg-[#8B0000] text-[#F5F0E8] hover:text-white font-sans text-[10px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
        >
          <Sliders className="w-3.5 h-3.5" />
          Customize & Purchase
        </button>
      </div>

    </motion.div>
  );
}
