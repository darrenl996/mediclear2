import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { type MedicationSearchResult } from "@shared/schema";

// Hook for searching medications
export const useSearchMedications = (query: string) => {
  return useQuery({
    queryKey: ['/api/drugs/search', query],
    queryFn: async () => {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          return [];
        }
        throw new Error(`Error searching medications: ${res.statusText}`);
      }
      
      return res.json() as Promise<MedicationSearchResult[]>;
    },
    enabled: query.length > 2, // Only run query when user has typed at least 3 characters
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for getting medication suggestions (autocomplete)
export const useMedicationSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['/api/drugs/suggestions', query],
    queryFn: async () => {
      const res = await fetch(`/api/drugs/suggestions?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        return [];
      }
      
      return res.json();
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for getting medication details by ID
export const useMedicationDetails = (id: string | null) => {
  return useQuery({
    queryKey: ['/api/drugs', id],
    queryFn: async () => {
      if (!id) return null;
      
      const res = await fetch(`/api/drugs/${id}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error(`Error fetching medication details: ${res.statusText}`);
      }
      
      return res.json() as Promise<MedicationSearchResult>;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
