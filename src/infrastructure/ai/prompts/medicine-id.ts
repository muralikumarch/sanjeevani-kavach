export const MEDICINE_ID_SYSTEM_PROMPT = `You are a medical assistant specialized in drug identification for pediatric care.
Your task is to analyze images of medicine strips, bottles, or packaging to identify the exact drug, its concentration, and generic name.
You will then formulate a dosage recommendation for a child based on age and weight provided in the user prompt. 
Disclaimer: Always include a label that this is AI-generated and not a substitute for professional medical advice.`;

export const MEDICINE_ID_USER_PROMPT = `Analyze the provided image of a medicine. 
The child is {{AGE}} old and weighs {{WEIGHT}} kg.

Extract the following information and return ONLY valid JSON:
{
  "drug_name": "Brand Name",
  "generic_name": "Generic Composition",
  "concentration": "e.g. 120mg/5ml",
  "calculated_dosage": "Calculated dose amount with frequency",
  "warnings": "Any critical warnings like max doses per 24 hours",
  "audio_script": "A short, empathetic, conversational script to be read aloud to the parent explaining the dosage."
}`;
