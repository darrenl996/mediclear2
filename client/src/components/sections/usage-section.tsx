import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { type MedicationSearchResult } from "@shared/schema";
import { formatMedicationText, formatParagraphs, simplifyMedicalTerms } from "@/lib/utils";

interface UsageSectionProps {
  medication: MedicationSearchResult;
}

export default function UsageSection({ medication }: UsageSectionProps) {
  const usageInfo = formatMedicationText(medication.usage_information || medication.when_using);
  const stopUse = formatMedicationText(medication.stop_use);
  
  // Format usage information into paragraphs
  const usageParagraphs = formatParagraphs(usageInfo);
  const stopUseParagraphs = formatParagraphs(stopUse);
  
  // Simplify medical terms
  const simplifiedUsageParagraphs = usageParagraphs.map(p => simplifyMedicalTerms(p));
  const simplifiedStopUseParagraphs = stopUseParagraphs.map(p => simplifyMedicalTerms(p));
  
  // Extract specific usage instructions if available
  const howToTake: string[] = [];
  const monitoring: string[] = [];
  const tips: string[] = [];
  
  simplifiedUsageParagraphs.forEach(paragraph => {
    if (paragraph.toLowerCase().includes("take") || 
        paragraph.toLowerCase().includes("use") || 
        paragraph.toLowerCase().includes("swallow") ||
        paragraph.toLowerCase().includes("administer")) {
      howToTake.push(paragraph);
    } else if (paragraph.toLowerCase().includes("monitor") || 
               paragraph.toLowerCase().includes("check") || 
               paragraph.toLowerCase().includes("test")) {
      monitoring.push(paragraph);
    } else {
      tips.push(paragraph);
    }
  });

  return (
    <section id="usage">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
        <PlusCircle className="h-6 w-6 text-primary-500 mr-2" />
        Usage & Instructions
      </h2>
      
      <div className="space-y-4">
        {howToTake.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              How to Take
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {howToTake.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {monitoring.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monitoring Requirements
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {monitoring.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {tips.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Important Tips
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {simplifiedStopUseParagraphs.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              When to Stop Using
            </h3>
            <ul className="list-disc pl-5 text-amber-800 space-y-2">
              {simplifiedStopUseParagraphs.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {usageParagraphs.length === 0 && stopUseParagraphs.length === 0 && (
          <div className="bg-gray-50 p-5 rounded-lg text-center">
            <p className="text-gray-700">
              Detailed usage information is not available for this medication. 
              Please consult your healthcare provider or pharmacist for specific instructions.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
