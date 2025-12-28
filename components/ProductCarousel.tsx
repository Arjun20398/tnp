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
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const dragStartX = useRef(0);

  const handleAddToCart = () => {
    const currentProduct = products[currentIndex];
    setCartItems(prev => [...prev, currentProduct]);
    setCartCount(prev => prev + 1);
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setCartCount(prev => prev - 1);
  };

  const calculateDiscount = (itemCount: number) => {
    if (itemCount >= 3) return 15;
    if (itemCount >= 2) return 10;
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const deliveryCharge = 75;
    const discountPercent = calculateDiscount(cartItems.length);
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
      return {
        scale: 0.7,
        opacity: 0.6,
        x: -500, // Move to the left
        z: -200, // Move back slightly
        rotateY: -35, // Angle towards center
        blur: 1
      };
    }
    
    // Right card (position = 1)
    if (position === 1) {
      return {
        scale: 0.7,
        opacity: 0.6,
        x: 500, // Move to the right
        z: -200, // Move back slightly
        rotateY: 35, // Angle towards center
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
                  marginLeft: '-385px',
                  marginTop: '-220px',
                  zIndex: position === 0 ? 10 : Math.max(0, 5 - absDiff),
                  pointerEvents: absDiff > 1 ? 'none' : 'auto'
                }}
              >
                <div className="w-[770px] h-[440px] rounded-2xl bg-white/70 backdrop-blur-md border border-[#D1D5DB] p-8 flex flex-col items-center gap-4 shadow-2xl relative">
                  {/* Product Image/Icon */}
                  <div 
                    className="flex-shrink-0 w-[320px] h-[200px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
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
                    <h3 className="text-xl font-bold text-[#1C1E21] text-center">
                      {product.title}
                    </h3>
                    
                    {/* Product Description */}
                    <p className="text-black text-sm leading-relaxed font-semibold max-w-[500px] mx-auto text-center">
                      {product.description}
                    </p>
                    
                    {/* Price and Weight */}
                    {(product.price || product.weight) && (
                      <div className="flex items-center justify-center gap-4 text-base">
                        {product.price && (
                          <span className="font-bold text-[#1C1E21] text-xl">₹{product.price}</span>
                        )}
                        {product.weight && (
                          <span className="text-black font-semibold">Weight: {product.weight}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Add to Cart Button (only on center item) - Bottom Right */}
                  {index === currentIndex && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={handleAddToCart}
                      className="absolute bottom-4 right-4 px-6 py-3 bg-[#1C1E21] text-white text-sm font-medium rounded-lg hover:bg-black transition-all shadow-md hover:shadow-lg"
                    >
                      Add to Cart
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
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="bg-white/10 rounded-lg p-4 relative">
              <div className="relative h-[600px] flex items-center justify-center">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-600/80 hover:bg-gray-700/90 flex items-center justify-center text-white transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-600/80 hover:bg-gray-700/90 flex items-center justify-center text-white transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {selectedProduct.images.length > 1 && (
                <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-all ${
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
          <div className="fixed right-0 top-0 h-full w-[450px] bg-white/50 backdrop-blur-md shadow-2xl z-50 overflow-y-auto overflow-x-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1C1E21]">Cart {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</h2>
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
              <div className="mb-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg relative">
                        <div className="w-16 h-16 flex-shrink-0">
                          {item.images && item.images[0] && (item.images[0].startsWith('/') || item.images[0].startsWith('http')) ? (
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl">{item.images?.[0] || '📦'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-[#1C1E21]">{item.title}</h4>
                        </div>
                        <span className="font-bold text-[#1C1E21]">₹{item.price}</span>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              {cartItems.length > 0 && (
                <>
                  <div className="border-t border-gray-300 pt-4 mb-6">
                    <div className="space-y-2 text-sm">
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
                      <div className="flex justify-between text-lg font-bold text-[#1C1E21] pt-2 border-t">
                        <span>Total</span>
                        <span>₹{calculateTotal().total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info Form */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#1C1E21] mb-3">Customer Details</h3>
                    <div className="space-y-3">
                      {/* Name and Phone on same line */}
                      <div className="flex gap-3 w-full">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 text-[#1C1E21] placeholder:text-gray-500 font-medium"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 text-[#1C1E21] placeholder:text-gray-500 font-medium"
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 text-[#1C1E21] placeholder:text-gray-500 font-medium"
                      />
                      <textarea
                        placeholder="Delivery Address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white/70 resize-none text-[#1C1E21] placeholder:text-gray-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button 
                    onClick={() => alert('Payment processing...')}
                    disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}
                    className="w-full py-3 bg-[#1C1E21] text-white font-semibold rounded-lg hover:bg-black transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                  >
                    Proceed to Payment
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