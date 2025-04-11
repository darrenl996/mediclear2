import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { type MedicationSearchResult } from "@shared/schema";
import { formatMedicationText, formatParagraphs, simplifyMedicalTerms } from "@/lib/utils";

interface SideEffectsSectionProps {
  medication: MedicationSearchResult;
}

export default function SideEffectsSection({ medication }: SideEffectsSectionProps) {
  const sideEffects = formatMedicationText(medication.side_effects || medication.adverse_reactions);
  
  // Format side effects information into paragraphs
  const sideEffectsParagraphs = formatParagraphs(sideEffects);
  
  // Categorize side effects by severity if possible
  let severeEffects: string[] = [];
  let commonEffects: string[] = [];
  let lessCommonEffects: string[] = [];
  
  // Parse out different categories of side effects
  sideEffectsParagraphs.forEach(paragraph => {
    const lowerParagraph = paragraph.toLowerCase();
    
    if (lowerParagraph.includes("emergency") || 
        lowerParagraph.includes("severe") || 
        lowerParagraph.includes("serious") || 
        lowerParagraph.includes("call doctor immediately") ||
        lowerParagraph.includes("seek medical help")) {
      severeEffects.push(simplifyMedicalTerms(paragraph));
    } else if (lowerParagraph.includes("common") || 
               lowerParagraph.includes("frequently") || 
               lowerParagraph.includes("most patients")) {
      commonEffects.push(simplifyMedicalTerms(paragraph));
    } else if (lowerParagraph.includes("less common") || 
               lowerParagraph.includes("rare") || 
               lowerParagraph.includes("infrequent")) {
      lessCommonEffects.push(simplifyMedicalTerms(paragraph));
    } else {
      // Default to common effects if we can't categorize
      commonEffects.push(simplifyMedicalTerms(paragraph));
    }
  });
  
  // If no categorization was possible, try to extract from the text
  if (severeEffects.length === 0 && commonEffects.length === 0 && lessCommonEffects.length === 0 && sideEffects) {
    // Extract lists of side effects
    const lines = sideEffects.split(/[.;:]/);
    
    // Try to categorize based on keywords
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const lowerLine = trimmedLine.toLowerCase();
      if (lowerLine.includes("emergency") || 
          lowerLine.includes("severe") || 
          lowerLine.includes("serious") || 
          lowerLine.includes("immediately") ||
          lowerLine.includes("call") ||
          lowerLine.includes("stop")) {
        severeEffects.push(simplifyMedicalTerms(trimmedLine));
      } else if (lowerLine.includes("common") || 
                 lowerLine.includes("frequent")) {
        commonEffects.push(simplifyMedicalTerms(trimmedLine));
      } else if (lowerLine.includes("less") || 
                 lowerLine.includes("rare") || 
                 lowerLine.includes("infrequent")) {
        lessCommonEffects.push(simplifyMedicalTerms(trimmedLine));
      } else {
        // Just add as common if no categorization is possible
        commonEffects.push(simplifyMedicalTerms(trimmedLine));
      }
    });
  }

  return (
    <section id="side-effects" className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            Side Effects
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 py-4">
          {severeEffects.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-red-600 flex items-center text-sm mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Seek Medical Help Immediately
              </h3>
              <ul className="list-disc pl-5 text-gray-700 font-body text-sm space-y-1">
                {severeEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
          
          {commonEffects.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-amber-600 flex items-center text-sm mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Common Side Effects
              </h3>
              <ul className="list-disc pl-5 text-gray-700 font-body text-sm space-y-1">
                {commonEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
          
          {lessCommonEffects.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-600 flex items-center text-sm mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Less Common Side Effects
              </h3>
              <ul className="list-disc pl-5 text-gray-700 font-body text-sm space-y-1">
                {lessCommonEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* If no side effects information available */}
          {severeEffects.length === 0 && commonEffects.length === 0 && lessCommonEffects.length === 0 && (
            <p className="text-gray-700 text-sm">
              Specific side effect information is not available for this medication. 
              All medications can cause side effects. Contact your healthcare provider if you notice any unusual symptoms.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
