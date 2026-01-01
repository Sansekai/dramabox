import { useQuery } from "@tanstack/react-query";
import type { DramaDetailResponse, Episode } from "@/types/drama";

const API_BASE = "https://api.sansekai.my.id/api/dramabox";

async function fetchDramaDetail(bookId: string): Promise<DramaDetailResponse> {
  const response = await fetch(`${API_BASE}/detail?bookId=${bookId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch drama detail");
  }
  return response.json();
}

async function fetchAllEpisodes(bookId: string): Promise<Episode[]> {
  const response = await fetch(`${API_BASE}/allepisode?bookId=${bookId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }
  return response.json();
}

export function useDramaDetail(bookId: string) {
  return useQuery({
    queryKey: ["drama", "detail", bookId],
    queryFn: () => fetchDramaDetail(bookId),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEpisodes(bookId: string) {
  return useQuery({
    queryKey: ["drama", "episodes", bookId],
    queryFn: () => fetchAllEpisodes(bookId),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5,
  });
}
