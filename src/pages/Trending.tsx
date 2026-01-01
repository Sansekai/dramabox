import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useTrendingDramas } from "@/hooks/useDramas";

const Trending = () => {
  const { data: dramas, isLoading, error } = useTrendingDramas();

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Terpopuler"
        description="Drama yang sedang viral dan banyak ditonton. Yang paling hot minggu ini! 🔥"
        icon="trending"
      />

      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Gagal memuat drama. Silakan coba lagi.</p>
          </div>
        )}

        <DramaGrid dramas={dramas} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default Trending;
