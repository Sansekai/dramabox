"use client";

import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useForYouDramas } from "@/hooks/useDramas";

export default function HomeContent() {
  const { data: dramas, isLoading, error } = useForYouDramas();

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Untuk Kamu"
        description="Drama pilihan yang dipersonalisasi khusus untukmu. Temukan cerita seru yang sesuai selera!"
        icon="sparkles"
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
}
