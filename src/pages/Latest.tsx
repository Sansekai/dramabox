import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useLatestDramas } from "@/hooks/useDramas";

const Latest = () => {
  const { data: dramas, isLoading, error } = useLatestDramas();

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Drama Terbaru"
        description="Update terbaru drama yang baru saja rilis. Jangan sampai ketinggalan!"
        icon="clock"
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

export default Latest;
