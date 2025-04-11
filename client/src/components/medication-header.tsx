import { type MedicationSearchResult } from "@shared/schema";

interface MedicationHeaderProps {
  medication: MedicationSearchResult;
}

export default function MedicationHeader({ medication }: MedicationHeaderProps) {
  const isPrescription = medication.prescription_nonprescription?.some(
    type => type.toLowerCase().includes('prescription') && 
    !type.toLowerCase().includes('nonprescription')
  );

  return (
    <div className="bg-primary-500 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {medication.generic_name || "Unknown Medication"}
        </h2>
        {isPrescription ? (
          <span className="bg-white text-primary-700 text-sm px-3 py-1 rounded-full font-medium">
            Prescription Only
          </span>
        ) : (
          <span className="bg-white text-green-700 text-sm px-3 py-1 rounded-full font-medium">
            Over-the-Counter
          </span>
        )}
      </div>
    </div>
  );
}
