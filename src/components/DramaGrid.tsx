import { DramaCard } from "./DramaCard";
import { DramaCardSkeleton } from "./DramaCardSkeleton";
import type { Drama } from "@/types/drama";

interface DramaGridProps {
  dramas?: Drama[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export function DramaGrid({ dramas, isLoading, title, subtitle }: DramaGridProps) {
  return (
    <section className="py-8">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <DramaCardSkeleton key={i} index={i} />
            ))
          : dramas?.map((drama, index) => (
              <DramaCard key={drama.bookId} drama={drama} index={index} />
            ))}
      </div>

      {!isLoading && dramas?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Tidak ada drama ditemukan</p>
        </div>
      )}
    </section>
  );
}
