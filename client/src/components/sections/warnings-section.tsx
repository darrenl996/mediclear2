import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { type MedicationSearchResult } from "@shared/schema";
import { formatMedicationText, formatParagraphs, simplifyMedicalTerms } from "@/lib/utils";

interface WarningsSectionProps {
  medication: MedicationSearchResult;
}

export default function WarningsSection({ medication }: WarningsSectionProps) {
  const boxedWarning = formatMedicationText(medication.boxed_warning);
  const generalWarnings = formatMedicationText(medication.warnings || medication.warnings_and_cautions);
  const pregnancyWarning = formatMedicationText(medication.pregnancy_or_breastfeeding);
  const doNotUse = formatMedicationText(medication.do_not_use);
  
  const hasBoxedWarning = boxedWarning?.length > 0;
  const hasPregnancyWarning = pregnancyWarning?.length > 0;
  const hasDoNotUse = doNotUse?.length > 0;
  
  // Format warnings into paragraphs
  const warningParagraphs = formatParagraphs(generalWarnings);
  
  // Extract "who should not take" and "talk to your doctor" sections
  const whoShouldNotTake: string[] = [];
  const talkToDoctor: string[] = [];
  
  // Simple parsing logic to extract these sections from the warnings
  warningParagraphs.forEach(paragraph => {
    if (paragraph.toLowerCase().includes("do not use") || 
        paragraph.toLowerCase().includes("should not take") || 
        paragraph.toLowerCase().includes("should not use")) {
      whoShouldNotTake.push(paragraph);
    } else if (paragraph.toLowerCase().includes("tell your doctor") || 
               paragraph.toLowerCase().includes("talk to your") || 
               paragraph.toLowerCase().includes("ask a doctor")) {
      talkToDoctor.push(paragraph);
    }
  });
  
  // Simplify medical terms in warnings
  const simplifiedBoxedWarning = simplifyMedicalTerms(boxedWarning);
  const simplifiedPregnancyWarning = simplifyMedicalTerms(pregnancyWarning);
  const simplifiedDoNotUse = simplifyMedicalTerms(doNotUse);

  return (
    <section id="warnings" className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            Warnings & Precautions
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 py-4 space-y-4">
          {hasBoxedWarning && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Boxed Warning</h3>
                  <div className="mt-2 text-sm text-red-700 font-body">
                    <p>{simplifiedBoxedWarning}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasPregnancyWarning && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Pregnancy & Breastfeeding Warning</h3>
                  <div className="mt-2 text-sm text-amber-700 font-body">
                    <p>{simplifiedPregnancyWarning}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasDoNotUse && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Do Not Use</h3>
                  <div className="mt-2 text-sm text-amber-700 font-body">
                    <p>{simplifiedDoNotUse}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {whoShouldNotTake.length > 0 && (
            <>
              <h3 className="font-medium text-gray-900 mt-4">Who should not take this medication?</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-1">
                {whoShouldNotTake.map((warning, index) => (
                  <li key={index}>{simplifyMedicalTerms(warning)}</li>
                ))}
              </ul>
            </>
          )}
          
          {talkToDoctor.length > 0 && (
            <>
              <h3 className="font-medium text-gray-900 mt-4">Talk to your doctor before using if you have:</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-1">
                {talkToDoctor.map((warning, index) => (
                  <li key={index}>{simplifyMedicalTerms(warning)}</li>
                ))}
              </ul>
            </>
          )}
          
          {warningParagraphs.length > 0 && !(whoShouldNotTake.length > 0 || talkToDoctor.length > 0) && (
            <>
              <h3 className="font-medium text-gray-900 mt-4">General Warnings</h3>
              <div className="text-gray-700 font-body space-y-3">
                {warningParagraphs.map((paragraph, index) => (
                  <p key={index}>{simplifyMedicalTerms(paragraph)}</p>
                ))}
              </div>
            </>
          )}
          
          {!hasBoxedWarning && !hasPregnancyWarning && warningParagraphs.length === 0 && (
            <p className="text-gray-700">
              No specific warnings information is available for this medication. 
              Always consult your healthcare provider before use.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
