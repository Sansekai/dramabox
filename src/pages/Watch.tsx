import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useDramaDetail, useEpisodes } from "@/hooks/useDramaDetail";
import { ChevronLeft, ChevronRight, Play, Loader2, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const EPISODES_PER_PAGE = 30;

export default function Watch() {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [quality, setQuality] = useState(720);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const { data: detailData, isLoading: detailLoading } = useDramaDetail(bookId || "");
  const { data: episodes, isLoading: episodesLoading } = useEpisodes(bookId || "");

  // Initialize from URL params
  useEffect(() => {
    const ep = parseInt(searchParams.get("ep") || "0", 10);
    if (ep >= 0) {
      setCurrentEpisode(ep);
      setCurrentPage(Math.floor(ep / EPISODES_PER_PAGE));
    }
  }, [searchParams]);

  // Update URL when episode changes
  const handleEpisodeChange = (index: number) => {
    setCurrentEpisode(index);
    setSearchParams({ ep: index.toString() });
  };

  if (detailLoading || episodesLoading) {
    return <WatchSkeleton />;
  }

  if (!detailData?.data || !episodes) {
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

  const { book } = detailData.data;
  const currentEpisodeData = episodes[currentEpisode];
  
  // Get video URL with selected quality
  const getVideoUrl = () => {
    if (!currentEpisodeData) return "";
    const defaultCdn = currentEpisodeData.cdnList.find((cdn) => cdn.isDefault === 1) || currentEpisodeData.cdnList[0];
    if (!defaultCdn) return "";
    
    const videoPath = defaultCdn.videoPathList.find((v) => v.quality === quality) 
      || defaultCdn.videoPathList.find((v) => v.isDefault === 1)
      || defaultCdn.videoPathList[0];
    
    return videoPath?.videoPath || "";
  };

  // Pagination
  const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);
  const startIndex = currentPage * EPISODES_PER_PAGE;
  const endIndex = Math.min(startIndex + EPISODES_PER_PAGE, episodes.length);
  const currentPageEpisodes = episodes.slice(startIndex, endIndex);

  const availableQualities = currentEpisodeData?.cdnList[0]?.videoPathList
    .filter((v) => v.isVipEquity === 0)
    .map((v) => v.quality) || [720];

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to={`/detail/${bookId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali ke Detail</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Video Player */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
              {currentEpisodeData ? (
                <video
                  key={`${currentEpisode}-${quality}`}
                  src={getVideoUrl()}
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={currentEpisodeData.chapterImg}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              )}

              {/* Quality Selector */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {showQualityMenu && (
                  <div className="absolute top-12 right-0 glass rounded-lg py-2 min-w-[100px] shadow-xl">
                    {availableQualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuality(q);
                          setShowQualityMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${
                          quality === q ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {q}p
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Episode Info */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold font-display gradient-text">
                    {book.bookName}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {currentEpisodeData?.chapterName || `Episode ${currentEpisode + 1}`}
                  </p>
                </div>

                {/* Episode Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEpisodeChange(Math.max(0, currentEpisode - 1))}
                    disabled={currentEpisode === 0}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {currentEpisode + 1} / {episodes.length}
                  </span>
                  <button
                    onClick={() => handleEpisodeChange(Math.min(episodes.length - 1, currentEpisode + 1))}
                    disabled={currentEpisode === episodes.length - 1}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Episode List */}
          <div className="glass rounded-xl p-4 h-fit lg:max-h-[calc(100vh-140px)] lg:overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Daftar Episode</h2>
              <span className="text-sm text-muted-foreground">
                {episodes.length} Episode
              </span>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b border-border/50">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Episode Range Label */}
            <p className="text-xs text-muted-foreground text-center mb-3">
              Episode {startIndex + 1} - {endIndex}
            </p>

            {/* Episode Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 overflow-y-auto max-h-[400px] lg:max-h-[calc(100vh-340px)] pr-1">
              {currentPageEpisodes.map((episode) => (
                <button
                  key={episode.chapterId}
                  onClick={() => handleEpisodeChange(episode.chapterIndex)}
                  className={`relative aspect-square rounded-lg font-medium text-sm transition-all hover:scale-105 ${
                    currentEpisode === episode.chapterIndex
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {episode.chapterIndex + 1}
                  {currentEpisode === episode.chapterIndex && (
                    <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function WatchSkeleton() {
  return (
    <main className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    </main>
  );
}
