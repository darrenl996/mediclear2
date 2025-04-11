import { useState } from "react";
import { MedicationSearch } from "@/components/medication-search";
import MedicationDetails from "@/components/medication-details";
import { useSearchMedications } from "@/hooks/use-fda-api";
import { MedicationCard } from "@/components/ui/medication-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  
  const { 
    data: searchResults = [], 
    isLoading: searchLoading, 
    error: searchError,
    refetch: refetchSearch
  } = useSearchMedications(searchTerm);

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim().length >= 2) {
      // Clear any selected medication when performing a new search
      setSelectedMedicationId(null);
      setSearchTerm(searchValue.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelectMedication = (medicationId: string) => {
    setSelectedMedicationId(medicationId);
    // Scroll to top when a medication is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Add a "Back to results" function
  const handleBackToResults = () => {
    setSelectedMedicationId(null);
  };
  
  // Add a "Clear search" function for better UX
  const handleClearSearch = () => {
    setSearchValue("");
    setSearchTerm("");
    setSelectedMedicationId(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Understand Your Medications
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find clear, easy-to-understand information about your medications using FDA data.
        </p>
      </section>

      {/* Search Bar */}
      <section className="mb-10">
        <form onSubmit={handleSubmitSearch} className="relative max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-20 py-6 text-lg rounded-lg shadow-md w-full focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all"
            placeholder="Search for a medication (e.g., 'Aspirin', 'Ibuprofen', 'Tylenol')"
            onChange={handleSearchChange}
            value={searchValue}
            aria-label="Search for medications"
          />
          <button 
            type="submit" 
            className="absolute inset-y-0 right-0 rounded-l-none rounded-r-lg px-4 bg-primary text-white font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all"
            disabled={searchLoading}
            aria-label="Search"
          >
            <span className="hidden sm:inline mr-2">Search</span>
            {searchLoading ? (
              <div className="h-5 w-5 inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </form>
      </section>

      {/* Loading State */}
      {searchLoading && searchTerm.length > 0 && (
        <div className="flex flex-col items-center py-10 bg-white rounded-lg shadow-sm max-w-md mx-auto">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4 mt-4"></div>
          <p className="text-gray-700 mb-4">Searching medication database...</p>
        </div>
      )}

      {/* Error State */}
      {searchError && (
        <Alert variant="destructive" className="max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(searchError as Error)?.message || "Unable to retrieve medication information. Please try again later."}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!searchLoading && searchTerm.length > 0 && searchResults.length === 0 && !searchError && (
        <div className="text-center py-10 max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No medications found</h3>
          <p className="mt-1 text-gray-500">Try searching for a different medication name.</p>
          <div className="mt-4">
            <button 
              onClick={handleClearSearch} 
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Selected Medication Details */}
      {selectedMedicationId && (
        <>
          <div className="max-w-3xl mx-auto mb-6">
            <button 
              onClick={handleBackToResults} 
              className="flex items-center text-primary-600 hover:text-primary-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to search results
            </button>
          </div>
          <MedicationDetails medicationId={selectedMedicationId} />
        </>
      )}

      {/* Search Results */}
      {!selectedMedicationId && searchResults.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results <span className="text-gray-500">({searchResults.length} medications found)</span>
            </h3>
            <button 
              onClick={handleClearSearch} 
              className="text-sm text-gray-600 hover:text-primary-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear search
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onClick={() => handleSelectMedication(medication.id || "")}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
