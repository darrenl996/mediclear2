import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import { type MedicationSearchResult } from "@shared/schema";
import { formatMedicationText, formatParagraphs, simplifyMedicalTerms } from "@/lib/utils";

interface DrugInteractionsSectionProps {
  medication: MedicationSearchResult;
}

export default function DrugInteractionsSection({ medication }: DrugInteractionsSectionProps) {
  const interactions = formatMedicationText(medication.drug_interactions);
  
  // Format interactions into paragraphs
  const interactionParagraphs = formatParagraphs(interactions);
  
  // Try to categorize interactions if possible
  let doNotUseWith: string[] = [];
  let useWithCaution: string[] = [];
  let monitorWhenUsing: string[] = [];
  
  interactionParagraphs.forEach(paragraph => {
    const lowerParagraph = paragraph.toLowerCase();
    
    if (lowerParagraph.includes("do not use") || 
        lowerParagraph.includes("avoid") || 
        lowerParagraph.includes("contraindicated")) {
      doNotUseWith.push(simplifyMedicalTerms(paragraph));
    } else if (lowerParagraph.includes("caution") || 
               lowerParagraph.includes("careful") || 
               lowerParagraph.includes("may increase") || 
               lowerParagraph.includes("may decrease")) {
      useWithCaution.push(simplifyMedicalTerms(paragraph));
    } else {
      monitorWhenUsing.push(simplifyMedicalTerms(paragraph));
    }
  });

  return (
    <section id="interactions">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
        <RefreshCcw className="h-5 w-5 text-primary-500 mr-2" />
        Drug Interactions
      </h2>
      
      <p className="text-gray-700 mb-4">
        This medication may interact with other drugs. Always tell your doctor about all medications you use.
      </p>
      
      <div className="space-y-4">
        {doNotUseWith.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-700 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Do Not Use With
            </h3>
            <ul className="list-disc pl-5 text-red-800 space-y-2">
              {doNotUseWith.map((interaction, index) => (
                <li key={index}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {useWithCaution.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-700 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Use With Caution
            </h3>
            <ul className="list-disc pl-5 text-amber-800 space-y-2">
              {useWithCaution.map((interaction, index) => (
                <li key={index}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {monitorWhenUsing.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Monitor When Using With
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {monitorWhenUsing.map((interaction, index) => (
                <li key={index}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* If no interaction information available */}
        {doNotUseWith.length === 0 && useWithCaution.length === 0 && monitorWhenUsing.length === 0 && (
          <div className="bg-gray-50 p-5 rounded-lg text-center">
            <p className="text-gray-700">
              Specific drug interaction information is not available for this medication. 
              Always inform your healthcare provider about all medications, supplements, and herbal products you use.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
