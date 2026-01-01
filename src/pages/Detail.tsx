import { useParams, Link, useNavigate } from "react-router-dom";
import { useDramaDetail } from "@/hooks/useDramaDetail";
import { Play, Eye, Heart, Calendar, ChevronLeft, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Detail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDramaDetail(bookId || "");

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Drama tidak ditemukan</h2>
          <Link to="/" className="text-primary hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  const { book, recommends } = data.data;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section with Cover */}
      <div className="relative">
        {/* Background Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={book.cover}
            alt=""
            className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            {/* Cover */}
            <div className="relative group">
              <img
                src={book.cover}
                alt={book.bookName}
                className="w-full max-w-[300px] mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <Link
                  to={`/watch/${book.bookId}`}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Tonton Sekarang
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-display gradient-text mb-4">
                  {book.bookName}
                </h1>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(book.viewCount)} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(book.followCount)} followers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Play className="w-4 h-4" />
                    <span>{book.chapterCount} Episode</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{book.shelfTime?.split(" ")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {book.tags?.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
                {book.typeTwoNames?.map((type) => (
                  <span key={type} className="tag-pill bg-primary/20 text-primary">
                    {type}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="glass rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2">Sinopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.introduction}
                </p>
              </div>

              {/* Performers */}
              {book.performerList && book.performerList.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Pemeran
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {book.performerList.map((performer) => (
                      <div
                        key={performer.performerId}
                        className="flex items-center gap-2 glass rounded-full pr-4 pl-1 py-1"
                      >
                        <img
                          src={performer.performerAvatar}
                          alt={performer.performerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{performer.performerName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Watch Button */}
              <Link
                to={`/watch/${book.bookId}`}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 shadow-lg"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Play className="w-5 h-5 fill-current" />
                Mulai Menonton
              </Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
