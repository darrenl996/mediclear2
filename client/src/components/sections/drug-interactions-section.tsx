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
    <section id="interactions" className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <RefreshCcw className="h-5 w-5 text-primary-500 mr-2" />
            Drug Interactions
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 py-4">
          <p className="text-sm text-gray-700 mb-4 font-body">
            This medication may interact with many other drugs. Tell your doctor about all medications you use.
          </p>
          
          <div className="space-y-3">
            {doNotUseWith.length > 0 && (
              <div className="bg-red-50 p-3 rounded">
                <h3 className="text-sm font-medium text-red-700 mb-1">Do Not Use With:</h3>
                <ul className="list-disc pl-5 text-sm text-red-700 font-body">
                  {doNotUseWith.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {useWithCaution.length > 0 && (
              <div className="bg-amber-50 p-3 rounded">
                <h3 className="text-sm font-medium text-amber-700 mb-1">Use With Caution:</h3>
                <ul className="list-disc pl-5 text-sm text-amber-700 font-body">
                  {useWithCaution.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {monitorWhenUsing.length > 0 && (
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Monitor When Using With:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 font-body">
                  {monitorWhenUsing.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* If no interaction information available */}
            {!interactions && (
              <p className="text-gray-700 text-sm">
                Specific drug interaction information is not available for this medication. 
                Always inform your healthcare provider about all medications, supplements, and herbal products you use.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
