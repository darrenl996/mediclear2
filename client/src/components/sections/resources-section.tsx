import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function ResourcesSection() {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 flex items-center mb-3">
        <HelpCircle className="h-5 w-5 text-gray-600 mr-2" />
        Helpful Resources
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Need to speak with someone?
          </h3>
          <p className="text-gray-700">FDA Drug Information: 1-855-543-3784</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Side Effects
          </h3>
          <p className="text-gray-700">FDA MedWatch Program: 1-800-FDA-1088</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Additional Information
          </h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
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
      </div>
    </section>
  );
}
