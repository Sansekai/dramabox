"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useDramaDetail, useEpisodes } from "@/hooks/useDramaDetail";
import { ChevronLeft, ChevronRight, Play, Loader2, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EPISODES_PER_PAGE = 30;

export default function WatchPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [quality, setQuality] = useState(720);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    router.push(`/watch/${bookId}?ep=${index}`);
  };

  // All useMemo hooks must be called BEFORE any early returns
  const currentEpisodeData = useMemo(() => {
    if (!episodes) return null;
    return episodes[currentEpisode] || null;
  }, [episodes, currentEpisode]);

  const defaultCdn = useMemo(() => {
    if (!currentEpisodeData) return null;
    return (
      currentEpisodeData.cdnList.find((cdn) => cdn.isDefault === 1) || currentEpisodeData.cdnList[0] || null
    );
  }, [currentEpisodeData]);

  const availableQualities = useMemo(() => {
    const list = defaultCdn?.videoPathList
      ?.filter((v) => v.isVipEquity === 0)
      .map((v) => v.quality)
      .filter((q): q is number => typeof q === "number");

    const unique = Array.from(new Set(list && list.length ? list : [720]));
    // Sort descending so 1080p appears on top when available.
    return unique.sort((a, b) => b - a);
  }, [defaultCdn]);

  // Keep selected quality valid for the current episode; prefer the highest (e.g. 1080p).
  useEffect(() => {
    if (!availableQualities.length) return;
    if (!availableQualities.includes(quality)) {
      setQuality(availableQualities[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableQualities.join(",")]);

  // Pagination calculations
  const totalPages = useMemo(() => {
    if (!episodes) return 0;
    return Math.ceil(episodes.length / EPISODES_PER_PAGE);
  }, [episodes]);

  const startIndex = currentPage * EPISODES_PER_PAGE;
  const endIndex = useMemo(() => {
    if (!episodes) return 0;
    return Math.min(startIndex + EPISODES_PER_PAGE, episodes.length);
  }, [episodes, startIndex]);

  const currentPageEpisodes = useMemo(() => {
    if (!episodes) return [];
    return episodes.slice(startIndex, endIndex);
  }, [episodes, startIndex, endIndex]);

  // Get video URL with selected quality
  const getVideoUrl = () => {
    if (!currentEpisodeData || !defaultCdn) return "";

    const videoPath =
      defaultCdn.videoPathList.find((v) => v.quality === quality) ||
      defaultCdn.videoPathList.find((v) => v.isDefault === 1) ||
      defaultCdn.videoPathList[0];

    return videoPath?.videoPath || "";
  };

  const handleVideoEnded = () => {
    if (!episodes) return;
    const next = currentEpisode + 1;
    if (next <= episodes.length - 1) {
      handleEpisodeChange(next);
    }
  };

  // Now we can have early returns AFTER all hooks
  if (detailLoading || episodesLoading) {
    return (
      <main className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-32">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-muted border-t-primary animate-spin" />
            <div
              className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-r-secondary animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>
          <h2 className="text-xl font-bold text-foreground mt-8 mb-2 gradient-text">
            Sedang Memuat Drama
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            Mohon tunggu sebentar, kami sedang menyiapkan episode untukmu...
          </p>
        </div>
      </main>
    );
  }

  if (!detailData?.data || !episodes) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Drama tidak ditemukan</h2>
          <Link href="/" className="text-primary hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  const { book } = detailData.data;

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href={`/detail/${bookId}`}
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
                  ref={videoRef}
                  key={`${currentEpisode}-${quality}`}
                  src={getVideoUrl()}
                  controls
                  autoPlay
                  onEnded={handleVideoEnded}
                  className="w-full h-full"
                  poster={currentEpisodeData.chapterImg}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              )}

              {/* Quality Selector */}
              <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    className="max-h-[280px] overflow-y-auto"
                  >
                    {availableQualities.map((q) => (
                      <DropdownMenuItem
                        key={q}
                        onClick={() => setQuality(q)}
                        className={quality === q ? "text-primary font-semibold" : ""}
                      >
                        {q}p
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Episode Info */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold font-display gradient-text">{book.bookName}</h1>
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
              <span className="text-sm text-muted-foreground">{episodes.length} Episode</span>
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
                        currentPage === i ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
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
