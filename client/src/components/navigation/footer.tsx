import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MediClear</h3>
            <p className="text-gray-300 text-sm">
              MediClear provides easy-to-understand medication information from FDA data. 
              This information is not a substitute for professional medical advice.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Important Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <a className="text-gray-300 hover:text-white">Help</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Data Sources</h3>
            <p className="text-gray-300 text-sm mb-2">
              All information is sourced from the U.S. Food and Drug Administration (FDA) 
              through their openFDA API.
            </p>
            <a 
              href="https://open.fda.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              Learn more about openFDA
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400 text-center">
          <p>
            © {new Date().getFullYear()} MediClear. All information is for educational purposes only. 
            Always consult your healthcare provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
