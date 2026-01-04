'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate shooting stars with varied properties
    const generateStars = () => {
      const colors = [
        '#60A5FA', // Blue
        '#34D399', // Green
        '#F472B6', // Pink
        '#FBBF24', // Yellow
        '#A78BFA', // Purple
        '#FB923C', // Orange
        '#22D3EE', // Cyan
        '#FFFFFF', // White
      ];
      
      const newStars: Star[] = [];
      for (let i = 0; i < 8; i++) {
        newStars.push({
          id: Math.random(),
          left: Math.random() * 100,
          top: Math.random() * 60, // Spread across more of the screen
          delay: 0, // No delay
          duration: 3 + Math.random() * 2, // 3-5s (50% slower)
          size: 0.4 + Math.random() * 0.35, // Varied sizes (50% of original)
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Regenerate stars more frequently
    const interval = setInterval(() => {
      generateStars();
    }, 3000); // Every 3 seconds for continuous flow

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shootingStar {
            0% {
              transform: rotate(45deg) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: rotate(45deg) translateX(400px);
              opacity: 0;
            }
          }

          .shooting-star-container {
            animation: shootingStar 2.5s ease-in-out forwards;
          }

          .star-core {
            box-shadow: 
              0 0 6px 2px rgba(255, 255, 255, 0.8),
              0 0 12px 4px rgba(255, 255, 255, 0.4),
              0 0 20px 6px rgba(255, 255, 255, 0.2);
          }

        `
      }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute shooting-star-container"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          >
            {/* Star tail - extends behind */}
            <div 
              className="absolute"
              style={{
                width: `${100 * star.size}px`,
                height: `${2 * star.size}px`,
                right: `${3 * star.size}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '100% 0 0 100%',
                background: `linear-gradient(
                  to right,
                  transparent 0%,
                  ${star.color}33 20%,
                  ${star.color}99 40%,
                  ${star.color}CC 70%,
                  ${star.color} 100%
                )`,
                boxShadow: `0 0 8px 2px ${star.color}4D`,
              }}
            />
            
            {/* Star core - bright center point */}
            <div 
              className="star-core absolute rounded-full"
              style={{
                width: `${3 * star.size}px`,
                height: `${3 * star.size}px`,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: star.color,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
