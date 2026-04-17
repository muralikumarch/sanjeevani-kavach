import catchupRules from '../../data/catchup-rules.json';

export interface CatchupSchedule {
  vaccineCode: string;
  recommendedDate: string; // DD/MM/YYYY
  urgency: 'GREEN' | 'YELLOW' | 'RED';
  notes: string;
}

export class ProtocolAgent {
  /**
   * Calculates the catch-up schedule based on the child's age in days and
   * their existing administered vaccine records.
   */
  calculateCatchup(
    childAgeDays: number, 
    lastAdministeredDates: Record<string, string> // e.g. { "PENTA-1": "01/01/2026" }
  ): CatchupSchedule[] {
    const schedules: CatchupSchedule[] = [];
    const today = new Date(); // Mocking today's date for computation

    // Mock Business Logic for PENTA Catch-up
    const rules = catchupRules.vaccines;
    
    // Check PENTA series
    if (childAgeDays <= rules.PENTA.max_age_days) {
      if (lastAdministeredDates["PENTA-1"]) {
        if (!lastAdministeredDates["PENTA-2"]) {
          const penta1DateParts = lastAdministeredDates["PENTA-1"].split('/');
          const penta1Date = new Date(Number(penta1DateParts[2]), Number(penta1DateParts[1]) - 1, Number(penta1DateParts[0]));
          
          // Calculate when PENTA-2 should be given (28 days min gap)
          const recommendedPenta2 = new Date(penta1Date.getTime() + rules.PENTA.min_interval_days * 24 * 60 * 60 * 1000);
          
          // Determine urgency
          let urgency: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
          const diffDays = Math.floor((recommendedPenta2.getTime() - today.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays < 0) urgency = 'RED'; // Missed
          else if (diffDays <= 14) urgency = 'YELLOW'; // Due soon

          schedules.push({
            vaccineCode: 'PENTA-2',
            recommendedDate: `${recommendedPenta2.getDate().toString().padStart(2, '0')}/${(recommendedPenta2.getMonth() + 1).toString().padStart(2, '0')}/${recommendedPenta2.getFullYear()}`,
            urgency,
            notes: 'Follows minimum 28 days interval after PENTA-1. Catch-up valid up to 1 year of age.'
          });
        }
      } else {
        // If PENTA-1 is missing completely
        schedules.push({
          vaccineCode: 'PENTA-1',
          recommendedDate: 'IMMEDIATELY',
          urgency: 'RED',
          notes: 'Primary dose missing. Catch-up valid up to 1 year of age.'
        });
      }
    }

    // Similar logic would branch out recursively across MR, OPV, BCG
    // utilizing the RAG pipeline configurations for edge cases

    return schedules;
  }

  /**
   * Evaluates any medical conditions against the contraindications registry.
   */
  evaluateContraindications(vaccineCode: string, predefinedConditions: string[]): string[] {
    const baseCode = vaccineCode.split('-')[0]; // Map PENTA-1 to PENTA
    
    // Type checking hack for mock file
    const activeRules = (catchupRules.vaccines as Record<string, any>)[baseCode];
    if (!activeRules) return [];

    const warnings: string[] = [];
    for (const condition of predefinedConditions) {
      if (activeRules.contraindications.includes(condition)) {
        warnings.push(`CONTRAINDICATION MATCH: Do not administer ${vaccineCode} if patient has ${condition}.`);
      }
    }
    
    return warnings;
  }
}

export const protocolAgent = new ProtocolAgent();
