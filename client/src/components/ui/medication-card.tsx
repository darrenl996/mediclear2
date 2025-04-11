import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type MedicationSearchResult } from "@shared/schema";
import { isPrescriptionOnly } from "@/lib/utils";

interface MedicationCardProps {
  medication: MedicationSearchResult;
  onClick?: () => void;
}

export function MedicationCard({ medication, onClick }: MedicationCardProps) {
  const isPrescription = isPrescriptionOnly(medication);
  
  return (
    <Card 
      className="bg-white cursor-pointer transition-shadow hover:shadow-md" 
      onClick={onClick}
    >
      <CardHeader className="bg-primary-500 px-4 py-3 flex flex-row justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {medication.generic_name || "Unknown Medication"}
        </h3>
        {isPrescription ? (
          <Badge className="bg-white text-primary-700 hover:bg-white">
            Prescription Only
          </Badge>
        ) : (
          <Badge className="bg-white text-green-700 hover:bg-white">
            OTC
          </Badge>
        )}
      </CardHeader>
      <CardContent className="px-4 py-3">
        <div className="flex flex-wrap gap-2 text-sm mb-3">
          {medication.brand_name && (
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Brand: <span className="font-medium">{medication.brand_name}</span></span>
            </div>
          )}
          {medication.drug_class && (
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Class: <span className="font-medium">{medication.drug_class}</span></span>
            </div>
          )}
        </div>
        
        {(medication.indications_and_usage || medication.purpose) && (
          <div className="border-t border-gray-200 pt-3 mt-3">
            <h4 className="text-sm font-medium mb-1">What is this medication for?</h4>
            <p className="text-gray-700 text-sm">
              {medication.indications_and_usage?.[0]?.split('.')[0] || 
               medication.purpose?.[0] || 
               "Information not available"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
