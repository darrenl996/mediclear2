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
    <section id="dosage" className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Package className="h-6 w-6 text-green-500 mr-2" />
            Dosage Information
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 py-4 space-y-4">
          <div className="flex items-center mb-2">
            <div className="text-sm px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
              Individual dosing may vary based on your condition and response
            </div>
          </div>
          
          {adultDosage.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Adult Dosage</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-2">
                {adultDosage.map((dosage, index) => (
                  <li key={index}>{dosage}</li>
                ))}
              </ul>
            </div>
          )}
          
          {pediatricDosage.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Pediatric Dosage</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-2">
                {pediatricDosage.map((dosage, index) => (
                  <li key={index}>{dosage}</li>
                ))}
              </ul>
            </div>
          )}
          
          {specialDosage.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Special Dosing Considerations</h3>
              <ul className="list-disc pl-5 text-gray-700 font-body space-y-2">
                {specialDosage.map((dosage, index) => (
                  <li key={index}>{dosage}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* If no specific information available */}
          {dosageParagraphs.length === 0 && (
            <p className="text-gray-700">
              Specific dosage information is not available for this medication. 
              Please consult your healthcare provider or pharmacist for proper dosing.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
