/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetPatch, Product, GarmentStyle, FabricType, GarmentColor } from './types';

// Let's create beautiful SVG paths or simplified vector illustrations for our patches.
// This ensures they are fully responsive, clean, and never break.
export const PRESET_PATCHES: PresetPatch[] = [
  {
    id: 'or_monogram',
    name: 'OR Classic Emblem',
    category: 'logo',
    description: 'The elegant signature OR monogram. Minimalist sustainable luxury.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="2"/>
      <path d="M40 35H46C51 35 53 37.5 53 41.5C53 45.5 51 48 46 48H40V35ZM40 48H45L54 65H47L40 51V65H34V35H40V48Z" fill="currentColor"/>
      <path d="M56 35H62C67 35 69 37.5 69 41.5C69 45.5 67 48 62 48H56V35ZM56 48H61L70 65H63L56 51V65H50V35H56V48Z" fill="currentColor" opacity="0.3"/>
    </svg>`
  },
  {
    id: 'wear_story_ur',
    name: 'اپنی کہانی پہنیں (Wear Your Story)',
    category: 'calligraphy',
    description: 'Artistic Urdu calligraphy rendering of the signature tagline "Wear Your Story."',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="10" fill="currentColor" fill-opacity="0.05"/>
      <path d="M25 45 C35 30, 65 30, 75 45 M30 55 C40 40, 60 40, 70 55 M50 30 L50 70 M35 65 C45 75, 55 75, 65 65" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="48" r="3" fill="currentColor"/>
      <circle cx="35" cy="40" r="3" fill="currentColor"/>
      <circle cx="65" cy="40" r="3" fill="currentColor"/>
      <text x="50" y="85" text-anchor="middle" font-family="serif" font-size="8" fill="currentColor" font-weight="bold">WEAR YOUR STORY</text>
    </svg>`
  },
  {
    id: 'jasmine_bloom',
    name: 'Jasmine Bloom',
    category: 'heritage',
    description: 'Pakistan’s national flower, symbolizing simplicity, grace, and purity.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" stroke-width="2" fill="none">
        <path d="M50 50 C40 30, 60 30, 50 50 C50 30, 70 40, 50 50 C60 50, 70 70, 50 50 C50 70, 30 60, 50 50 C40 50, 30 30, 50 50" fill="currentColor" fill-opacity="0.15"/>
        <circle cx="50" cy="50" r="4" fill="#C9A96E"/>
        <path d="M50 54 L50 80 C50 85, 45 90, 40 90" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M50 65 C55 65, 60 60, 62 55" stroke="#C9A96E" stroke-width="1" stroke-linecap="round"/>
      </g>
    </svg>`
  },
  {
    id: 'truck_art_floral',
    name: 'Truck Art Motif',
    category: 'heritage',
    description: 'Earthy, organic interpretation of Pakistani Truck Art floral motifs.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15 C55 35, 85 35, 50 85 C15 35, 45 35, 50 15 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/>
      <circle cx="50" cy="45" r="12" stroke="currentColor" stroke-width="1.5"/>
      <path d="M50 33 L50 57 M38 45 L62 45" stroke="currentColor" stroke-width="1.5"/>
      <path d="M41 36 L59 54 M41 54 L59 36" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
      <circle cx="50" cy="45" r="4" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'karakoram_range',
    name: 'Karakoram Peak',
    category: 'earth',
    description: 'Majestic peaks of the northern region, representing wild sustainable origins.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 75 L38 35 L50 52 L70 25 L88 75 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05" stroke-linejoin="round"/>
      <path d="M38 35 L42 45 L35 50 L45 55" stroke="currentColor" stroke-width="1.5"/>
      <path d="M70 25 L74 38 L65 42 L73 48" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="78" cy="22" r="3" fill="#C9A96E"/>
    </svg>`
  },
  {
    id: 'earth_lotus',
    name: 'Earthy Lotus',
    category: 'earth',
    description: 'Earthy geometric lotus design representing rebirth and organic slow growth.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" stroke-width="1.5" fill="none">
        <path d="M50 80 C30 80, 20 60, 50 25 C80 60, 70 80, 50 80 Z" fill="currentColor" fill-opacity="0.1"/>
        <path d="M50 80 C40 80, 35 70, 50 40 C65 70, 60 80, 50 80 Z"/>
        <path d="M50 80 C45 80, 43 75, 50 55 C57 75, 55 80, 50 80 Z"/>
        <line x1="20" y1="80" x2="80" y2="80" stroke-linecap="round"/>
      </g>
    </svg>`
  },
  {
    id: 'sufi_crescent',
    name: 'Sufi Moon',
    category: 'calligraphy',
    description: 'A deep minimalist crescent combined with linear geometric elements.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 25 C40 25, 30 45, 30 60 C30 75, 45 85, 65 85 C50 80, 42 68, 42 55 C42 42, 50 30, 65 25 Z" fill="currentColor"/>
      <line x1="50" y1="15" x2="50" y2="85" stroke="#C9A96E" stroke-width="1" stroke-dasharray="4 4"/>
      <polygon points="50,42 54,50 62,50 56,55 58,63 50,58 42,63 44,55 38,50 46,50" fill="#C9A96E"/>
    </svg>`
  },
  {
    id: 'indus_seal',
    name: 'Indus Valley Seal',
    category: 'heritage',
    description: 'Inspired by the ancient pottery carvings of Mohenjo-Daro, symbolizing 5000 years of cotton heritage.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="70" rx="4" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05" />
      <path d="M30 35 H70 M30 45 H70 M30 55 H70" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3" />
      <path d="M50 30 C40 50, 40 70, 50 75 C60 70, 60 50, 50 30 Z" stroke="#C9A96E" stroke-width="2" fill="none" />
      <circle cx="50" cy="52.5" r="5" fill="#C9A96E"/>
    </svg>`
  },
  {
    id: 'muhabat_ur',
    name: 'محبت (Muhabbat)',
    category: 'calligraphy',
    description: 'Urdu Nastaliq word "Muhabbat", meaning unconditional Love and harmony.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 40 C35 32, 50 35, 60 30 C70 25, 75 35, 75 45 C75 55, 60 65, 45 65 C35 65, 20 55, 20 45" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="48" cy="72" r="3" fill="currentColor"/>
      <circle cx="58" cy="72" r="3" fill="currentColor"/>
      <text x="50" y="88" text-anchor="middle" font-family="sans-serif" font-size="7" fill="currentColor" font-weight="bold" letter-spacing="1">MUHABBAT / LOVE</text>
    </svg>`
  },
  {
    id: 'sabr_ur',
    name: 'صبر (Sabr)',
    category: 'calligraphy',
    description: 'Urdu Nastaliq word "Sabr", representing Patience and peaceful slow-growth.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 50 C30 35, 50 35, 60 45 C70 55, 80 50, 80 40 M30 50 C40 65, 65 65, 75 50" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="30" r="3" fill="currentColor"/>
      <text x="50" y="88" text-anchor="middle" font-family="sans-serif" font-size="7" fill="currentColor" font-weight="bold" letter-spacing="1">SABR / PATIENCE</text>
    </svg>`
  },
  {
    id: 'lahore_arch',
    name: 'Lahore Fort Arch',
    category: 'heritage',
    description: 'Elegant architectural geometry inspired by the Mughal arches of Lahore Fort.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 80 V50 C25 35, 35 20, 50 20 C65 20, 75 35, 75 50 V80" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05" />
      <path d="M32 80 V50 C32 40, 40 30, 50 30 C60 30, 68 40, 68 50 V80" stroke="currentColor" stroke-width="1.5" />
      <path d="M50 20 L50 10" stroke="#C9A96E" stroke-width="1.5" />
      <circle cx="50" cy="10" r="2.5" fill="#C9A96E" />
      <line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" stroke-width="2" />
    </svg>`
  },
  {
    id: 'cotton_pod',
    name: 'Raw Cotton Pod',
    category: 'earth',
    description: 'A beautiful botanical illustration of a cotton pod, honoring Multan’s cotton pickers.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="42" cy="45" r="16" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="58" cy="45" r="16" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="50" cy="35" r="14" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.5"/>
      <path d="M50 55 L50 80 C50 82, 48 85, 45 85" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M30 52 C35 58, 45 60, 50 55 C55 60, 65 58, 70 52 C70 52, 50 72, 30 52 Z" fill="#C9A96E" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'peacock_feather',
    name: 'Peacock plume',
    category: 'earth',
    description: 'Mystical bird plume, representing Punjab’s vibrant natural ecology.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 85 C50 85, 50 45, 50 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 45 C35 40, 30 25, 50 15 C70 25, 65 40, 50 45 Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="50" cy="26" rx="10" ry="8" fill="#C9A96E" fill-opacity="0.5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="50" cy="26" r="4" fill="currentColor" />
      <path d="M50 55 C40 54, 35 48, 30 44 M50 65 C38 64, 32 58, 25 52 M50 75 C40 74, 35 68, 28 62" stroke="currentColor" stroke-width="1"/>
      <path d="M50 55 C60 54, 65 48, 70 44 M50 65 C62 64, 68 58, 75 52 M50 75 C60 74, 65 68, 72 62" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'circular_logo',
    name: 'Circular Future',
    category: 'logo',
    description: 'Dual arrows rotating in infinite loops, denoting fully recyclable garments.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="2.5" stroke-dasharray="12 12"/>
      <path d="M50 18 C68 18, 82 32, 82 50 C82 58, 79 66, 73 72" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M50 82 C32 82, 18 68, 18 50 C18 42, 21 34, 27 28" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
      <polygon points="73,72 65,72 73,64" fill="currentColor" stroke="currentColor" stroke-width="1"/>
      <polygon points="27,28 35,28 27,36" fill="currentColor" stroke="currentColor" stroke-width="1"/>
      <circle cx="50" cy="50" r="10" stroke="#C9A96E" stroke-width="1.5" fill="none"/>
    </svg>`
  },
  {
    id: 'faisal_star',
    name: 'Faisal Octagram',
    category: 'heritage',
    description: 'Symmetrical geometric star from the iconic sloped roofs of Faisal Mosque.',
    imageUrl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" stroke-width="2" fill="none">
        <rect x="25" y="25" width="50" height="50" transform="rotate(0 50 50)" fill="currentColor" fill-opacity="0.05"/>
        <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" fill="currentColor" fill-opacity="0.05"/>
        <circle cx="50" cy="50" r="12" stroke="#C9A96E" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="4" fill="#C9A96E"/>
        <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" stroke="#C9A96E" stroke-width="1"/>
      </g>
    </svg>`
  }
];

