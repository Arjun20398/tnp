'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import productsData from '@/data/products.json';

interface Product {
  id: number;
  title: string;
  description: string;
  images: string[]; // Changed from image to images array
  price?: number;
  weight?: string;
  dimensions?: string;
}

const products: Product[] = productsData;

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with middle item
  const [rotation, setRotation] = useState(0); // Continuous rotation angle
  const [isDragging, setIsDragging] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<Product & { quantity: number }>>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '+91 ',
    address: ''
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dragStartX = useRef(0);

  const handleAddToCart = () => {
    const currentProduct = products[currentIndex];
    const existingItemIndex = cartItems.findIndex(item => item.id === currentProduct.id);
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      setCartItems(prev => prev.map((item, idx) => 
        idx === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // New item, add with quantity 1
      setCartItems(prev => [...prev, { ...currentProduct, quantity: 1 }]);
    }
    setCartCount(prev => prev + 1);
    
    // Visual feedback
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 300);
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    const item = cartItems[indexToRemove];
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setCartCount(prev => prev - item.quantity);
  };

  const handleIncreaseQuantity = (index: number) => {
    setCartItems(prev => prev.map((item, idx) => 
      idx === index ? { ...item, quantity: item.quantity + 1 } : item
    ));
    setCartCount(prev => prev + 1);
  };

  const handleDecreaseQuantity = (index: number) => {
    const item = cartItems[index];
    if (item.quantity > 1) {
      setCartItems(prev => prev.map((item, idx) => 
        idx === index ? { ...item, quantity: item.quantity - 1 } : item
      ));
      setCartCount(prev => prev - 1);
    } else {
      handleRemoveFromCart(index);
    }
  };

  const calculateDiscount = (itemCount: number) => {
    // Calculate based on total quantity, not unique items
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= 3) return 15;
    if (totalQuantity >= 2) return 10;
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const deliveryCharge = 75;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discountPercent = calculateDiscount(totalQuantity);
    const discount = (subtotal * discountPercent) / 100;
    const total = subtotal + deliveryCharge - discount;
    return { subtotal, deliveryCharge, discount, discountPercent, total };
  };

  const openImageModal = (product: Product, imageIndex: number = 0) => {
    setSelectedProduct(product);
    setCurrentImageIndex(imageIndex);
  };

  const closeImageModal = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const anglePerSide = 360 / products.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    setRotation(prev => prev + anglePerSide); // Rotate by one face
    setIsAutoRotating(false); // Stop auto-rotation on manual interaction
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    setRotation(prev => prev - anglePerSide); // Rotate by one face
    setIsAutoRotating(false); // Stop auto-rotation on manual interaction
  };

  // Auto-rotate carousel - DISABLED
  // useEffect(() => {
  //   if (!isAutoRotating) return;

  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  //     setRotation(prev => prev - anglePerSide);
  //   }, 3000); // Rotate every 3 seconds

  //   return () => clearInterval(interval);
  // }, [isAutoRotating, anglePerSide]);

  // Get circular index (wraps around)
  const getCircularIndex = (index: number) => {
    const len = products.length;
    return ((index % len) + len) % len;
  };

  const getItemStyle = (index: number) => {
    // Calculate position relative to current index
    const position = index - currentIndex;
    const absDiff = Math.abs(position);
    
    // Center card
    if (position === 0) {
      return {
        scale: 1,
        opacity: 1,
        x: 0,
        z: 0,
        rotateY: 0,
        blur: 0
      };
    }
    
    // Left card (position = -1)
    if (position === -1) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 768;
      return {
        scale: isMobile ? 0.5 : 0.7,
        opacity: isMobile ? 0.3 : 0.6,
        x: isMobile ? -200 : isTablet ? -350 : -500,
        z: -200,
        rotateY: -35,
        blur: 1
      };
    }
    
    // Right card (position = 1)
    if (position === 1) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 768;
      return {
        scale: isMobile ? 0.5 : 0.7,
        opacity: isMobile ? 0.3 : 0.6,
        x: isMobile ? 200 : isTablet ? 350 : 500,
        z: -200,
        rotateY: 35,
        blur: 1
      };
    }
    
    // Default (shouldn't reach here with absDiff > 1 filter)
    return {
      scale: 0.5,
      opacity: 0,
      x: position > 0 ? 800 : -800,
      z: -400,
      rotateY: 0,
      blur: 5
    };
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Top Text */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
          The Noble Presents
        </h1>
      </div>

      {/* Cart Icon */}
      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-[#D1D5DB]"
        >
          <svg className="w-6 h-6 text-[#1C1E21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#4A90E2] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Promotional Banner - Top Left Corner */}
      <div className="absolute left-2 top-16 sm:left-4 sm:top-20 md:left-8 md:top-24 z-20">
        <div className="rounded-md p-1.5 sm:p-2 md:p-3 max-w-[90px] sm:max-w-[120px] md:max-w-[160px] hover:scale-105 transition-transform duration-300">
          <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
            {/* 10% OFF Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 rounded p-1.5 sm:p-2 md:p-3 shadow-sm md:shadow-md transform hover:scale-105 transition-all duration-200">
              <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-white/20 rounded-full -mr-3 -mt-3 sm:-mr-4 sm:-mt-4 md:-mr-6 md:-mt-6"></div>
              <div className="relative z-10">
                <p className="text-[7px] sm:text-[8px] md:text-[10px] font-bold text-white/90 uppercase tracking-wide leading-tight">Buy 2 Items</p>
                <div className="flex items-baseline gap-0.5">
                  <p className="text-sm sm:text-lg md:text-2xl font-black text-white">10%</p>
                  <p className="text-[8px] sm:text-[9px] md:text-xs font-bold text-white/90">OFF</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            
            {/* 15% OFF Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded p-1.5 sm:p-2 md:p-3 shadow-sm md:shadow-md transform hover:scale-105 transition-all duration-200">
              <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-white/20 rounded-full -mr-3 -mt-3 sm:-mr-4 sm:-mt-4 md:-mr-6 md:-mt-6"></div>
              <div className="relative z-10">
                <p className="text-[7px] sm:text-[8px] md:text-[10px] font-bold text-white/90 uppercase tracking-wide leading-tight">Buy 3+ Items</p>
                <div className="flex items-baseline gap-0.5">
                  <p className="text-sm sm:text-lg md:text-2xl font-black text-white">15%</p>
                  <p className="text-[8px] sm:text-[9px] md:text-xs font-bold text-white/90">OFF</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>
          
          {/* Sparkle decoration */}
          <div className="absolute -top-0.5 -right-0.5 text-yellow-400 text-xs sm:text-sm md:text-base animate-pulse">✨</div>
        </div>
      </div>

      {/* Social Media Icons - Bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        {/* Instagram */}
        <a href="https://www.instagram.com/the_noble_presents/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-[#D1D5DB] hover:bg-gray-50 group relative">
          <svg className="w-6 h-6 text-[#1C1E21]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1C1E21] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Follow us on Insta
          </span>
        </a>

        {/* Google Business */}
        <a href="https://share.google/UuHpcnCeyLHJ99A8C" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-[#D1D5DB] hover:bg-gray-50 group relative">
          <svg className="w-6 h-6 text-[#1C1E21]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
          </svg>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1C1E21] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Visit our Google Business
          </span>
        </a>

        {/* Email */}
        <a href="mailto:arjunsingh20398@gmail.com" className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-[#D1D5DB] hover:bg-gray-50">
          <svg className="w-6 h-6 text-[#1C1E21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>

        {/* Built By - LinkedIn */}
        <a href="https://www.linkedin.com/in/arjun20398/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-[#D1D5DB] hover:bg-gray-50 group relative">
          <svg className="w-6 h-6 text-[#1C1E21]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1C1E21] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Built by
          </span>
        </a>
      </div>
      
      <div className="relative w-full max-w-[1600px] mx-auto px-4">
        {/* Carousel Container */}
        <div className="relative h-[450px] flex items-center justify-center perspective-1000">
          {/* Render all products on the cylinder */}
          {products.map((product, index) => {
            const style = getItemStyle(index);
            const position = index - currentIndex;
            const absDiff = Math.abs(position);
            
            // Only render visible cards (center and 1 on each side)
            if (absDiff > 1) return null;
            
            return (
              <motion.div
                key={product.id}
                className="absolute cursor-pointer"
                animate={{
                  x: style.x,
                  z: style.z,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                  filter: `blur(${style.blur}px)`
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                onClick={() => {
                  if (index !== currentIndex) {
                    const diff = index - currentIndex;
                    setRotation(prev => prev + (diff * anglePerSide));
                    setCurrentIndex(index);
                    setIsAutoRotating(false);
                  }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  left: '50%',
                  top: '50%',
                  marginLeft: window.innerWidth < 640 ? '-150px' : window.innerWidth < 768 ? '-250px' : '-385px',
                  marginTop: window.innerWidth < 640 ? '-200px' : window.innerWidth < 768 ? '-210px' : '-220px',
                  zIndex: position === 0 ? 10 : Math.max(0, 5 - absDiff),
                  pointerEvents: absDiff > 1 ? 'none' : 'auto'
                }}
              >
                <div className="w-[300px] h-[400px] sm:w-[500px] sm:h-[420px] md:w-[770px] md:h-[440px] rounded-2xl bg-white/70 backdrop-blur-md border border-[#D1D5DB] p-4 sm:p-6 md:p-8 flex flex-col items-center gap-2 sm:gap-3 md:gap-4 shadow-2xl relative">
                  {/* Product Image/Icon */}
                  <div 
                    className="flex-shrink-0 w-[150px] h-[100px] sm:w-[250px] sm:h-[150px] md:w-[320px] md:h-[200px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(product, 0);
                    }}
                  >
                    {product.images && product.images.length > 0 ? (
                      product.images[0].startsWith('/') || product.images[0].startsWith('http') ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-9xl">{product.images[0]}</span>
                      )
                    ) : (
                      <span className="text-9xl">📦</span>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex flex-col gap-2 w-full">
                    {/* Product Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1C1E21] text-center">
                      {product.title}
                    </h3>
                    
                    {/* Product Description */}
                    <p className="text-black text-xs sm:text-sm leading-relaxed font-semibold max-w-[250px] sm:max-w-[400px] md:max-w-[500px] mx-auto text-center line-clamp-3">
                      {product.description}
                    </p>
                    
                    {/* Price, Weight, and Dimensions */}
                    {(product.price || product.weight || product.dimensions) && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-base">
                        {product.price && (
                          <span className="font-bold text-[#1C1E21] text-lg sm:text-xl">₹{product.price}</span>
                        )}
                        {product.weight && (
                          <span className="text-black font-semibold">Weight: {product.weight}</span>
                        )}
                        {product.dimensions && (
                          <span className="text-black font-semibold">Size: {product.dimensions}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Add to Cart Button (only on center item) - Bottom Right */}
                  {index === currentIndex && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={handleAddToCart}
                      className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 px-3 py-2 sm:px-6 sm:py-3 text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg ${
                        isAddingToCart 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-[#1C1E21] hover:bg-black'
                      }`}
                    >
                      {isAddingToCart ? '✓ Added!' : 'Add to Cart'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#1C1E21] hover:bg-gray-50 transition-all z-10 shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#1C1E21] hover:bg-gray-50 transition-all z-10 shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoRotating(false); // Stop auto-rotation on dot click
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-[#1C1E21] w-8' 
                  : 'bg-[#D1D5DB] hover:bg-[#5F6368]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-sm sm:max-w-2xl md:max-w-4xl w-full mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="bg-white/10 rounded-lg p-2 sm:p-4 relative">
              <div className="relative h-[300px] sm:h-[450px] md:h-[600px] flex items-center justify-center">
                {selectedProduct.images[currentImageIndex].startsWith('/') || selectedProduct.images[currentImageIndex].startsWith('http') ? (
                  <img 
                    src={selectedProduct.images[currentImageIndex]} 
                    alt={`${selectedProduct.title} - Image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-9xl">{selectedProduct.images[currentImageIndex]}</span>
                )}

                {/* Navigation Arrows */}
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-600/80 hover:bg-gray-700/90 flex items-center justify-center text-white transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-600/80 hover:bg-gray-700/90 flex items-center justify-center text-white transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {selectedProduct.images.length > 1 && (
                <div className="mt-2 sm:mt-4 flex gap-1 sm:gap-2 justify-center overflow-x-auto pb-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded border-2 transition-all ${
                        idx === currentImageIndex 
                          ? 'border-[#4A90E2] ring-2 ring-[#4A90E2]/30' 
                          : 'border-[#D1D5DB] hover:border-[#5F6368]'
                      }`}
                    >
                      {img.startsWith('/') || img.startsWith('http') ? (
                        <img 
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-2xl">{img}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              <div className="mt-2 text-center text-sm text-[#5F6368]">
                {currentImageIndex + 1} / {selectedProduct.images.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white/50 backdrop-blur-md shadow-2xl z-50 overflow-y-auto overflow-x-hidden">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1C1E21]">Cart {cartCount} {cartCount === 1 ? 'item' : 'items'}</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="mb-4 sm:mb-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">Your cart is empty</p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                          {item.images && item.images[0] && (item.images[0].startsWith('/') || item.images[0].startsWith('http')) ? (
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-xl sm:text-2xl">{item.images?.[0] || '📦'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#1C1E21] truncate">{item.title}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">₹{item.price} each</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(idx)}
                            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                            title="Decrease quantity"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#1C1E21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="font-bold text-[#1C1E21] min-w-[16px] sm:min-w-[20px] text-center text-xs sm:text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(idx)}
                            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                            title="Increase quantity"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#1C1E21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              {cartItems.length > 0 && (
                <>
                  <div className="border-t border-gray-300 pt-3 sm:pt-4 mb-4 sm:mb-6">
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#1C1E21] font-medium">Subtotal</span>
                        <span className="font-semibold">₹{calculateTotal().subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1E21] font-medium">Delivery Charge</span>
                        <span className="font-semibold">₹{calculateTotal().deliveryCharge}</span>
                      </div>
                      {calculateTotal().discountPercent > 0 && (
                        <div className="flex justify-between text-green-800">
                          <span className="font-bold">Discount ({calculateTotal().discountPercent}%)</span>
                          <span className="font-bold">-₹{calculateTotal().discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base sm:text-lg font-bold text-[#1C1E21] pt-1.5 sm:pt-2 border-t">
                        <span>Total</span>
                        <span>₹{calculateTotal().total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info Form */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1C1E21] mb-2 sm:mb-3">Customer Details</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {/* Name and Phone on same line */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={customerInfo.name}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 50);
                            setCustomerInfo({...customerInfo, name: value});
                          }}
                          required
                          maxLength={50}
                          className="flex-1 min-w-0 px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 text-[#1C1E21] placeholder:text-gray-500 font-medium"
                        />
                        <input
                          type="tel"
                          placeholder="Phone *"
                          value={customerInfo.phone}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Ensure +91 space prefix
                            if (!value.startsWith('+91 ')) {
                              value = '+91 ';
                            }
                            // Only allow numbers after +91 space
                            const numbers = value.slice(4).replace(/\D/g, '').slice(0, 10);
                            setCustomerInfo({...customerInfo, phone: '+91 ' + numbers});
                          }}
                          required
                          pattern="\+91 [0-9]{10}"
                          className="flex-1 min-w-0 px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 text-[#1C1E21] placeholder:text-gray-500 font-medium"
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={customerInfo.email}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 100);
                          setCustomerInfo({...customerInfo, email: value});
                        }}
                        required
                        maxLength={100}
                        className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 text-[#1C1E21] placeholder:text-gray-500 font-medium"
                      />
                      <textarea
                        placeholder="Delivery Address *"
                        value={customerInfo.address}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 500);
                          setCustomerInfo({...customerInfo, address: value});
                        }}
                        required
                        maxLength={500}
                        rows={3}
                        className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 resize-none text-[#1C1E21] placeholder:text-gray-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button 
                    onClick={() => {
                      const total = calculateTotal();
                      const itemsList = cartItems.map((item, idx) => 
                        `${idx + 1}. ${item.title} - Qty: ${item.quantity} - ₹${(item.price || 0) * item.quantity}`
                      ).join('%0A');
                      
                      const message = `*New Order from Website*%0A%0A` +
                        `*Customer Details:*%0A` +
                        `Name: ${customerInfo.name}%0A` +
                        `Phone: ${customerInfo.phone}%0A` +
                        `Email: ${customerInfo.email}%0A` +
                        `Address: ${customerInfo.address}%0A%0A` +
                        `*Order Items:*%0A${itemsList}%0A%0A` +
                        `*Order Summary:*%0A` +
                        `Subtotal: ₹${total.subtotal}%0A` +
                        `Delivery: ₹${total.deliveryCharge}%0A` +
                        (total.discountPercent > 0 ? `Discount (${total.discountPercent}%): -₹${total.discount}%0A` : '') +
                        `*Total: ₹${total.total}*`;
                      
                      window.open(`https://wa.me/message/6G7MZ6EIVUZ6B1?text=${message}`, '_blank');
                    }}
                    disabled={!customerInfo.name || !customerInfo.email || customerInfo.phone.length !== 14 || !customerInfo.address}
                    className="w-full py-2.5 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Place Order on WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}