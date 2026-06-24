/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GarmentStyle,
  FabricType,
  GarmentColor,
  GarmentView,
  CustomPatch
} from '../types';
import {
  GARMENT_STYLE_DETAILS,
  FABRIC_DETAILS,
  COLOR_DETAILS,
  THREAD_COLORS,
  PRESET_PATCHES
} from '../data';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  Info,
  Layers,
  Leaf,
  PenTool,
  ShoppingBag,
  Type
} from 'lucide-react';
import { motion } from 'motion/react';

interface CustomizeStepsProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  style: GarmentStyle;
  setStyle: (style: GarmentStyle) => void;
  fabric: FabricType;
  setFabric: (fabric: FabricType) => void;
  color: GarmentColor;
  setColor: (color: GarmentColor) => void;
  view: GarmentView;
  setView: (view: GarmentView) => void;
  patches: CustomPatch[];
  setPatches: React.Dispatch<React.SetStateAction<CustomPatch[]>>;
  selectedPatchId: string | null;
  setSelectedPatchId: (id: string | null) => void;
  customText: string;
  setCustomText: (text: string) => void;
  textLanguage: 'en' | 'ur';
  setTextLanguage: (lang: 'en' | 'ur') => void;
  threadColor: string;
  setThreadColor: (color: string) => void;
  threadColorName: string;
  setThreadColorName: (name: string) => void;
  textView: GarmentView;
  setTextView: (view: GarmentView) => void;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  setSize: (size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onAddToCart: () => void;
  totalPrice: number;
}

