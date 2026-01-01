import { useQuery } from "@tanstack/react-query";
import type { Drama, SearchResult } from "@/types/drama";

const API_BASE = "https://api.sansekai.my.id/api/dramabox";

async function fetchDramas(endpoint: string): Promise<Drama[]> {
  const response = await fetch(`${API_BASE}/${endpoint}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dramas");
  }
  return response.json();
}

async function searchDramas(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Failed to search dramas");
  }
  return response.json();
}

export function useForYouDramas() {
  return useQuery({
    queryKey: ["dramas", "foryou"],
    queryFn: () => fetchDramas("foryou"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLatestDramas() {
  return useQuery({
    queryKey: ["dramas", "latest"],
    queryFn: () => fetchDramas("latest"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingDramas() {
  return useQuery({
    queryKey: ["dramas", "trending"],
    queryFn: () => fetchDramas("trending"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchDramas(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["dramas", "search", normalizedQuery],
    queryFn: () => searchDramas(normalizedQuery),
    enabled: normalizedQuery.length > 0,
    staleTime: 1000 * 60 * 2,
  });
}
