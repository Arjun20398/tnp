'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Experience the future of technology with cutting-edge gadgets designed for the modern hero
          </motion.p>

        </motion.div>
      </div>

    </section>
  );
}
