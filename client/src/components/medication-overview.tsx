import { Card } from "@/components/ui/card";
import MedicationHeader from "./medication-header";
import { type MedicationSearchResult } from "@shared/schema";
import { formatMedicationText, simplifyMedicalTerms } from "@/lib/utils";

interface MedicationOverviewProps {
  medication: MedicationSearchResult;
}

export default function MedicationOverview({ medication }: MedicationOverviewProps) {
  const brandNames = Array.isArray(medication.brand_name) 
    ? medication.brand_name.join(', ')
    : medication.brand_name || '';
  
  const purpose = formatMedicationText(medication.purpose || medication.indications_and_usage);
  const simplifiedPurpose = simplifyMedicalTerms(purpose);
  
  return (
    <section className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <MedicationHeader medication={medication} />
        
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Generic Name: <span className="font-medium">{medication.generic_name}</span></span>
            </div>
            
            {brandNames && (
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Brand Names: <span className="font-medium">{brandNames}</span></span>
              </div>
            )}
            
            {medication.drug_class && (
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Class: <span className="font-medium">{medication.drug_class}</span></span>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">What is this medication for?</h3>
            <p className="text-gray-700 font-body">
              {simplifiedPurpose || "Information about this medication's purpose is not available."}
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
