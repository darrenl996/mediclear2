import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { type MedicationSearchResult } from "@shared/schema";

// Hook for searching medications
export const useSearchMedications = (query: string) => {
  return useQuery({
    queryKey: ['/api/drugs/search', query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) {
        return [];
      }
      
      console.log(`[FDA API] Searching for: "${query}"`);
      
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(query.trim())}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          console.log(`[FDA API] No results found for: "${query}"`);
          return [];
        }
        const errorMsg = `Error searching medications: ${res.statusText}`;
        console.error(`[FDA API] ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      const data = await res.json() as MedicationSearchResult[];
      console.log(`[FDA API] Found ${data.length} results for: "${query}"`);
      return data;
    },
    enabled: query.length > 2, // Only run query when user has typed at least 3 characters
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Limit retries to avoid flooding API
  });
};

// Hook for getting medication suggestions (autocomplete)
export const useMedicationSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['/api/drugs/suggestions', query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) {
        return [];
      }
      
      const res = await fetch(`/api/drugs/suggestions?q=${encodeURIComponent(query.trim())}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        return [];
      }
      
      return res.json();
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Limit retries to avoid flooding API
  });
};

// Hook for getting medication details by ID
export const useMedicationDetails = (id: string | null) => {
  return useQuery({
    queryKey: ['/api/drugs', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log(`[FDA API] Fetching details for medication ID: ${id}`);
      
      const res = await fetch(`/api/drugs/${id}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorMsg = `Error fetching medication details: ${res.statusText}`;
        console.error(`[FDA API] ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      const data = await res.json() as MedicationSearchResult;
      console.log(`[FDA API] Successfully retrieved details for: ${data.generic_name}`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
