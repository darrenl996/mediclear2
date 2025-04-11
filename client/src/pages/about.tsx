import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">About MediClear</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            MediClear was developed with a clear mission: to simplify complex medication information 
            and make it accessible to everyone. I believe that understanding your medications 
            shouldn't require a medical degree. 
          </p>
          <p className="text-gray-700">
            By leveraging the OpenFDA API, I transform technical medical data into clear, 
            straightforward language that helps you make informed decisions about your health.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">How It Works</h2>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-4 text-gray-700">
            <li>
              <span className="font-medium">Search for your medication</span>
              <p className="mt-1">
                Enter the name of your medication in the search bar. You can search by either 
                brand name or generic name.
              </p>
            </li>
            <li>
              <span className="font-medium">Review simplified information</span>
              <p className="mt-1">
                MediClear present FDA-approved medication information in a user-friendly format, 
                organizing it into clear sections like warnings, usage instructions, 
                and side effects.
              </p>
            </li>
            <li>
              <span className="font-medium">Understand medical terminology</span>
              <p className="mt-1">
                Complex medical terms are translated into plain language where possible, 
                with the original terms included for reference.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Our Data</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            All medication information on MediClear comes directly from the U.S. Food and Drug 
            Administration (FDA) through their openFDA API. This ensures that the information 
            you receive is official, accurate, and up-to-date.
          </p>
          <p className="text-gray-700 mb-4">
            The openFDA API provides access to public FDA datasets, including drug labels, 
            adverse events, and recalls. MediClear primarily uses the drug label dataset, 
            which contains the same information found on FDA-approved prescription and 
            over-the-counter drug labels.
          </p>
          <p className="text-gray-700">
            <a 
              href="https://open.fda.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Learn more about the openFDA initiative
            </a>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Important Disclaimer</h2>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-500">
            <p className="text-amber-800 font-medium mb-2">Medical Disclaimer</p>
            <p className="text-amber-700 text-sm">
              MediClear provides general information about medications based on FDA data. 
              This information is not a substitute for professional medical advice, diagnosis, 
              or treatment. Always seek the advice of your physician or other qualified health 
              provider with any questions you may have regarding a medical condition or medication.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
