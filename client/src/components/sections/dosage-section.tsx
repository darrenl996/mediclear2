import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "lucide-react";
import { type MedicationSearchResult } from "@shared/schema";
import { formatMedicationText, formatParagraphs, simplifyMedicalTerms } from "@/lib/utils";

interface DosageSectionProps {
  medication: MedicationSearchResult;
}

export default function DosageSection({ medication }: DosageSectionProps) {
  const dosageInfo = formatMedicationText(medication.dosage_and_administration);
  
  // Format dosage information into paragraphs
  const dosageParagraphs = formatParagraphs(dosageInfo);
  
  // Simplify medical terms
  const simplifiedDosageParagraphs = dosageParagraphs.map(p => simplifyMedicalTerms(p));
  
  // Try to parse out specific dosage information
  const adultDosage: string[] = [];
  const pediatricDosage: string[] = [];
  const specialDosage: string[] = [];
  
  simplifiedDosageParagraphs.forEach(paragraph => {
    if (paragraph.toLowerCase().includes("adult") ||
        (paragraph.toLowerCase().includes("dose") && !paragraph.toLowerCase().includes("child"))) {
      adultDosage.push(paragraph);
    } else if (paragraph.toLowerCase().includes("child") || 
               paragraph.toLowerCase().includes("pediatric") || 
               paragraph.toLowerCase().includes("infant")) {
      pediatricDosage.push(paragraph);
    } else if (paragraph.toLowerCase().includes("elder") || 
               paragraph.toLowerCase().includes("senior") || 
               paragraph.toLowerCase().includes("geriatric") || 
               paragraph.toLowerCase().includes("renal") || 
               paragraph.toLowerCase().includes("kidney") || 
               paragraph.toLowerCase().includes("liver") || 
               paragraph.toLowerCase().includes("hepatic")) {
      specialDosage.push(paragraph);
    } else {
      // If we can't categorize it, put it in adult dosage
      adultDosage.push(paragraph);
    }
  });

  return (
    <section id="dosage">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
        <Package className="h-6 w-6 text-green-500 mr-2" />
        Dosage Information
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-blue-800 font-medium">
            Individual dosing may vary based on your condition and response
          </p>
        </div>
        
        {adultDosage.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Adult Dosage
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {adultDosage.map((dosage, index) => (
                <li key={index}>{dosage}</li>
              ))}
            </ul>
          </div>
        )}
        
        {pediatricDosage.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pediatric Dosage
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {pediatricDosage.map((dosage, index) => (
                <li key={index}>{dosage}</li>
              ))}
            </ul>
          </div>
        )}
        
        {specialDosage.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Special Dosing Considerations
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {specialDosage.map((dosage, index) => (
                <li key={index}>{dosage}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* If no specific information available */}
        {dosageParagraphs.length === 0 && (
          <div className="bg-gray-50 p-5 rounded-lg text-center">
            <p className="text-gray-700">
              Specific dosage information is not available for this medication. 
              Please consult your healthcare provider or pharmacist for proper dosing.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
