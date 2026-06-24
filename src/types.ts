/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GarmentStyle = 'hoodie_oversized' | 'tshirt_classic' | 'hoodie_relaxed';
export type FabricType = 'organic_cotton' | 'recycled_poly' | 'bamboo_blend';
export type GarmentColor = 'sand_beige' | 'cream_white' | 'deep_crimson' | 'earth_brown' | 'olive_green';
export type GarmentView = 'front' | 'back' | 'left_sleeve' | 'right_sleeve' | 'cap';

export interface PresetPatch {
  id: string;
  name: string;
  imageUrl: string;
  category: 'logo' | 'earth' | 'heritage' | 'calligraphy';
  description?: string;
}

export interface CustomPatch {
  id: string;
  name: string;
  imageSrc: string;
  view: GarmentView;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  scale: number; // 0.5 to 2.0
  rotation: number; // 0 to 360 degrees
  isCustomUpload?: boolean;
}

export interface CustomizationState {
  id: string;
  style: GarmentStyle;
  fabric: FabricType;
  color: GarmentColor;
  patches: CustomPatch[];
  customText: string;
  textLanguage: 'en' | 'ur';
  threadColor: string; // hex code
  threadColorName: string;
  textView: GarmentView;
  textX: number; // 0 to 100 percentage
  textY: number; // 0 to 100 percentage
  textScale: number; // 0.5 to 2.0
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  price: number;
}

export interface Product {
  id: string;
  name: string;
  style: GarmentStyle;
  fabric: FabricType;
  color: GarmentColor;
  price: number;
  description: string;
  imageFront: string;
  imageBack: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string;
  product?: Product;
  customization?: CustomizationState;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: 'cod' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed';
}
