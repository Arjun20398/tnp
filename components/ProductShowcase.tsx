'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Quantum Core',
    description: 'Harness unlimited power with quantum processing',
    icon: Sparkles,
    color: 'from-cyber-blue to-cyan-400',
  },
  {
    id: 2,
    name: 'Thunder Gauntlet',
    description: 'Lightning-fast reflexes and precision control',
    icon: Zap,
    color: 'from-cyber-purple to-purple-400',
  },
  {
    id: 3,
    name: 'Aegis Shield',
    description: 'Impenetrable defense with adaptive technology',
    icon: Shield,
    color: 'from-cyber-pink to-pink-400',
  },
];

export default function ProductShowcase() {
  return (
    <section className="relative min-h-screen py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 glow-text">
            YOUR <span className="text-cyber-purple">ARSENAL</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cutting-edge technology designed to amplify your superhuman abilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 backdrop-blur-sm overflow-hidden">
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${product.color} mb-6`}>
                  <product.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cyber-blue transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 mb-6">
                  {product.description}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Power</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${product.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: '90%' }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Speed</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${product.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.6 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button className="mt-8 w-full py-3 border border-gray-700 rounded-lg font-semibold hover:border-cyber-blue hover:text-cyber-blue transition-all group-hover:shadow-lg group-hover:shadow-cyber-blue/20">
                  Activate
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
