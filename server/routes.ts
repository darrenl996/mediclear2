import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import NodeCache from "node-cache";

// Cache for OpenFDA API responses (TTL 1 day in seconds)
const apiCache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

// FDA API key and base URL
const FDA_API_KEY = process.env.FDA_API_KEY || "";
const FDA_API_BASE_URL = "https://api.fda.gov/drug/label.json";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for drug search
  app.get("/api/drugs/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }
      
      // Check cache first
      const cacheKey = `search-${query.toLowerCase()}`;
      const cachedResults = apiCache.get(cacheKey);
      
      if (cachedResults) {
        return res.json(cachedResults);
      }
      
      // Build FDA API URL with search parameters - using OR for broader results
      const encodedQuery = encodeURIComponent(query);
      const apiUrl = `${FDA_API_BASE_URL}?search=(openfda.generic_name:"${encodedQuery}"+OR+openfda.brand_name:"${encodedQuery}"+OR+openfda.substance_name:"${encodedQuery}")&limit=10`;
      
      const response = await axios.get(apiUrl, {
        headers: FDA_API_KEY ? { "api_key": FDA_API_KEY } : {}
      });
      
      // Process and format the response
      const results = response.data?.results || [];
      const formattedResults = results.map((result: any) => {
        const openfda = result.openfda || {};
        return {
          generic_name: openfda.generic_name?.[0] || "Unknown",
          brand_name: openfda.brand_name?.join(", ") || "",
          active_ingredients: result.active_ingredient?.[0]?.split(";").map((ingredient: string) => {
            const parts = ingredient.trim().split(" ");
            return {
              name: parts.slice(0, -1).join(" "),
              strength: parts[parts.length - 1] || ""
            };
          }) || [],
          drug_class: openfda.pharm_class_epc?.[0] || "",
          purpose: result.purpose || [],
          description: result.description?.[0] || "",
          indications_and_usage: result.indications_and_usage || [],
          warnings: result.warnings || [],
          warnings_and_cautions: result.warnings_and_cautions || [],
          boxed_warning: result.boxed_warning || [],
          do_not_use: result.do_not_use || [],
          pregnancy_or_breastfeeding: result.pregnancy_or_breastfeeding || [],
          usage_information: result.information_for_patients || [],
          when_using: result.when_using || [],
          dosage_and_administration: result.dosage_and_administration || [],
          drug_interactions: result.drug_interactions || [],
          stop_use: result.stop_use || [],
          side_effects: result.adverse_reactions || [],
          route: openfda.route || [],
          dosage_form: openfda.dosage_form || [],
          id: result.id,
          set_id: result.set_id,
          effective_time: result.effective_time,
          prescription_nonprescription: openfda.product_type || [],
          adverse_reactions: result.adverse_reactions || [],
          abuse_and_dependence: result.drug_abuse_and_dependence || [],
        };
      });
      
      // Cache the results
      apiCache.set(cacheKey, formattedResults);
      
      return res.json(formattedResults);
    } catch (error: any) {
      console.error("FDA API Error:", error.message);
      
      // Check for specific FDA API errors
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return res.status(404).json({ 
            message: "No medications found. Try a different search term." 
          });
        }
        
        if (status === 429) {
          return res.status(429).json({ 
            message: "Too many requests to the FDA database. Please try again later." 
          });
        }
      }
      
      return res.status(500).json({ 
        message: "Failed to fetch medication information from FDA database" 
      });
    }
  });

  // API route for getting drug details by ID
  app.get("/api/drugs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ message: "Drug ID is required" });
      }
      
      // Check cache first
      const cacheKey = `drug-${id}`;
      const cachedDrug = apiCache.get(cacheKey);
      
      if (cachedDrug) {
        return res.json(cachedDrug);
      }
      
      // Build FDA API URL to fetch specific drug by ID
      const apiUrl = `${FDA_API_BASE_URL}?search=id:"${id}"`;
      
      const response = await axios.get(apiUrl, {
        headers: FDA_API_KEY ? { "api_key": FDA_API_KEY } : {}
      });
      
      if (!response.data?.results || response.data.results.length === 0) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      const result = response.data.results[0];
      const openfda = result.openfda || {};
      
      const formattedDrug = {
        generic_name: openfda.generic_name?.[0] || "Unknown",
        brand_name: openfda.brand_name?.join(", ") || "",
        active_ingredients: result.active_ingredient?.[0]?.split(";").map((ingredient: string) => {
          const parts = ingredient.trim().split(" ");
          return {
            name: parts.slice(0, -1).join(" "),
            strength: parts[parts.length - 1] || ""
          };
        }) || [],
        drug_class: openfda.pharm_class_epc?.[0] || "",
        purpose: result.purpose || [],
        description: result.description?.[0] || "",
        indications_and_usage: result.indications_and_usage || [],
        warnings: result.warnings || [],
        warnings_and_cautions: result.warnings_and_cautions || [],
        boxed_warning: result.boxed_warning || [],
        do_not_use: result.do_not_use || [],
        pregnancy_or_breastfeeding: result.pregnancy_or_breastfeeding || [],
        usage_information: result.information_for_patients || [],
        when_using: result.when_using || [],
        dosage_and_administration: result.dosage_and_administration || [],
        drug_interactions: result.drug_interactions || [],
        stop_use: result.stop_use || [],
        side_effects: result.adverse_reactions || [],
        route: openfda.route || [],
        dosage_form: openfda.dosage_form || [],
        id: result.id,
        set_id: result.set_id,
        effective_time: result.effective_time,
        prescription_nonprescription: openfda.product_type || [],
        adverse_reactions: result.adverse_reactions || [],
        abuse_and_dependence: result.drug_abuse_and_dependence || [],
      };
      
      // Cache the drug details
      apiCache.set(cacheKey, formattedDrug);
      
      return res.json(formattedDrug);
    } catch (error: any) {
      console.error("FDA API Error:", error.message);
      
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          message: "Medication not found in FDA database" 
        });
      }
      
      return res.status(500).json({ 
        message: "Failed to fetch medication details from FDA database" 
      });
    }
  });

  // API route for drug suggestions (autocomplete)
  app.get("/api/drugs/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }
      
      // Check cache first
      const cacheKey = `suggestions-${query.toLowerCase()}`;
      const cachedSuggestions = apiCache.get(cacheKey);
      
      if (cachedSuggestions) {
        return res.json(cachedSuggestions);
      }
      
      // Build FDA API URL for suggestions (using a smaller limit for quick responses)
      const encodedQuery = encodeURIComponent(query);
      const apiUrl = `${FDA_API_BASE_URL}?search=(openfda.generic_name:"${encodedQuery}"+OR+openfda.brand_name:"${encodedQuery}"+OR+openfda.substance_name:"${encodedQuery}")&limit=5`;
      
      const response = await axios.get(apiUrl, {
        headers: FDA_API_KEY ? { "api_key": FDA_API_KEY } : {}
      });
      
      // Process the response for suggestions format
      const results = response.data?.results || [];
      const suggestions = results.map((result: any) => {
        const openfda = result.openfda || {};
        return {
          id: result.id,
          generic_name: openfda.generic_name?.[0] || "Unknown",
          brand_name: openfda.brand_name?.[0] || "",
          purpose: result.purpose?.[0] || result.indications_and_usage?.[0] || ""
        };
      });
      
      // Cache the suggestions
      apiCache.set(cacheKey, suggestions);
      
      return res.json(suggestions);
    } catch (error: any) {
      console.error("FDA API Suggestions Error:", error.message);
      
      if (error.response?.status === 404) {
        return res.json([]);
      }
      
      return res.status(500).json({ 
        message: "Failed to fetch medication suggestions from FDA database" 
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