export const GARMENT_STYLE_DETAILS = {
  hoodie_oversized: {
    name: 'Oversized Hoodie',
    price: 8999,
    description: 'Heavyweight organic cotton loopback, relaxed drop shoulders, double-lined hood without drawcords for a clean, sustainable look.',
    delivery: '7-10 days'
  },
  tshirt_classic: {
    name: 'Classic T-Shirt',
    price: 3999,
    description: 'Mediumweight premium single-jersey cotton, ribbed crewneck, clean seams. Pre-shrunk for the perfect long-lasting fit.',
    delivery: '5-7 days'
  },
  hoodie_relaxed: {
    name: 'Relaxed Fit Hoodie',
    price: 8499,
    description: 'Mediumweight brushed fleece, streamlined tailoring, subtle side-slit pockets. Cozy, sleek, and perfect for light layering.',
    delivery: '7-10 days'
  }
};

export const FABRIC_DETAILS = {
  organic_cotton: {
    name: 'Organic Cotton (GOTS Certified)',
    description: '100% pesticide-free cotton sourced locally from Multan. Soft, breathable, and supports clean farming soils.',
    sustainabilityLabel: 'Zero Chemicals • Save 91% Water',
    swatchColor: '#E6DFD3' // Warm raw cotton
  },
  recycled_poly: {
    name: 'Recycled Polyester Blend',
    description: 'Upcycled marine plastic fibers woven with combed organic cotton. Sturdy, moisture-wicking, and high-performance circularity.',
    sustainabilityLabel: 'Diverts Plastic • Highly Durable',
    swatchColor: '#C4C9C1' // Grayish sage
  },
  bamboo_blend: {
    name: 'Bamboo Linen Blend',
    description: 'Premium natural bamboo viscose and premium linen. Cool to the touch, natural anti-bacterial properties, beautiful raw drape.',
    sustainabilityLabel: 'Ultra-Fast Growth • Biodegradable',
    swatchColor: '#D3CEBE' // Dusty beige-gold
  }
};

