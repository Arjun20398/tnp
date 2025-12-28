import dynamic from 'next/dynamic';
import ProductCarousel from '@/components/ProductCarousel';

// Dynamically import 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen fixed top-0 left-0 -z-10 bg-gradient-to-b from-gray-900 to-black" />
  ),
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Scene3D />
      <div className="relative z-10">
        <ProductCarousel />
      </div>
    </main>
  );
}
