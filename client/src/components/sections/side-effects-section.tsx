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
    <section id="side-effects">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
        Side Effects
      </h2>
      
      <div className="space-y-4">
        {severeEffects.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-700 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Seek Medical Help Immediately
            </h3>
            <ul className="list-disc pl-5 text-red-800 space-y-2">
              {severeEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        {commonEffects.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-700 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Common Side Effects
            </h3>
            <ul className="list-disc pl-5 text-amber-800 space-y-2">
              {commonEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        {lessCommonEffects.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Less Common Side Effects
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {lessCommonEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* If no side effects information available */}
        {severeEffects.length === 0 && commonEffects.length === 0 && lessCommonEffects.length === 0 && (
          <div className="bg-gray-50 p-5 rounded-lg text-center">
            <p className="text-gray-700">
              Specific side effect information is not available for this medication. 
              All medications can cause side effects. Contact your healthcare provider if you notice any unusual symptoms.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
