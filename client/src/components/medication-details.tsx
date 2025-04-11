import { useState } from "react";
import { useMedicationDetails } from "@/hooks/use-fda-api";
import MedicationOverview from "./medication-overview";
import NavTabs from "./nav-tabs";
import WarningsSection from "./sections/warnings-section";
import UsageSection from "./sections/usage-section";
import DosageSection from "./sections/dosage-section";
import SideEffectsSection from "./sections/side-effects-section";
import DrugInteractionsSection from "./sections/drug-interactions-section";
import ResourcesSection from "./sections/resources-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MedicationDetailsProps {
  medicationId: string;
}

export default function MedicationDetails({ medicationId }: MedicationDetailsProps) {
  const [activeTab, setActiveTab] = useState("warnings");
  
  const { 
    data: medication, 
    isLoading, 
    error 
  } = useMedicationDetails(medicationId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-8 h-8 border-t-2 border-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading medication information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-3xl mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error)?.message || "Failed to load medication information. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!medication) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-3xl mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Medication Not Found</AlertTitle>
        <AlertDescription>
          We could not find information about this medication in the FDA database.
        </AlertDescription>
      </Alert>
    );
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="fade-in animate-in fade-in-0 duration-300">
      <MedicationOverview medication={medication} />
      
      <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {/* Show only the active tab content */}
        {activeTab === "warnings" && <WarningsSection medication={medication} />}
        {activeTab === "usage" && <UsageSection medication={medication} />}
        {activeTab === "dosage" && <DosageSection medication={medication} />}
        {activeTab === "side-effects" && <SideEffectsSection medication={medication} />}
        {activeTab === "interactions" && <DrugInteractionsSection medication={medication} />}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <ResourcesSection />
      </div>
    </div>
  );
}