export default function CustomizeSteps({
  currentStep,
  setCurrentStep,
  style,
  setStyle,
  fabric,
  setFabric,
  color,
  setColor,
  view,
  setView,
  patches,
  setPatches,
  selectedPatchId,
  setSelectedPatchId,
  customText,
  setCustomText,
  textLanguage,
  setTextLanguage,
  threadColor,
  setThreadColor,
  threadColorName,
  setThreadColorName,
  textView,
  setTextView,
  size,
  setSize,
  onAddToCart,
  totalPrice
}: CustomizeStepsProps) {
  const [customPatchFile, setCustomPatchFile] = useState<File | null>(null);
  const [customPatchName, setCustomPatchName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const steps = [
    { num: 1, name: 'STYLE', label: 'Silhouettes', icon: Layers },
    { num: 2, name: 'FABRIC', label: 'Raw Materials', icon: Leaf },
    { num: 3, name: 'DESIGN', label: 'Art Patches', icon: Sparkles },
    { num: 4, name: 'DETAILS', label: 'Embroidery', icon: Type },
    { num: 5, name: 'PREVIEW', label: 'Order Summary', icon: Check }
  ];

  // Handle Preset Patch Selection
  const handleSelectPresetPatch = (presetId: string) => {
    if (patches.length >= 7) {
      alert('You can add up to 7 patches maximum to preserve slow-fashion balance.');
      return;
    }

    const preset = PRESET_PATCHES.find(p => p.id === presetId);
    if (!preset) return;

    const newPatch: CustomPatch = {
      id: `patch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: preset.name,
      imageSrc: preset.imageUrl,
      view: view, // Place on active view
      x: 50, // Center X
      y: 40, // Center Y
      scale: 1.0,
      rotation: 0
    };

    setPatches([...patches, newPatch]);
    setSelectedPatchId(newPatch.id);
  };

  // Handle Custom Patch Image Upload
  const handleCustomPatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, SVG).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Image size should be less than 3MB for clean loading.');
      return;
    }

    setCustomPatchFile(file);
    setCustomPatchName(file.name.split('.')[0].substring(0, 15));
  };

  const handleAddCustomUploadedPatch = () => {
    if (patches.length >= 7) {
      setUploadError('You can add up to 7 patches maximum.');
      return;
    }

    if (!customPatchFile) {
      setUploadError('Please select an image first.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newPatch: CustomPatch = {
        id: `patch-custom-${Date.now()}`,
        name: customPatchName.trim() || 'Custom Patch',
        // Wrapping custom base64 image inside an SVG with rounded bounds so it renders nicely in our CustomizePreview svg layout
        imageSrc: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <clipPath id="circle-clip">
            <circle cx="50" cy="50" r="46"/>
          </clipPath>
          <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <image href="${base64String}" x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid slice" clip-path="url(#circle-clip)"/>
        </svg>`,
        view: view,
        x: 50,
        y: 45,
        scale: 1.2,
        rotation: 0,
        isCustomUpload: true
      };

      setPatches([...patches, newPatch]);
      setSelectedPatchId(newPatch.id);
      setCustomPatchFile(null);
      setCustomPatchName('');
    };

    reader.readAsDataURL(customPatchFile);
  };

  return (
    <div id="customize-steps-panel" className="bg-[#F5F0E8] rounded-2xl border border-[#3B2314]/10 p-5 md:p-6 flex flex-col h-full">
      
      {/* Step Tabs Indicator */}
      <div id="steps-progress-header" className="flex flex-wrap gap-2 border-b border-[#3B2314]/10 pb-4 mb-6">
        {steps.map((s) => {
          const isActive = s.num === currentStep;
          return (
            <button
              key={s.num}
              id={`step-tab-${s.num}`}
              onClick={() => setCurrentStep(s.num)}
              className={`step-pill ${isActive ? 'active' : ''} focus:outline-none text-[10px] sm:text-xs py-1.5 px-3.5`}
            >
              0{s.num} {s.label}
            </button>
          );
        })}
      </div>

      {/* Steps Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h4 className="font-serif text-lg font-bold text-[#3B2314]">Choose Your Silhouette</h4>
              <p className="font-sans text-xs text-[#3B2314]/60">Select the base garment to start wearing your story.</p>
            </div>

            {/* Garment Choices */}
            <div id="garment-choices" className="space-y-3">
              {(Object.keys(GARMENT_STYLE_DETAILS) as GarmentStyle[]).map((styleId) => {
                const detail = GARMENT_STYLE_DETAILS[styleId];
                const isSelected = style === styleId;
                return (
                  <button
                    key={styleId}
                    id={`silhouette-${styleId}`}
                    onClick={() => setStyle(styleId)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex justify-between items-center ${
                      isSelected
                        ? 'bg-white border-[#8B0000] shadow-sm'
                        : 'bg-white/50 border-[#3B2314]/10 hover:border-[#3B2314]/30 hover:bg-white'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <span className="font-serif text-sm font-semibold text-[#3B2314] flex items-center gap-1.5">
                        {detail.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />}
                      </span>
                      <p className="font-sans text-[11px] text-[#3B2314]/70 leading-relaxed">
                        {detail.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-[#8B0000] text-xs sm:text-sm whitespace-nowrap">
                        PKR {detail.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Earth Toned Color Palette */}
            <div className="pt-4 border-t border-[#3B2314]/5">
              <h5 className="font-serif text-xs font-semibold text-[#3B2314] mb-3 uppercase tracking-wider">
                Select Botanical Colorway
              </h5>
              <div id="color-palette" className="grid grid-cols-5 gap-3">
                {(Object.keys(COLOR_DETAILS) as GarmentColor[]).map((colId) => {
                  const detail = COLOR_DETAILS[colId];
                  const isSelected = color === colId;
                  return (
                    <button
                      key={colId}
                      id={`color-${colId}`}
                      onClick={() => setColor(colId)}
                      className="flex flex-col items-center group focus:outline-none"
                    >
                      <div
                        className={`w-10 h-10 rounded-full border shadow-inner transition-all duration-300 relative ${
                          isSelected
                            ? 'ring-2 ring-[#8B0000] ring-offset-2 scale-105'
                            : 'border-[#3B2314]/10 hover:scale-105'
                        }`}
                        style={{ backgroundColor: detail.hex }}
                        title={detail.name}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-sans text-[#3B2314]/70 mt-1.5 text-center group-hover:text-[#3B2314] font-medium truncate w-full">
                        {detail.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h4 className="font-serif text-lg font-bold text-[#3B2314]">Select Raw Material</h4>
              <p className="font-sans text-xs text-[#3B2314]/60">Purely sustainable textiles dyed with waterless closed-loop cycles.</p>
            </div>

            {/* Fabric Choices */}
            <div id="fabric-choices" className="space-y-3.5">
              {(Object.keys(FABRIC_DETAILS) as FabricType[]).map((fabricId) => {
                const detail = FABRIC_DETAILS[fabricId];
                const isSelected = fabric === fabricId;
                return (
                  <button
                    key={fabricId}
                    id={`fabric-${fabricId}`}
                    onClick={() => setFabric(fabricId)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-white border-[#8B0000] shadow-sm'
                        : 'bg-white/50 border-[#3B2314]/10 hover:border-[#3B2314]/30 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-sm font-semibold text-[#3B2314] flex items-center gap-1.5">
                        {detail.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-sans font-bold text-[#C9A96E] bg-[#3B2314] px-2 py-0.5 rounded">
                        {detail.sustainabilityLabel}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-[#3B2314]/70 leading-relaxed mb-3">
                      {detail.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans text-[#3B2314]/50">Texture Swatch:</span>
                      <div className="w-5 h-5 rounded border border-[#3B2314]/10" style={{ backgroundColor: detail.swatchColor }} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#3B2314]/5 rounded-xl flex gap-2 border border-[#3B2314]/10">
              <Info className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
              <p className="font-sans text-[10px] text-[#3B2314]/80 leading-relaxed">
                <strong>Why the texture swatches look solid?</strong> To ensure extreme longevity, we dye yarn fibers organically before weaving, preventing the color shedding found in fast-fashion items.
              </p>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h4 className="font-serif text-lg font-bold text-[#3B2314]">Heritage Art Patches</h4>
              <p className="font-sans text-xs text-[#3B2314]/60">Select custom artisan patches or upload your own sketch (max 7).</p>
            </div>

            {/* Preset Patches List */}
            <div className="glass-card p-5 border border-[#3B2314]/15 shadow-sm">
              <label className="text-[10px] uppercase font-bold tracking-widest block mb-4 text-[#3B2314]/80">
                Origin Patch Library (+ PKR 499 each)
              </label>
              <div id="art-patches-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_PATCHES.map((patch) => {
                  return (
                    <button
                      key={patch.id}
                      id={`preset-patch-${patch.id}`}
                      onClick={() => handleSelectPresetPatch(patch.id)}
                      className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-[#3B2314]/10 hover:border-[#8B0000] transition-all flex flex-col items-center group text-center"
                    >
                      <div
                        className="w-11 h-11 text-[#3B2314]/80 group-hover:text-[#8B0000] transition-colors mb-2 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: patch.imageUrl }}
                      />
                      <span className="text-[10px] font-serif font-semibold text-[#3B2314] line-clamp-1">
                        {patch.name}
                      </span>
                      <span className="text-[8px] font-sans text-[#3B2314]/50 mt-0.5 capitalize">
                        {patch.category} Art
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] mt-4 text-[#3B2314]/65 leading-relaxed">
                Up to 7 custom patches. Drag to position on the garment preview. We use premium upcycled materials for all embroidery.
              </p>
            </div>

            {/* Custom Image Uploader */}
            <div className="pt-4 border-t border-[#3B2314]/5 space-y-3">
              <h5 className="font-serif text-xs font-semibold text-[#3B2314] uppercase tracking-wider">
                Upload Your Own Image Patch (+ PKR 499)
              </h5>
              <div className="bg-white p-4 rounded-xl border border-dashed border-[#3B2314]/25 flex flex-col items-center text-center">
                <Upload className="w-6 h-6 text-[#C9A96E] mb-2" />
                <label className="cursor-pointer bg-[#3B2314] text-[#F5F0E8] font-sans text-[10px] uppercase tracking-widest font-bold py-2 px-4 rounded hover:bg-[#8B0000] transition-colors focus:outline-none mb-1">
                  Choose Image File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomPatchUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[9px] font-sans text-[#3B2314]/50 leading-relaxed">
                  Supports JPG, PNG, or SVG up to 3MB. Keep it transparent for perfect emblem looks!
                </p>

                {customPatchFile && (
                  <div className="mt-4 p-2 bg-[#F5F0E8] rounded-lg border border-[#C9A96E]/20 w-full flex flex-col items-center">
                    <span className="text-[10px] font-sans text-[#3B2314]/70 mb-2 truncate max-w-full">
                      Selected: <strong>{customPatchFile.name}</strong>
                    </span>
                    <input
                      type="text"
                      placeholder="Give patch a name"
                      value={customPatchName}
                      onChange={(e) => setCustomPatchName(e.target.value)}
                      className="w-full bg-white border border-[#3B2314]/15 rounded py-1.5 px-2.5 text-[10px] font-sans mb-2 focus:outline-none focus:border-[#C9A96E]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUploadedPatch}
                      className="bg-[#C9A96E] text-[#3B2314] font-sans text-[10px] uppercase tracking-wider font-bold py-1.5 px-4 rounded w-full hover:bg-[#8B0000] hover:text-white transition-colors"
                    >
                      Place Uploaded Patch
                    </button>
                  </div>
                )}

                {uploadError && (
                  <p className="text-[#8B0000] text-[9px] font-sans mt-2">{uploadError}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h4 className="font-serif text-lg font-bold text-[#3B2314]">Custom Embroidery details</h4>
              <p className="font-sans text-xs text-[#3B2314]/60">Define your custom textual narrative in English or Urdu (+ PKR 199).</p>
            </div>

            {/* Custom text uploader and selectors */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-[#3B2314] uppercase tracking-wider mb-1.5">
                  Your Signature Text
                </label>
                <input
                  type="text"
                  maxLength={25}
                  placeholder={textLanguage === 'ur' ? 'یہاں اردو لکھیں' : 'e.g. PEACE'}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-white border border-[#3B2314]/15 rounded-xl py-2.5 px-3.5 text-xs font-sans focus:outline-none focus:border-[#8B0000]"
                />
                <span className="text-[9px] font-sans text-[#3B2314]/40 mt-1 block">
                  Limit: 25 characters. Supports Urdu & English.
                </span>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-[11px] font-sans font-bold text-[#3B2314] uppercase tracking-wider mb-1.5">
                  Lettering Script
                </label>
                <div id="lang-switch" className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTextLanguage('en')}
                    className={`py-2 px-3 rounded-lg border text-xs font-sans font-semibold transition-colors focus:outline-none ${
                      textLanguage === 'en'
                        ? 'bg-[#3B2314] text-[#F5F0E8] border-[#3B2314]'
                        : 'bg-white text-[#3B2314]/70 border-[#3B2314]/10 hover:bg-gray-50'
                    }`}
                  >
                    Latin / English
                  </button>
                  <button
                    onClick={() => setTextLanguage('ur')}
                    className={`py-2 px-3 rounded-lg border text-xs font-serif font-semibold transition-colors focus:outline-none ${
                      textLanguage === 'ur'
                        ? 'bg-[#3B2314] text-[#F5F0E8] border-[#3B2314]'
                        : 'bg-white text-[#3B2314]/70 border-[#3B2314]/10 hover:bg-gray-50'
                    }`}
                  >
                    اردو / Nastaliq
                  </button>
                </div>
              </div>

              {/* Text placement zone */}
              <div>
                <label className="block text-[11px] font-sans font-bold text-[#3B2314] uppercase tracking-wider mb-1.5">
                  Embroidery View Zone
                </label>
                <select
                  value={textView}
                  onChange={(e) => setTextView(e.target.value as GarmentView)}
                  className="w-full bg-white border border-[#3B2314]/15 rounded-lg py-2 px-3 text-xs font-sans focus:outline-none focus:border-[#8B0000]"
                >
                  <option value="front">Front Chest</option>
                  <option value="back">Back Panel</option>
                  <option value="left_sleeve">Left Sleeve</option>
                  <option value="right_sleeve">Right Sleeve</option>
                  {style.includes('hoodie') && <option value="cap">Hoodie Cap</option>}
                </select>
              </div>

              {/* Thread color selection */}
              <div>
                <label className="block text-[11px] font-sans font-bold text-[#3B2314] uppercase tracking-wider mb-2">
                  Embroidery Thread Color
                </label>
                <div id="thread-colors" className="grid grid-cols-3 gap-2">
                  {THREAD_COLORS.map((tc) => {
                    const isSelected = threadColor === tc.hex;
                    return (
                      <button
                        key={tc.name}
                        onClick={() => {
                          setThreadColor(tc.hex);
                          setThreadColorName(tc.name);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-[10px] font-sans transition-colors ${
                          isSelected
                            ? 'bg-white border-[#8B0000] font-bold'
                            : 'bg-white/50 border-[#3B2314]/10 hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm shrink-0"
                          style={{ backgroundColor: tc.hex }}
                        />
                        <span className="truncate">{tc.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h4 className="font-serif text-lg font-bold text-[#3B2314]">Final Summary</h4>
              <p className="font-sans text-xs text-[#3B2314]/60">Review your customized details and choose size.</p>
            </div>

            {/* Sizes Selection */}
            <div>
              <label className="block text-[11px] font-sans font-bold text-[#3B2314] uppercase tracking-wider mb-2">
                Select Your Size
              </label>
              <div id="sizes-row" className="flex gap-2">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                  const isSelected = size === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSize(sz)}
                      className={`w-10 h-10 rounded-lg border font-sans text-xs font-semibold flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#3B2314] text-[#F5F0E8] border-[#3B2314] scale-105 shadow-sm'
                          : 'bg-white text-[#3B2314]/80 border-[#3B2314]/15 hover:bg-gray-50'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              <span className="text-[9px] font-sans text-[#3B2314]/40 mt-1 block">
                Fits true to South Asian sizes. Oversized items offer a spacious drape.
              </span>
            </div>

            {/* Design Spec Breakdown Card */}
            <div id="summary-spec-card" className="bg-white p-4 rounded-xl border border-[#3B2314]/10 space-y-3 font-sans text-xs text-[#3B2314]">
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Silhouette Style</span>
                <span className="capitalize">{GARMENT_STYLE_DETAILS[style]?.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Raw Fabric</span>
                <span>{FABRIC_DETAILS[fabric]?.name.split(' (')[0]}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Color Shade</span>
                <span>{COLOR_DETAILS[color]?.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Patches Included</span>
                <span>{patches.length > 0 ? `${patches.length} Patches (+PKR ${(patches.length * 499).toLocaleString()})` : 'None'}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Embroidery Detail</span>
                <span>{customText.trim() ? `"${customText}" (+PKR 199)` : 'None'}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Selected Size</span>
                <span className="font-bold">{size}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B2314]/5 pb-2">
                <span className="font-semibold">Production Origin</span>
                <span>Multan & Lahore, PK</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-serif font-bold text-sm text-[#3B2314]">Estimated Delivery</span>
                <span className="text-[#C9A96E] font-bold text-xs">7–10 Days (Free Shipping)</span>
              </div>
            </div>

            {/* Sustainability Badge Clusters */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-[10px] font-sans text-[#31572C] bg-[#ECF3EC] p-2.5 rounded-lg border border-[#31572C]/10">
                <Leaf className="w-4 h-4 shrink-0 text-[#31572C]" />
                <span><strong>Sustainable Choice</strong> — Made with organic materials and waterless dye certified.</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-sans text-[#3B2314] bg-[#F5F0E8] p-2.5 rounded-lg border border-[#C9A96E]/20">
                <PenTool className="w-4 h-4 shrink-0 text-[#C9A96E]" />
                <span><strong>Made Just For You</strong> — Cut and sewn only upon your order to completely prevent landfill overproduction.</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-sans text-[#8B0000] bg-red-50 p-2.5 rounded-lg border border-red-200">
                <Sparkles className="w-4 h-4 shrink-0 text-[#8B0000]" />
                <span><strong>Wear Your Story</strong> — Individually tailored item defining slow-fashion culture in Pakistan.</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Navigation Bar for Customizer Steps */}
      <div id="steps-footer-nav" className="mt-6 pt-4 border-t border-[#3B2314]/10 flex justify-between items-center bg-[#F5F0E8]">
        {currentStep > 1 ? (
          <button
            id="prev-step-btn"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#3B2314]/20 rounded-lg text-xs font-sans font-semibold text-[#3B2314] hover:bg-white transition-colors focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            id="next-step-btn"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#3B2314] text-[#F5F0E8] rounded-lg text-xs font-sans font-semibold hover:bg-[#8B0000] transition-colors focus:outline-none"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="add-to-cart-customizer-btn"
            onClick={onAddToCart}
            className="flex items-center gap-2 px-6 py-3 bg-[#8B0000] text-white rounded-lg text-xs uppercase tracking-widest font-sans font-bold hover:bg-[#7A1C1C] transition-colors shadow focus:outline-none"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Bag • PKR {totalPrice.toLocaleString()}
          </button>
        )}
      </div>

    </div>
  );
}
