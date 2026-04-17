// Core Domain Entities for Sanjeevani-Kavach

export type UrgencyLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface Child {
  id: string;
  name: string;
  date_of_birth: string; // ISO or DD/MM/YYYY
  gender: string;
}

export interface VaccineRecord {
  id?: string;
  vaccine_code: string;
  date_given: string; // DD/MM/YYYY
  batch_number: string;
  administered_by?: string;
  facility?: string;
}

export interface NISEntry {
  code: string;
  name: string;
  full_name: string;
  route: string;
  site: string;
  dose: string;
}

export interface MedicineInfo {
  drug_name: string;
  generic_name: string;
  concentration: string;
  calculated_dosage: string;
  warnings: string;
  audio_script: string;
}
