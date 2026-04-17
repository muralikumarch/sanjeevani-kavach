export interface CatchupScheduleResponse {
  vaccineCode: string;
  recommendedDate: string;
  urgency: 'GREEN' | 'YELLOW' | 'RED';
  notes: string;
}

/**
 * Standard port for the Protocol-Agent to encapsulate clinical business logic.
 */
export interface IProtocolAgent {
  calculateCatchup(childAgeDays: number, lastAdministeredDates: Record<string, string>): CatchupScheduleResponse[];
  evaluateContraindications(vaccineCode: string, predefinedConditions: string[]): string[];
}
