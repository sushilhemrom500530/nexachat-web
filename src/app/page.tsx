import {
  HomeNavbar,
  HeroSection,
  FeatureShowcase,
  ArchitectureVisualizer,
  HomeFooter,
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <HomeNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureShowcase />
        <ArchitectureVisualizer />
      </main>
      <HomeFooter />
    </div>
  );
}
