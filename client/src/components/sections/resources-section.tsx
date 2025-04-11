import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function ResourcesSection() {
  return (
    <section className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <HelpCircle className="h-5 w-5 text-gray-600 mr-2" />
            Helpful Resources
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 py-4 space-y-3 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Need to speak with someone?</h3>
            <p className="text-gray-700 font-body">FDA Drug Information: 1-855-543-3784</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Report Side Effects</h3>
            <p className="text-gray-700 font-body">FDA MedWatch Program: 1-800-FDA-1088</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Additional Information</h3>
            <ul className="list-disc pl-5 text-gray-700 font-body">
              <li>
                <a 
                  href="https://www.heart.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800"
                >
                  American Heart Association
                </a>
              </li>
              <li>
                <a 
                  href="https://medlineplus.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800"
                >
                  National Library of Medicine
                </a>
              </li>
              <li>
                <a 
                  href="https://www.fda.gov/drugs/drug-safety-and-availability/medication-guides" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800"
                >
                  FDA Medication Guides
                </a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
