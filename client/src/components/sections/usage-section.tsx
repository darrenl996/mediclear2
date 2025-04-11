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
    <section id="usage" className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <PlusCircle className="h-6 w-6 text-primary-500 mr-2" />
            Usage & Instructions
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 py-4 space-y-4">
          {howToTake.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">How to Take</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-2">
                {howToTake.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}
          
          {monitoring.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Monitoring Requirements</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-1">
                {monitoring.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {tips.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Important Tips</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-2">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {simplifiedStopUseParagraphs.length > 0 && (
            <div className="bg-amber-50 p-4 rounded mt-4">
              <h3 className="font-medium text-amber-800 mb-2">When to Stop Using</h3>
              <ul className="list-disc pl-5 text-amber-700 font-body space-y-1">
                {simplifiedStopUseParagraphs.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {usageParagraphs.length === 0 && stopUseParagraphs.length === 0 && (
            <p className="text-gray-700">
              Detailed usage information is not available for this medication. 
              Please consult your healthcare provider or pharmacist for specific instructions.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
