import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { ArchitectureVisualizer } from '@/components/landing/ArchitectureVisualizer';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureShowcase />
        <ArchitectureVisualizer />
      </main>
      <LandingFooter />
    </div>
  );
}
