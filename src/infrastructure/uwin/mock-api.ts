// Mocking the U-WIN Digital Immunization Platform

export interface UWINRecord {
  vaccine_code: string;
  date_administered: string | null;
  batch: string | null;
  facility: string | null;
}

export class UWINService {
  /**
   * Simulates fetching a child's digital immunization record.
   */
  async getChildRecords(beneficiaryId: string): Promise<Record<string, UWINRecord>> {
    console.info(`FETCHING U-WIN RECORDS FOR ID: ${beneficiaryId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // A mock dataset intentionally missing PENTA-3 to trigger the Discrepancy UI
    return {
      "BCG": { vaccine_code: "BCG", date_administered: "10/01/2026", batch: "BCG991X", facility: "PHC-Kurnool" },
      "PENTA-1": { vaccine_code: "PENTA-1", date_administered: "24/02/2026", batch: "PNT882", facility: "PHC-Kurnool" },
      "PENTA-2": { vaccine_code: "PENTA-2", date_administered: "25/03/2026", batch: "PNT882", facility: "PHC-Kurnool" },
      // "PENTA-3" is intentionally missing to simulate a Data Dark zone or sync failure
    };
  }
}

export const uwinAPI = new UWINService();
