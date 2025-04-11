import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/utils";

interface SearchbarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: any) => void;
  suggestions?: Array<{ id: string; text: string; subtext?: string }>;
  loading?: boolean;
  className?: string;
}

export function Searchbar({
  placeholder = "Search...",
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  loading = false,
  className = "",
}: SearchbarProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useRef(
    debounce((query: string) => {
      onSearch(query);
    }, 300)
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 1) {
      debouncedSearch(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setShowSuggestions(false);
  };

  // Handle clicks outside of the searchbar to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          ref={inputRef}
          className="pl-10 pr-20 py-6 text-base rounded-lg shadow-md"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button 
          type="submit" 
          className="absolute inset-y-0 right-0 rounded-l-none rounded-r-lg px-4"
          disabled={loading}
        >
          <span className="hidden sm:inline mr-2">Search</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="mt-1 shadow-lg rounded-md bg-white absolute z-10 w-full"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.text}</div>
              {suggestion.subtext && (
                <div className="text-sm text-gray-500">{suggestion.subtext}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && inputValue.length > 1 && (
        <div className="mt-1 shadow-lg rounded-md bg-white absolute z-10 w-full p-4 text-center">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2" />
          <span className="text-gray-500">Searching...</span>
        </div>
      )}
    </div>
  );
}
