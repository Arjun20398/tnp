import dynamic from 'next/dynamic';
import ProductCarousel from '@/components/ProductCarousel';
import ShootingStars from '@/components/ShootingStars';

// Dynamically import Galaxy to avoid SSR issues
const Galaxy = dynamic(() => import('@/components/Galaxy'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen fixed top-0 left-0 -z-10 bg-gradient-to-b from-gray-900 to-black" />
  ),
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Galaxy Background */}
      <div className="fixed inset-0 -z-10">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.5}
          saturation={0.8}
          hueShift={240}
          transparent={true}
          speed={0.5}
          starSpeed={0.25}
          rotationSpeed={0.05}
        />
      </div>
      
      <ShootingStars />
      <div className="relative z-10">
        <ProductCarousel />
      </div>
    </main>
  );
}
