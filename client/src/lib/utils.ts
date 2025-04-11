import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function formatMedicationText(text: string | string[] | undefined): string {
  if (!text) return '';
  
  if (Array.isArray(text)) {
    return text[0] || '';
  }
  
  return text;
}

export function sanitizeHTML(html: string): string {
  // Replace any HTML entities or tags
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function simplifyMedicalTerms(text: string): string {
  const replacements: Record<string, string> = {
    'hypertension': 'high blood pressure',
    'hypotension': 'low blood pressure',
    'myocardial infarction': 'heart attack',
    'angina pectoris': 'chest pain',
    'dyspnea': 'shortness of breath',
    'edema': 'swelling',
    'pruritus': 'itching',
    'erythema': 'skin redness',
    'tachycardia': 'rapid heart rate',
    'bradycardia': 'slow heart rate',
    'syncope': 'fainting',
    'vertigo': 'dizziness',
    'nausea': 'feeling sick',
    'emesis': 'vomiting',
    'pyrexia': 'fever',
    'anorexia': 'loss of appetite',
    'insomnia': 'trouble sleeping',
    'somnolence': 'drowsiness',
    'dyspepsia': 'indigestion',
    'arthralgia': 'joint pain',
    'myalgia': 'muscle pain',
    'cephalalgia': 'headache',
  };
  
  let simplifiedText = text;
  
  for (const [medical, simple] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${medical}\\b`, 'gi');
    simplifiedText = simplifiedText.replace(regex, `${simple} (${medical})`);
  }
  
  return simplifiedText;
}

export function formatParagraphs(text: string): string[] {
  if (!text) return [];
  
  // First try splitting by double newlines (traditional paragraphs)
  const paragraphs = text.split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // If we have multiple paragraphs, return them
  if (paragraphs.length > 1) {
    return paragraphs;
  }
  
  // Otherwise, try splitting by single newlines
  const lines = text.split(/\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // If we have multiple lines, return them
  if (lines.length > 1) {
    return lines;
  }
  
  // If everything else fails, split by periods followed by space
  if (text.length > 100 && text.includes('. ')) {
    return text.split(/\.\s+/)
      .map(sentence => sentence.trim() + '.')
      .filter(sentence => sentence.length > 4); // Avoid tiny fragments
  }
  
  // Last resort: return the original text
  return [text];
}

export function isPrescriptionOnly(medication: any): boolean {
  if (!medication) return false;
  
  const prescriptionInfo = medication.prescription_nonprescription || [];
  return prescriptionInfo.some((type: string) => 
    type.toLowerCase().includes('prescription') && 
    !type.toLowerCase().includes('nonprescription')
  );
}
