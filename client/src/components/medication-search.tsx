import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchMedications, useMedicationSuggestions } from "@/hooks/use-fda-api";
import { debounce } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MedicationSearchProps {
  onSelectMedication: (medicationId: string) => void;
}

export function MedicationSearch({ onSelectMedication }: MedicationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get medication suggestions for autocomplete
  const { 
    data: suggestions = [], 
    isLoading: suggestionsLoading 
  } = useMedicationSuggestions(searchQuery);

  // Function to search medications
  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    error: searchError,
    refetch: refetchSearch
  } = useSearchMedications(searchQuery);

  // Create debounced version of search function
  const debouncedSearch = useRef(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300)
  ).current;

  // Handle search input change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    debouncedSearch(query);
    
    if (query.length > 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.length < 2) {
      toast({
        title: "Search query too short",
        description: "Please enter at least 2 characters to search.",
        variant: "destructive"
      });
      return;
    }
    
    setShowSuggestions(false);
    refetchSearch();
  };

  // Handle suggestion click
  const handleSuggestionClick = (id: string) => {
    setShowSuggestions(false);
    onSelectMedication(id);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle error state
  useEffect(() => {
    if (searchError) {
      toast({
        title: "Search Error",
        description: (searchError as Error)?.message || "Failed to search medications",
        variant: "destructive"
      });
    }
  }, [searchError, toast]);

  return (
    <div className="max-w-3xl mx-auto relative">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          ref={searchInputRef}
          className="pl-10 pr-20 py-6 text-lg rounded-lg shadow-md"
          placeholder="Search for a medication (e.g., 'Lisinopril', 'Metformin')"
          onChange={handleSearchInput}
          defaultValue={searchQuery}
        />
        <Button 
          type="submit" 
          className="absolute inset-y-0 right-0 rounded-l-none rounded-r-lg px-4"
          disabled={searchLoading}
        >
          <span className="hidden sm:inline mr-2">Search</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="mt-1 shadow-lg rounded-md bg-white absolute z-10 w-full"
        >
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              onClick={() => handleSuggestionClick(suggestion.id)}
            >
              <div className="font-medium">{suggestion.generic_name}</div>
              <div className="text-sm text-gray-500">
                {suggestion.purpose ? 
                  suggestion.purpose.substring(0, 60) + (suggestion.purpose.length > 60 ? '...' : '') : 
                  suggestion.brand_name ? `Brand name: ${suggestion.brand_name}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Loading spinner for suggestions */}
      {suggestionsLoading && searchQuery.length > 2 && (
        <div className="mt-1 shadow-lg rounded-md bg-white absolute z-10 w-full p-4 text-center">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2" />
          <span className="text-gray-500">Loading suggestions...</span>
        </div>
      )}
    </div>
  );
}