export const COLOR_DETAILS = {
  sand_beige: {
    name: 'Sand Beige',
    hex: '#D9D2C5',
    description: 'A warm, grounded, unbleached sandy hue.'
  },
  cream_white: {
    name: 'Cream White',
    hex: '#F2EFE9',
    description: 'Rich, comforting off-white resembling clean wool.'
  },
  deep_crimson: {
    name: 'Deep Crimson',
    hex: '#7A1C1C',
    description: 'The iconic signature ORIGINN burgundy.'
  },
  earth_brown: {
    name: 'Earth Brown',
    hex: '#3E2F26',
    description: 'Dark, grounding soil brown.'
  },
  olive_green: {
    name: 'Olive Green',
    hex: '#515846',
    description: 'Muted forest sage green reflecting organic foliage.'
  }
};

export const THREAD_COLORS = [
  { name: 'Heritage Gold', hex: '#C9A96E' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Crimson Burgundy', hex: '#8B0000' },
  { name: 'Charcoal Black', hex: '#1E1E1E' },
  { name: 'Olive Drab', hex: '#4A533C' },
  { name: 'Earth Clay', hex: '#A3684B' }
];

export const WHY_ORIGINN_CARDS = [
  {
    icon: 'AlertTriangle',
    title: 'Overproduction',
    description: 'Fast fashion dumps 92 million tons of garments into landfills every year. ORIGINN only produces what you custom-design—saving invaluable resources.'
  },
  {
    icon: 'Droplet',
    title: 'Water Pollution',
    description: 'Traditional dyeing processes toxicify global water tables. We utilize certified closed-loop, waterless dyeing mechanisms for zero toxic runoffs.'
  },
  {
    icon: 'Fingerprint',
    title: 'Impersonalization',
    description: 'Mass retail treats you like a clone. We empower you to wear garments that act as blank canvases for your exact words, stories, and placements.'
  },
  {
    icon: 'BadgePercent',
    title: 'Over Pricing',
    description: 'Middlemen and global logistics artificially inflate prices. We produce completely locally in Pakistan, offering premium slow-fashion at fair local rates.'
  }
];

export const OUR_OBJECTIVES = [
  {
    num: '01',
    title: 'Promote Individualism',
    description: 'We reject cookie-cutter styling. Every hoodie or t-shirt acts as an extension of your mind, text, and selected regional art placements.'
  },
  {
    num: '02',
    title: 'Reduce Textile Waste',
    description: 'By upcycling left-over export fabrics into creative custom patches and employing zero-inventory models, we design out waste entirely.'
  },
  {
    num: '03',
    title: 'Budget-Friendly slow fashion',
    description: 'Premium organic clothing should not be a luxury restricted to the elite. Local sourcing keeps high-grade cotton affordable inside Pakistan.'
  },
  {
    num: '04',
    title: 'Strong Sustainable Brand Identity',
    description: 'Proving that Pakistan can pioneer premium, high-aesthetic sustainable products, empowering local textile artisans with ethical living wages.'
  }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'oversized-hoodie-beige',
    name: 'Oversized Hoodie',
    style: 'hoodie_oversized',
    fabric: 'organic_cotton',
    color: 'sand_beige',
    price: 8999,
    description: 'Heavyweight loopback organic cotton. Beautiful, slouchy oversized cut with dropped shoulders. Perfect for everyday sustainable style.',
    imageFront: 'hoodie_oversized',
    imageBack: 'hoodie_oversized',
    rating: 4.9,
    reviewsCount: 124
  },
  {
    id: 'classic-tshirt-cream',
    name: 'Classic T-Shirt',
    style: 'tshirt_classic',
    fabric: 'organic_cotton',
    color: 'cream_white',
    price: 3999,
    description: 'Mediumweight raw combed organic cotton. Extremely soft touch with clean tailored shoulders. Designed to be your lifetime favorite tee.',
    imageFront: 'tshirt_classic',
    imageBack: 'tshirt_classic',
    rating: 4.8,
    reviewsCount: 88
  },
  {
    id: 'relaxed-hoodie-crimson',
    name: 'Relaxed Fit Hoodie',
    style: 'hoodie_relaxed',
    fabric: 'organic_cotton',
    color: 'deep_crimson',
    price: 8499,
    description: 'Tailored relaxed cut in our signature ORIGINN deep crimson. Brushed fleece interior for ultimate thermal comfort and a modern silhouette.',
    imageFront: 'hoodie_relaxed',
    imageBack: 'hoodie_relaxed',
    rating: 5.0,
    reviewsCount: 42
  },
  {
    id: 'oversized-hoodie-brown',
    name: 'Earth-Tuned Oversized Hoodie',
    style: 'hoodie_oversized',
    fabric: 'bamboo_blend',
    color: 'earth_brown',
    price: 9499,
    description: 'Luxurious heavy bamboo-cotton blend in grounding soil brown. Highly breathable and naturally antimicrobial.',
    imageFront: 'hoodie_oversized',
    imageBack: 'hoodie_oversized',
    rating: 4.9,
    reviewsCount: 56
  }
];
