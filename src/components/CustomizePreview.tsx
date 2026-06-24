/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { GarmentStyle, GarmentColor, GarmentView, CustomPatch } from '../types';
import { COLOR_DETAILS } from '../data';
import { Sparkles, Trash2, Maximize, Move, RotateCw, AlertCircle, Box, Orbit, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomizePreviewProps {
  style: GarmentStyle;
  color: GarmentColor;
  view: GarmentView;
  setView: (view: GarmentView) => void;
  patches: CustomPatch[];
  setPatches: React.Dispatch<React.SetStateAction<CustomPatch[]>>;
  selectedPatchId: string | null;
  setSelectedPatchId: (id: string | null) => void;
  customText: string;
  textLanguage: 'en' | 'ur';
  threadColor: string;
  threadColorName: string;
  textView: GarmentView;
  setTextView: (view: GarmentView) => void;
  textX: number;
  textY: number;
  textScale: number;
  setTextX: (x: number) => void;
  setTextY: (y: number) => void;
  setTextScale: (scale: number) => void;
  isTextSelected: boolean;
  setIsTextSelected: (selected: boolean) => void;
}

export default function CustomizePreview({
  style,
  color,
  view,
  setView,
  patches,
  setPatches,
  selectedPatchId,
  setSelectedPatchId,
  customText,
  textLanguage,
  threadColor,
  threadColorName,
  textView,
  setTextView,
  textX,
  textY,
  textScale,
  setTextX,
  setTextY,
  setTextScale,
  isTextSelected,
  setIsTextSelected
}: CustomizePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'patch' | 'text' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });

  // 3D Preview State variables
  const [is3D, setIs3D] = useState(false);
  const [yaw3D, setYaw3D] = useState(15); // starter angle to show 3D perspective depth on toggle
  const [pitch3D, setPitch3D] = useState(8);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [perspectiveOrigin, setPerspectiveOrigin] = useState({ x: 50, y: 50 });
  const [renderMode, setRenderMode] = useState<'real' | 'vector'>('real');

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Smoothly limit the origin range to 15% to 85% to keep the transform stylish but dynamic
    const boundedX = Math.max(15, Math.min(85, x));
    const boundedY = Math.max(15, Math.min(85, y));
    setPerspectiveOrigin({ x: boundedX, y: boundedY });
    
    // Subtle parallax tilt offset based on mouse position
    if (!isDragging && !isAutoRotating) {
      const targetYaw = 15 + ((x - 50) / 50) * 25; // base of 15, dynamic offset of -25 to +25
      const targetPitch = 8 - ((y - 50) / 50) * 20; // base of 8, dynamic offset of -20 to +20
      setYaw3D(targetYaw);
      setPitch3D(targetPitch);
    }
  };

  const handleContainerMouseLeave = () => {
    if (!is3D) return;
    setPerspectiveOrigin({ x: 50, y: 50 });
    if (!isDragging && !isAutoRotating) {
      setYaw3D(15);
      setPitch3D(8);
    }
  };

  useEffect(() => {
    let animId: number;
    if (is3D && isAutoRotating) {
      const tick = () => {
        setYaw3D((y) => (y + 1) % 360);
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [is3D, isAutoRotating]);

  const activeColorHex = COLOR_DETAILS[color]?.hex || '#D9D2C5';
  const isHoodie = style.includes('hoodie');

  // Filter views depending on style (T-shirt doesn't have a Cap view)
  const availableViews: { id: GarmentView; label: string }[] = [
    { id: 'front', label: 'Front' },
    { id: 'back', label: 'Back' },
    { id: 'left_sleeve', label: 'Left Sleeve' },
    { id: 'right_sleeve', label: 'Right Sleeve' },
    ...(isHoodie ? [{ id: 'cap', label: 'Cap/Hood' } as { id: GarmentView; label: string }] : [])
  ];

  // Adjust view if t-shirt is selected but view was set to cap
  useEffect(() => {
    if (!isHoodie && view === 'cap') {
      setView('front');
    }
  }, [style, isHoodie, view, setView]);

  // Handle deleting active patch
  const handleDeleteSelectedPatch = () => {
    if (selectedPatchId) {
      setPatches(patches.filter(p => p.id !== selectedPatchId));
      setSelectedPatchId(null);
    }
  };

  // Drag Handlers for interactive placement
  const handleMouseDown = (e: React.MouseEvent, type: 'patch' | 'text', id?: string) => {
    e.stopPropagation();
    setIsTextSelected(type === 'text');
    if (type === 'patch' && id) {
      setSelectedPatchId(id);
    } else {
      setSelectedPatchId(null);
    }

    setIsDragging(true);
    setDragType(type);
    
    // Get start click coordinates
    setStartPos({ x: e.clientX, y: e.clientY });

    // Store starting position of the item
    if (type === 'patch' && id) {
      const p = patches.find(patch => patch.id === id);
      if (p) setStartCoords({ x: p.x, y: p.y });
    } else if (type === 'text') {
      setStartCoords({ x: textX, y: textY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    // Convert pixel delta to percentage of container width/height
    const pctDeltaX = (deltaX / rect.width) * 100;
    const pctDeltaY = (deltaY / rect.height) * 100;

    // Constrain percentages to keep patches inside the container bounds safely (10% to 90%)
    const newX = Math.max(10, Math.min(90, Math.round((startCoords.x + pctDeltaX) * 10) / 10));
    const newY = Math.max(10, Math.min(90, Math.round((startCoords.y + pctDeltaY) * 10) / 10));

    if (dragType === 'patch' && selectedPatchId) {
      setPatches(prev =>
        prev.map(p => (p.id === selectedPatchId ? { ...p, x: newX, y: newY } : p))
      );
    } else if (dragType === 'text') {
      setTextX(newX);
      setTextY(newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  // Touch Handlers for Mobile responsiveness
  const handleTouchStart = (e: React.TouchEvent, type: 'patch' | 'text', id?: string) => {
    e.stopPropagation();
    setIsTextSelected(type === 'text');
    if (type === 'patch' && id) {
      setSelectedPatchId(id);
    } else {
      setSelectedPatchId(null);
    }

    setIsDragging(true);
    setDragType(type);
    
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });

    if (type === 'patch' && id) {
      const p = patches.find(patch => patch.id === id);
      if (p) setStartCoords({ x: p.x, y: p.y });
    } else if (type === 'text') {
      setStartCoords({ x: textX, y: textY });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    const pctDeltaX = (deltaX / rect.width) * 100;
    const pctDeltaY = (deltaY / rect.height) * 100;

    const newX = Math.max(10, Math.min(90, Math.round((startCoords.x + pctDeltaX) * 10) / 10));
    const newY = Math.max(10, Math.min(90, Math.round((startCoords.y + pctDeltaY) * 10) / 10));

    if (dragType === 'patch' && selectedPatchId) {
      setPatches(prev =>
        prev.map(p => (p.id === selectedPatchId ? { ...p, x: newX, y: newY } : p))
      );
    } else if (dragType === 'text') {
      setTextX(newX);
      setTextY(newY);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, selectedPatchId, dragType, startPos, startCoords]);

  // Adjust parameters of selected patch using sliders
  const handleUpdateSelectedPatch = (field: 'scale' | 'rotation', val: number) => {
    if (selectedPatchId) {
      setPatches(prev =>
        prev.map(p => (p.id === selectedPatchId ? { ...p, [field]: val } : p))
      );
    }
  };

  // Helper to render premium vector garments with real stitching, folds, and highlights
  const renderGarmentSvg = (isShadow = false) => {
    const isReal = renderMode === 'real';
    const fillColor = isShadow ? '#1a100a' : activeColorHex;
    const strokeColor = isShadow ? 'transparent' : (isReal ? 'none' : '#3B2314');
    const strokeWidthVal = isShadow ? 0 : (isReal ? 0 : 2);

    const svgDefs = !isShadow ? (
      <defs>
        {/* Real organic cotton combed weave pattern */}
        <pattern id="real-cotton-weave" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="none" />
          <path d="M0,0 L6,6 M6,0 L0,6" stroke="#000000" strokeWidth="0.5" opacity="0.10" />
          <path d="M3,0 L3,6 M0,3 L6,3" stroke="#ffffff" strokeWidth="0.5" opacity="0.08" />
        </pattern>
        {/* Photorealistic 3D highlight and crease ambient lighting */}
        <radialGradient id="3d-light" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
        {/* Heavy fabric crease & drape shadow gradient */}
        <linearGradient id="crease-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    ) : null;

    const renderPath = (d: string, strokeWidth = strokeWidthVal) => {
      return (
        <>
          <path 
            d={d} 
            fill={fillColor} 
            stroke={isReal ? 'none' : strokeColor} 
            strokeWidth={isReal ? 0 : strokeWidth} 
            strokeLinejoin="round"
          />
          {!isShadow && (
            <>
              <path d={d} fill="url(#real-cotton-weave)" />
              <path d={d} fill="url(#3d-light)" />
              <path d={d} fill="url(#crease-shadow)" />
            </>
          )}
        </>
      );
    };

    if (style === 'hoodie_oversized' || style === 'hoodie_relaxed') {
      if (view === 'front') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {/* Body */}
            {renderPath("M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 C350 440, 335 450, 320 450 L80 450 C65 450, 50 440, 50 430 C40 380, 35 240, 55 170 Z")}

            {/* Outer Hood Fold */}
            {renderPath("M125 102 C125 40, 275 40, 275 102 C275 125, 230 145, 200 145 C170 145, 125 125, 125 102 Z")}
            
            {/* Hood Inner Hole */}
            <path 
              d="M150 105 C150 70, 250 70, 250 105 C250 125, 220 135, 200 135 C180 135, 150 125, 150 105 Z" 
              fill={isShadow ? fillColor : '#1E130B'} 
              opacity={isShadow ? 1 : 0.45}
            />

            {/* Left Sleeve */}
            {renderPath("M70 120 L30 200 C15 250, 5 320, 10 380 L35 385 L52 230")}
            {/* Right Sleeve */}
            {renderPath("M330 120 L370 200 C385 250, 395 320, 390 380 L365 385 L348 230")}

            {!isShadow && (
              <>
                <defs>
                  <clipPath id="hoodie-clip-front">
                    <path d="M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 C350 440, 335 450, 320 450 L80 450 C65 450, 50 440, 50 430 C40 380, 35 240, 55 170 Z" />
                    <path d="M125 102 C125 40, 275 40, 275 102 C275 125, 230 145, 200 145 C170 145, 125 125, 125 102 Z" />
                    <path d="M70 120 L30 200 C15 250, 5 320, 10 380 L35 385 L52 230" />
                    <path d="M330 120 L370 200 C385 250, 395 320, 390 380 L365 385 L348 230" />
                    <rect x="75" y="445" width="250" height="20" rx="2" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
                  x="-30" 
                  y="-10" 
                  width="460" 
                  height="510" 
                  clipPath="url(#hoodie-clip-front)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.65, pointerEvents: 'none', filter: isReal ? 'saturate(0) brightness(1.35) contrast(1.15)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <>
                    {/* Ribbed cuffs */}
                    <path d="M10 380 L35 385 L34 397 L9 392 Z" fill={fillColor} stroke="#3B2314" strokeWidth="1.5" />
                    <path d="M390 380 L365 385 L366 397 L391 392 Z" fill={fillColor} stroke="#3B2314" strokeWidth="1.5" />
                    <line x1="14" y1="381" x2="13" y2="393" stroke="#3B2314" strokeWidth="1" opacity="0.3"/>
                    <line x1="21" y1="382" x2="20" y2="394" stroke="#3B2314" strokeWidth="1" opacity="0.3"/>
                    <line x1="28" y1="383" x2="27" y2="395" stroke="#3B2314" strokeWidth="1" opacity="0.3"/>
                    <line x1="372" y1="382" x2="373" y2="394" stroke="#3B2314" strokeWidth="1" opacity="0.3"/>
                    <line x1="379" y1="383" x2="380" y2="395" stroke="#3B2314" strokeWidth="1" opacity="0.3"/>

                    {/* Kangaroo Pocket with shadows */}
                    {renderPath("M120 340 L280 340 L305 410 L95 410 Z", 1.5)}
                    <path d="M120 340 L95 410 C100 410, 115 400, 125 380 L120 340 Z" fill="#000000" fillOpacity="0.1"/>
                    <path d="M280 340 L305 410 C300 410, 285 400, 275 380 L280 340 Z" fill="#000000" fillOpacity="0.1"/>

                    {/* Strings with gold metal tips */}
                    <circle cx="185" cy="130" r="3.5" fill="#C9A96E" stroke="#3B2314" strokeWidth="1.2"/>
                    <circle cx="215" cy="130" r="3.5" fill="#C9A96E" stroke="#3B2314" strokeWidth="1.2"/>
                    <path d="M185 133 C182 165, 194 195, 184 212" stroke="#3B2314" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <path d="M215 133 C218 160, 206 190, 212 208" stroke="#3B2314" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <rect x="182" y="212" width="4" height="7" rx="1" fill="#C9A96E" stroke="#3B2314" strokeWidth="0.5"/>
                    <rect x="210" y="208" width="4" height="7" rx="1" fill="#C9A96E" stroke="#3B2314" strokeWidth="0.5"/>

                    {/* Shoulder and sleeve stitches */}
                    <path d="M70 120 C100 130, 200 135, 330 120" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" fill="none"/>
                    {style === 'hoodie_oversized' && (
                      <path d="M60 170 C100 185, 300 185, 340 170" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.3" fill="none"/>
                    )}

                    {/* 3D Wrinkle & drape shadows of real hoodies */}
                    <path d="M 120 280 Q 200 310 280 280" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" opacity="0.14" fill="none" />
                    <path d="M 120 280 Q 200 310 280 280" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.08" fill="none" style={{ transform: 'translateY(1.5px)' }} />
                    <path d="M 100 200 Q 200 240 300 200" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" opacity="0.12" fill="none" />
                    <path d="M 95 395 C 140 405, 260 405, 305 395" stroke="#000000" strokeWidth="2" strokeLinecap="round" opacity="0.14" fill="none" />

                    {/* Bottom Ribbed Waistband */}
                    <rect x="75" y="445" width="250" height="20" rx="2" fill={fillColor} stroke="#3B2314" strokeWidth="2"/>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <line 
                        key={i} 
                        x1={90 + i * 15} 
                        y1="445" 
                        x2={90 + i * 15} 
                        y2="465" 
                        stroke="#3B2314" 
                        strokeWidth="1" 
                        opacity="0.2"
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </svg>
        );
      } else if (view === 'back') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {renderPath("M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 C350 440, 335 450, 320 450 L80 450 C65 450, 50 440, 50 430 C40 380, 35 240, 55 170 Z")}
            {/* Left Sleeve */}
            {renderPath("M70 120 L30 200 C15 250, 5 320, 10 380 L35 385 L52 230")}
            {/* Right Sleeve */}
            {renderPath("M330 120 L370 200 C385 250, 395 320, 390 380 L365 385 L348 230")}

            {!isShadow && (
              <>
                <defs>
                  <clipPath id="hoodie-clip-back">
                    <path d="M70 120 C100 105, 120 100, 200 100 C280 100, 300 105, 330 120 L345 170 C365 240, 360 380, 350 430 C350 440, 335 450, 320 450 L80 450 C65 450, 50 440, 50 430 C40 380, 35 240, 55 170 Z" />
                    <path d="M70 120 L30 200 C15 250, 5 320, 10 380 L35 385 L52 230" />
                    <path d="M330 120 L370 200 C385 250, 395 320, 390 380 L365 385 L348 230" />
                    <path d="M125 102 C135 150, 150 205, 200 205 C250 205, 265 150, 275 102 C250 95, 150 95, 125 102 Z" />
                    <rect x="75" y="445" width="250" height="20" rx="2" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
                  x="-30" 
                  y="-10" 
                  width="460" 
                  height="510" 
                  clipPath="url(#hoodie-clip-back)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.65, pointerEvents: 'none', transform: 'scaleX(-1)', transformOrigin: 'center', filter: isReal ? 'saturate(0) brightness(1.35) contrast(1.15)' : 'none' }}
                />

                {renderMode === 'vector' ? (
                  <>
                    {/* Ribbed cuffs */}
                    <path d="M10 380 L35 385 L34 397 L9 392 Z" fill={fillColor} stroke="#3B2314" strokeWidth="1.5" />
                    <path d="M390 380 L365 385 L366 397 L391 392 Z" fill={fillColor} stroke="#3B2314" strokeWidth="1.5" />

                    {/* Hood hanging on back */}
                    {renderPath("M125 102 C135 150, 150 205, 200 205 C250 205, 265 150, 275 102 C250 95, 150 95, 125 102 Z")}
                    <path d="M125 102 C135 150, 150 205, 200 205 C250 205, 265 150, 275 102 Z" fill="#000000" opacity="0.1" />
                    <line x1="200" y1="102" x2="200" y2="205" stroke="#3B2314" strokeWidth="1" strokeDasharray="3 3" opacity="0.25"/>

                    {/* Waistband */}
                    <rect x="75" y="445" width="250" height="20" rx="2" fill={fillColor} stroke="#3B2314" strokeWidth="2"/>
                  </>
                ) : (
                  <>
                    {/* Soft back hood shadow details */}
                    <path d="M125 102 C135 150, 150 205, 200 205 C250 205, 265 150, 275 102 Z" fill="#000000" opacity="0.08" />
                    <path d="M125 102 C135 150, 150 205, 200 205 C250 205, 265 150, 275 102 Z" fill="none" stroke="#000000" strokeWidth="1" opacity="0.05" />
                  </>
                )}
              </>
            )}
          </svg>
        );
      } else if (view === 'left_sleeve') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {/* Background body shadow guide */}
            {!isShadow && (
              <path d="M220 80 L350 80 L350 450 L220 450 Z" fill="#3B2314" fillOpacity="0.04" stroke="#3B2314" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"/>
            )}
            {/* Sleeve main body */}
            {renderPath("M230 110 C180 130, 120 170, 70 230 C50 260, 40 310, 45 380 L90 395 C110 320, 140 260, 250 190 Z")}
            {!isShadow && (
              <>
                <defs>
                  <clipPath id="hoodie-clip-left-sleeve">
                    <path d="M230 110 C180 130, 120 170, 70 230 C50 260, 40 310, 45 380 L90 395 C110 320, 140 260, 250 190 Z" />
                    <path d="M45 380 L90 395 L85 415 L40 400 Z" />
                  </clipPath>
                </defs>
                 <image 
                  href="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
                  x="-50" 
                  y="-20" 
                  width="500" 
                  height="550" 
                  clipPath="url(#hoodie-clip-left-sleeve)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.65, pointerEvents: 'none', filter: isReal ? 'saturate(0) brightness(1.35) contrast(1.15)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <>
                    {/* Ribbed cuff */}
                    <path d="M45 380 L90 395 L85 415 L40 400 Z" fill={fillColor} stroke="#3B2314" strokeWidth="2"/>
                    <line x1="50" y1="385" x2="45" y2="405" stroke="#3B2314" strokeWidth="1" opacity="0.25"/>
                    <line x1="62" y1="389" x2="57" y2="409" stroke="#3B2314" strokeWidth="1" opacity="0.25"/>
                    <line x1="75" y1="393" x2="70" y2="413" stroke="#3B2314" strokeWidth="1" opacity="0.25"/>
                    {/* Stitch lines */}
                    <path d="M230 110 C250 130, 260 160, 250 190" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3" fill="none"/>
                    {/* Fabric sleeve creases */}
                    <path d="M 120 200 Q 150 230 180 210" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" opacity="0.14" fill="none" />
                    <path d="M 80 270 Q 110 295 150 280" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" opacity="0.14" fill="none" />
                  </>
                )}
              </>
            )}
          </svg>
        );
      } else if (view === 'right_sleeve') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {!isShadow && (
              <path d="M180 80 L50 80 L50 450 L180 450 Z" fill="#3B2314" fillOpacity="0.04" stroke="#3B2314" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"/>
            )}
            {renderPath("M170 110 C220 130, 280 170, 330 230 C350 260, 360 310, 355 380 L310 395 C290 320, 260 260, 150 190 Z")}
            {!isShadow && (
              <>
                <defs>
                  <clipPath id="hoodie-clip-right-sleeve">
                    <path d="M170 110 C220 130, 280 170, 330 230 C350 260, 360 310, 355 380 L310 395 C290 320, 260 260, 150 190 Z" />
                    <path d="M355 380 L310 395 L315 415 L360 400 Z" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
                  x="-50" 
                  y="-20" 
                  width="500" 
                  height="550" 
                  clipPath="url(#hoodie-clip-right-sleeve)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.65, pointerEvents: 'none', transform: 'scaleX(-1)', transformOrigin: 'center', filter: isReal ? 'saturate(0) brightness(1.35) contrast(1.15)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <>
                    {/* Cuff */}
                    <path d="M355 380 L310 395 L315 415 L360 400 Z" fill={fillColor} stroke="#3B2314" strokeWidth="2"/>
                    <line x1="350" y1="385" x2="355" y2="405" stroke="#3B2314" strokeWidth="1" opacity="0.25"/>
                    <line x1="338" y1="389" x2="343" y2="409" stroke="#3B2314" strokeWidth="1" opacity="0.25"/>
                    <line x1="325" y1="393" x2="330" y2="413" stroke="#3B2314" strokeWidth="1" opacity="0.25"/>
                    {/* Stitch lines */}
                    <path d="M170 110 C150 130, 140 160, 150 190" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3" fill="none"/>
                    {/* Fabric sleeve creases */}
                    <path d="M 280 200 Q 250 230 220 210" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" opacity="0.14" fill="none" />
                    <path d="M 320 270 Q 290 295 250 280" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" opacity="0.14" fill="none" />
                  </>
                )}
              </>
            )}
          </svg>
        );
      } else {
        // Cap / Hood profile
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {!isShadow && (
              <path d="M80 400 L320 400 L320 450 L80 450 Z" fill="#3B2314" fillOpacity="0.04" stroke="#3B2314" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"/>
            )}
            {renderPath("M220 400 C220 370, 240 350, 260 340 C280 300, 280 180, 220 120 C150 60, 90 120, 95 240 C95 300, 110 350, 160 380 C180 390, 200 400, 220 400 Z", 2.5)}
            {!isShadow && (
              <>
                <defs>
                  <clipPath id="hoodie-clip-cap">
                    <path d="M220 400 C220 370, 240 350, 260 340 C280 300, 280 180, 220 120 C150 60, 90 120, 95 240 C95 300, 110 350, 160 380 C180 390, 200 400, 220 400 Z" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
                  x="-50" 
                  y="-20" 
                  width="500" 
                  height="550" 
                  clipPath="url(#hoodie-clip-cap)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.65, pointerEvents: 'none', filter: isReal ? 'saturate(0) brightness(1.35) contrast(1.15)' : 'none' }}
                />
                {renderMode === 'vector' && (
                  <path d="M220 400 C200 400, 180 390, 160 380 C110 350, 95 300, 95 240 C95 120, 150 60, 220 120" stroke="#3B2314" strokeWidth="1.5" strokeDasharray="2 3" fill="none" opacity="0.5"/>
                )}
              </>
            )}
          </svg>
        );
      }
    } else {
      // T-Shirt Classic
      if (view === 'front') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {renderPath("M90 130 C120 120, 150 120, 200 120 C250 120, 280 120, 310 130 L325 210 C335 270, 330 380, 325 440 C325 450, 315 455, 300 455 L100 455 C85 455, 75 450, 75 440 C70 380, 65 270, 75 210 Z")}

            {/* Left Short Sleeve */}
            {renderPath("M90 130 L45 190 C40 198, 48 205, 58 202 L95 185")}
            {/* Right Short Sleeve */}
            {renderPath("M310 130 L355 190 C360 198, 352 205, 342 202 L305 185")}

            {!isShadow && (
              <>
                <defs>
                  <clipPath id="tshirt-clip-front">
                    <path d="M90 130 C120 120, 150 120, 200 120 C250 120, 280 120, 310 130 L325 210 C335 270, 330 380, 325 440 C325 450, 315 455, 300 455 L100 455 C85 455, 75 450, 75 440 C70 380, 65 270, 75 210 Z" />
                    <path d="M90 130 L45 190 C40 198, 48 205, 58 202 L95 185" />
                    <path d="M310 130 L355 190 C360 198, 352 205, 342 202 L305 185" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                  x="-10" 
                  y="10" 
                  width="420" 
                  height="470" 
                  clipPath="url(#tshirt-clip-front)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.7, pointerEvents: 'none', filter: isReal ? 'saturate(0) brightness(1.02) contrast(1.05)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <>
                    {/* Crewneck Collar */}
                    <path d="M155 122 C155 142, 245 142, 245 122" fill="none" stroke="#3B2314" strokeWidth="2.5"/>
                    <path d="M155 122 C170 148, 230 148, 245 122" fill={fillColor} stroke="#3B2314" strokeWidth="2"/>
                    {/* Collar stitching */}
                    <path d="M151 123 C168 152, 232 152, 249 123" fill="none" stroke="#3B2314" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4"/>

                    {/* Sleeve Hem stitching */}
                    <path d="M48 186 L92 171" stroke="#3B2314" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" fill="none"/>
                    <path d="M352 186 L308 171" stroke="#3B2314" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" fill="none"/>

                    {/* Shoulder stitching lines */}
                    <path d="M90 130 L155 122" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3"/>
                    <path d="M310 130 L245 122" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3"/>

                    {/* 3D folds / chest draping shadows for real tee look */}
                    <path d="M 110 220 Q 200 245 290 220" stroke="#000000" strokeWidth="2" strokeLinecap="round" opacity="0.11" fill="none" />
                    <path d="M 150 330 Q 200 350 250 330" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" opacity="0.09" fill="none" />

                    {/* Bottom Hem stitching */}
                    <line x1="80" y1="447" x2="320" y2="447" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4"/>
                    <line x1="80" y1="451" x2="320" y2="451" stroke="#3B2314" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.25"/>
                  </>
                )}
              </>
            )}
          </svg>
        );
      } else if (view === 'back') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {renderPath("M90 130 C120 120, 150 120, 200 120 C250 120, 280 120, 310 130 L325 210 C335 270, 330 380, 325 440 C325 450, 315 455, 300 455 L100 455 C85 455, 75 450, 75 440 C70 380, 65 270, 75 210 Z")}
            {/* Left Sleeve */}
            {renderPath("M90 130 L45 190 C40 198, 48 205, 58 202 L95 185")}
            {/* Right Sleeve */}
            {renderPath("M310 130 L355 190 C360 198, 352 205, 342 202 L305 185")}
            {!isShadow && (
              <>
                <defs>
                  <clipPath id="tshirt-clip-back">
                    <path d="M90 130 C120 120, 150 120, 200 120 C250 120, 280 120, 310 130 L325 210 C335 270, 330 380, 325 440 C325 450, 315 455, 300 455 L100 455 C85 455, 75 450, 75 440 C70 380, 65 270, 75 210 Z" />
                    <path d="M90 130 L45 190 C40 198, 48 205, 58 202 L95 185" />
                    <path d="M310 130 L355 190 C360 198, 352 205, 342 202 L305 185" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                  x="-10" 
                  y="10" 
                  width="420" 
                  height="470" 
                  clipPath="url(#tshirt-clip-back)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.7, pointerEvents: 'none', transform: 'scaleX(-1)', transformOrigin: 'center', filter: isReal ? 'saturate(0) brightness(1.02) contrast(1.05)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <>
                    <path d="M155 122 C170 129, 230 129, 245 122" fill="none" stroke="#3B2314" strokeWidth="2.5"/>
                    <line x1="80" y1="447" x2="320" y2="447" stroke="#3B2314" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4"/>
                  </>
                )}
              </>
            )}
          </svg>
        );
      } else if (view === 'left_sleeve') {
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {/* Background body shadow guide */}
            {!isShadow && (
              <path d="M220 80 L350 80 L350 450 L220 450 Z" fill="#3B2314" fillOpacity="0.04" stroke="#3B2314" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"/>
            )}
            {/* Sleeve main body */}
            {renderPath("M250 130 C200 145, 140 180, 110 230 C90 260, 95 285, 120 280 L250 210 Z")}
            {!isShadow && (
              <>
                <defs>
                  <clipPath id="tshirt-clip-left-sleeve">
                    <path d="M250 130 C200 145, 140 180, 110 230 C90 260, 95 285, 120 280 L250 210 Z" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                  x="-50" 
                  y="-20" 
                  width="500" 
                  height="550" 
                  clipPath="url(#tshirt-clip-left-sleeve)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.7, pointerEvents: 'none', filter: isReal ? 'saturate(0) brightness(1.02) contrast(1.05)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <path d="M110 230 C95 250, 105 275, 120 280" stroke="#3B2314" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
                )}
              </>
            )}
          </svg>
        );
      } else {
        // Right Sleeve
        return (
          <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {svgDefs}
            {!isShadow && (
              <path d="M180 80 L50 80 L50 450 L180 450 Z" fill="#3B2314" fillOpacity="0.04" stroke="#3B2314" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"/>
            )}
            {renderPath("M150 130 C200 145, 260 180, 290 230 C310 260, 305 285, 280 280 L150 210 Z")}
            {!isShadow && (
              <>
                <defs>
                  <clipPath id="tshirt-clip-right-sleeve">
                    <path d="M150 130 C200 145, 260 180, 290 230 C310 260, 305 285, 280 280 L150 210 Z" />
                  </clipPath>
                </defs>
                <image 
                  href="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                  x="-50" 
                  y="-20" 
                  width="500" 
                  height="550" 
                  clipPath="url(#tshirt-clip-right-sleeve)"
                  style={{ mixBlendMode: 'multiply', opacity: isReal ? 0.98 : 0.7, pointerEvents: 'none', transform: 'scaleX(-1)', transformOrigin: 'center', filter: isReal ? 'saturate(0) brightness(1.02) contrast(1.05)' : 'none' }}
                />

                {renderMode === 'vector' && (
                  <path d="M290 230 C305 250, 295 275, 280 280" stroke="#3B2314" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
                )}
              </>
            )}
          </svg>
        );
      }
    }
  };

  const selectedPatch = patches.find(p => p.id === selectedPatchId);
  const patchesOnCurrentView = patches.filter(p => p.view === view);
  const isTextOnCurrentView = customText.trim() !== '' && textView === view;

  return (
    <div id="customize-preview-module" className="flex flex-col h-full bg-white rounded-2xl border border-[#3B2314]/10 shadow-sm p-5 md:p-6">
      
      {/* Header Info */}
      <div className="flex justify-between items-start border-b border-[#3B2314]/5 pb-4 mb-5">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#3B2314]">Interactive Canvas</h3>
          <p className="font-sans text-xs text-[#3B2314]/60">Select items on the garment to drag & position, or use fine-tune sliders.</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F0E8] border border-[#C9A96E]/20 text-[10px] font-sans font-semibold text-[#3B2314]">
            <Sparkles className="w-3 h-3 text-[#C9A96E]" />
            Live Layout
          </span>
          <span className="text-[10px] text-[#3B2314]/40 font-sans mt-1">Patches: {patches.length}/7 used</span>
        </div>
      </div>

      {/* View & 3D Toggle Bar */}
      <div id="view-toggle-row" className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-5 p-1 bg-[#F5F0E8]/40 rounded-xl border border-[#3B2314]/5">
        <div className="flex flex-wrap gap-1 bg-[#F5F0E8]/50 p-1 rounded-lg justify-center">
          {availableViews.map((v) => (
            <button
              key={v.id}
              id={`view-btn-${v.id}`}
              onClick={() => {
                setView(v.id);
                setSelectedPatchId(null);
                setIsTextSelected(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-widest font-semibold transition-all focus:outline-none ${
                view === v.id
                  ? 'bg-[#3B2314] text-[#F5F0E8] shadow-sm'
                  : 'text-[#3B2314]/60 hover:text-[#3B2314] hover:bg-[#3B2314]/5'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mr-1">
          {/* Rendering Mode toggle split pill */}
          <div className="flex items-center gap-1 bg-white/85 p-0.5 rounded-lg border border-[#3B2314]/10 shadow-sm">
            <button
              id="toggle-render-real"
              onClick={() => setRenderMode('real')}
              className={`px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-wider font-bold transition-all focus:outline-none flex items-center gap-1 ${
                renderMode === 'real'
                  ? 'bg-[#3B2314] text-[#F5F0E8] shadow-sm'
                  : 'text-[#3B2314]/60 hover:text-[#3B2314]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
              Photorealistic
            </button>
            <button
              id="toggle-render-vector"
              onClick={() => setRenderMode('vector')}
              className={`px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-wider font-bold transition-all focus:outline-none flex items-center gap-1 ${
                renderMode === 'vector'
                  ? 'bg-[#3B2314] text-[#F5F0E8] shadow-sm'
                  : 'text-[#3B2314]/60 hover:text-[#3B2314]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Blueprint Sketch
            </button>
          </div>

          {/* 3D toggle split pill */}
          <div className="flex items-center gap-1 bg-white/85 p-0.5 rounded-lg border border-[#3B2314]/10 shadow-sm">
            <button
              id="toggle-2d-view"
              onClick={() => {
                setIs3D(false);
                setIsAutoRotating(false);
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-wider font-bold transition-all focus:outline-none flex items-center gap-1 ${
                !is3D
                  ? 'bg-[#3B2314] text-[#F5F0E8] shadow-sm'
                  : 'text-[#3B2314]/60 hover:text-[#3B2314]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              2D Flat
            </button>
            <button
              id="toggle-3d-view"
              onClick={() => {
                setIs3D(true);
                setSelectedPatchId(null);
                setIsTextSelected(false);
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-wider font-bold transition-all focus:outline-none flex items-center gap-1 ${
                is3D
                  ? 'bg-[#8B0000] text-[#F5F0E8] shadow-sm'
                  : 'text-[#3B2314]/60 hover:text-[#3B2314]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3D Depth
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Interactive Canvas Container */}
      <div 
        className="relative flex-1 flex items-center justify-center bg-[#F5F0E8]/30 rounded-xl overflow-hidden min-h-[380px] p-4 border border-[#3B2314]/5"
        style={{ 
          perspective: is3D ? '1000px' : 'none',
          perspectiveOrigin: is3D ? `${perspectiveOrigin.x}% ${perspectiveOrigin.y}%` : '50% 50%',
          transition: isDragging ? 'none' : 'perspective-origin 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
      >
        {/* Floating 3D Control overlay */}
        {is3D && (
          <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#3B2314]/15 shadow-md flex flex-col gap-2.5 min-w-[140px]">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#3B2314]/80 flex items-center gap-1">
              <Orbit className="w-3.5 h-3.5 text-[#8B0000] animate-pulse" /> Camera Rig
            </span>
            
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`w-full py-1.5 px-2 rounded text-[9px] font-sans font-bold flex items-center justify-center gap-1 transition-all ${
                isAutoRotating
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'bg-[#F5F0E8] text-[#3B2314] hover:bg-[#3B2314]/5'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              {isAutoRotating ? 'Spinning ON' : 'Auto Rotate'}
            </button>

            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-mono text-[#3B2314]/60">
                <span>YAW (Y-AXIS)</span>
                <span>{Math.round(yaw3D)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={Math.round(yaw3D)}
                onChange={(e) => {
                  setYaw3D(parseInt(e.target.value));
                  setIsAutoRotating(false);
                }}
                className="w-full accent-[#8B0000] h-1 bg-[#3B2314]/10 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-mono text-[#3B2314]/60">
                <span>PITCH (X-AXIS)</span>
                <span>{Math.round(pitch3D)}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={pitch3D}
                onChange={(e) => {
                  setPitch3D(parseInt(e.target.value));
                  setIsAutoRotating(false);
                }}
                className="w-full accent-[#8B0000] h-1 bg-[#3B2314]/10 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {is3D && !isDragging && (
          <div className="absolute bottom-3 left-3 z-30 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[9px] font-sans leading-relaxed pointer-events-none max-w-[210px] shadow border border-white/10">
            💡 <strong>3D Depth view active.</strong> Use sliders to spin and inspect placement. Patches can be dragged in 2D Flat view.
          </div>
        )}

        <div
          className={`w-full flex items-center justify-center transition-transform duration-300 ${is3D ? 'animate-3d-float' : ''}`}
          style={{ transformStyle: is3D ? 'preserve-3d' : 'flat' }}
        >
          <div
            ref={containerRef}
            id="garment-canvas-stage"
            className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center transition-all duration-300"
            style={{
              transformStyle: is3D ? 'preserve-3d' : 'flat',
              transform: is3D ? `rotateY(${yaw3D}deg) rotateX(${pitch3D}deg) scale(0.85)` : 'none',
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={() => {
              setSelectedPatchId(null);
              setIsTextSelected(false);
            }}
          >
            {/* 3D Depth Layers for real fabric thickness and substance */}
            {is3D && (
              <>
                {/* Back edge layer 3 */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
                  style={{
                    transform: 'translateZ(-12px)',
                    filter: 'brightness(0.25) blur(1.5px)',
                  }}
                >
                  {renderGarmentSvg(true)}
                </div>
                {/* Back edge layer 2 */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"
                  style={{
                    transform: 'translateZ(-8px)',
                    filter: 'brightness(0.38) blur(1px)',
                  }}
                >
                  {renderGarmentSvg(true)}
                </div>
                {/* Back edge layer 1 */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70"
                  style={{
                    transform: 'translateZ(-4px)',
                    filter: 'brightness(0.5) blur(0.5px)',
                  }}
                >
                  {renderGarmentSvg(true)}
                </div>
              </>
            )}

            {/* Garment Base SVG Representation */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-[0_12px_24px_rgba(59,35,20,0.12)]"
              style={{
                transform: is3D ? 'translateZ(0px)' : 'none'
              }}
            >
              {renderGarmentSvg(false)}
            </div>

            {/* Render Active Patches */}
            {patchesOnCurrentView.map((patch) => {
              const isSelected = selectedPatchId === patch.id;
              return (
                <div
                  key={patch.id}
                  id={`interactive-patch-${patch.id}`}
                  className={`absolute cursor-move select-none transition-shadow ${
                    isSelected ? 'z-20 ring-2 ring-[#8B0000] ring-offset-2 rounded' : 'z-10 hover:ring-1 hover:ring-[#C9A96E]'
                  }`}
                  style={{
                    left: `${patch.x}%`,
                    top: `${patch.y}%`,
                    transform: `translate(-50%, -50%) scale(${patch.scale}) rotate(${patch.rotation}deg) translateZ(${is3D ? '12px' : '0px'})`,
                    width: '45px',
                    height: '45px',
                    transformStyle: 'preserve-3d'
                  }}
                  onMouseDown={(e) => !is3D && handleMouseDown(e, 'patch', patch.id)}
                  onTouchStart={(e) => !is3D && handleTouchStart(e, 'patch', patch.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatchId(patch.id);
                    setIsTextSelected(false);
                  }}
                >
                  <div
                    className="w-full h-full text-[#3B2314] drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] flex items-center justify-center bg-[#F5F0E8]/10 backdrop-blur-[0.5px] rounded"
                    style={{
                      transform: is3D ? 'translateZ(2px)' : 'none'
                    }}
                    dangerouslySetInnerHTML={{ __html: patch.imageSrc }}
                  />
                  
                  {/* Visual drag handle banner inside active edit */}
                  {isSelected && !is3D && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#3B2314] text-[#F5F0E8] text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 shadow font-sans whitespace-nowrap">
                      <Move className="w-2.5 h-2.5 text-[#C9A96E]" />
                      Drag
                    </div>
                  )}
                </div>
              );
            })}

            {/* Render Active Custom Embroidery Text */}
            {isTextOnCurrentView && (
              <div
                id="interactive-custom-text"
                className={`absolute cursor-move select-none transition-all ${
                  isTextSelected ? 'z-20 ring-2 ring-[#8B0000] ring-offset-2 px-2 py-1 rounded' : 'z-10 hover:ring-1 hover:ring-[#C9A96E]'
                }`}
                style={{
                  left: `${textX}%`,
                  top: `${textY}%`,
                  transform: `translate(-50%, -50%) scale(${textScale}) translateZ(${is3D ? '10px' : '0px'})`,
                  color: threadColor,
                  transformStyle: 'preserve-3d'
                }}
                onMouseDown={(e) => !is3D && handleMouseDown(e, 'text')}
                onTouchStart={(e) => !is3D && handleTouchStart(e, 'text')}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTextSelected(true);
                  setSelectedPatchId(null);
                }}
              >
                <div
                  className={`text-center whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] font-semibold uppercase tracking-wider ${
                    textLanguage === 'ur' ? 'font-serif text-lg leading-relaxed' : 'font-serif text-sm'
                  }`}
                  style={{
                    textShadow: `0 0 1px ${threadColor}33`,
                    fontStyle: textLanguage === 'en' ? 'italic' : 'normal',
                    transform: is3D ? 'translateZ(2px)' : 'none'
                  }}
                >
                  {customText}
                </div>
                
                {isTextSelected && !is3D && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#3B2314] text-[#F5F0E8] text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 shadow font-sans whitespace-nowrap">
                    <Move className="w-2.5 h-2.5 text-[#C9A96E]" />
                    Embroidery Text
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Element Fine-Tune Rig Panel */}
      <div id="canvas-fine-tune-controls" className="mt-5 pt-4 border-t border-[#3B2314]/5 space-y-4">
        {selectedPatch ? (
          <div className="bg-[#F5F0E8] p-3.5 rounded-xl border border-[#C9A96E]/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B0000]" />
                <h4 className="font-serif text-xs font-semibold text-[#3B2314]">
                  Patch: <span className="text-[#8B0000] font-sans font-bold text-[11px] uppercase tracking-wide">{selectedPatch.name}</span>
                </h4>
              </div>
              <button
                id="delete-patch-btn"
                onClick={handleDeleteSelectedPatch}
                className="text-[#8B0000] hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors focus:outline-none"
                title="Remove Patch"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-sans text-[#3B2314]/75">
                  <span className="flex items-center gap-1"><Maximize className="w-3 h-3 text-[#C9A96E]" /> Scale</span>
                  <span className="font-semibold">{Math.round(selectedPatch.scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={selectedPatch.scale}
                  onChange={(e) => handleUpdateSelectedPatch('scale', parseFloat(e.target.value))}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-sans text-[#3B2314]/75">
                  <span className="flex items-center gap-1"><RotateCw className="w-3 h-3 text-[#C9A96E]" /> Rotation</span>
                  <span className="font-semibold">{selectedPatch.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={selectedPatch.rotation}
                  onChange={(e) => handleUpdateSelectedPatch('rotation', parseInt(e.target.value))}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>

              {/* Precise Position Controls */}
              <div className="space-y-1">
                <label className="block text-[10px] font-sans text-[#3B2314]/75">Horizontal X</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={selectedPatch.x}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPatches(prev => prev.map(p => p.id === selectedPatchId ? { ...p, x: val } : p));
                  }}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-sans text-[#3B2314]/75">Vertical Y</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={selectedPatch.y}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPatches(prev => prev.map(p => p.id === selectedPatchId ? { ...p, y: val } : p));
                  }}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>
            </div>
          </div>
        ) : isTextSelected && isTextOnCurrentView ? (
          <div className="bg-[#F5F0E8] p-3.5 rounded-xl border border-[#C9A96E]/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                <h4 className="font-serif text-xs font-semibold text-[#3B2314]">
                  Embroidery Text Style Rig
                </h4>
              </div>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#3B2314]/10 text-[#3B2314] font-semibold uppercase tracking-wider">
                {threadColorName} Thread
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Text Scale */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-sans text-[#3B2314]/75">
                  <span className="flex items-center gap-1"><Maximize className="w-3 h-3 text-[#C9A96E]" /> Size Scale</span>
                  <span className="font-semibold">{Math.round(textScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={textScale}
                  onChange={(e) => setTextScale(parseFloat(e.target.value))}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>

              {/* Text X */}
              <div className="space-y-1">
                <label className="block text-[10px] font-sans text-[#3B2314]/75">Horizontal Position</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={textX}
                  onChange={(e) => setTextX(parseInt(e.target.value))}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>

              {/* Text Y */}
              <div className="space-y-1 col-span-2">
                <label className="block text-[10px] font-sans text-[#3B2314]/75">Vertical Position</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={textY}
                  onChange={(e) => setTextY(parseInt(e.target.value))}
                  className="w-full accent-[#8B0000] cursor-pointer h-1 bg-[#3B2314]/10 rounded"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-[11px] text-[#3B2314]/50 font-sans flex items-center justify-center gap-1.5 bg-[#F5F0E8]/20 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Click any patch or custom text directly on the canvas to edit its properties.</span>
          </div>
        )}
      </div>

    </div>
  );
}
