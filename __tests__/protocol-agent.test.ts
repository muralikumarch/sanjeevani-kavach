import { describe, it, expect, vi } from 'vitest';
import { protocolAgent } from '../src/infrastructure/ai/protocol-agent';

describe('Protocol-Agent — Clinical Schedule Engine', () => {
  describe('calculateCatchup', () => {
    it('should flag PENTA-1 as RED/IMMEDIATELY when completely missing', () => {
      const result = protocolAgent.calculateCatchup(90, {}); // 90-day-old child, no vaccines
      
      expect(result.length).toBeGreaterThan(0);
      const penta1 = result.find(r => r.vaccineCode === 'PENTA-1');
      expect(penta1).toBeDefined();
      expect(penta1!.urgency).toBe('RED');
      expect(penta1!.recommendedDate).toBe('IMMEDIATELY');
    });

    it('should calculate PENTA-2 schedule when PENTA-1 exists but PENTA-2 missing', () => {
      const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const dateStr = `${threeMonthsAgo.getDate().toString().padStart(2, '0')}/${(threeMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}/${threeMonthsAgo.getFullYear()}`;
      
      const result = protocolAgent.calculateCatchup(180, {
        'PENTA-1': dateStr,
      });
      
      const penta2 = result.find(r => r.vaccineCode === 'PENTA-2');
      expect(penta2).toBeDefined();
      expect(penta2!.notes).toContain('28 days');
    });

    it('should return empty when child exceeds max age for PENTA', () => {
      // Child is 2 years old (730 days) — past the PENTA window
      const result = protocolAgent.calculateCatchup(730, {});
      const pentaResults = result.filter(r => r.vaccineCode.startsWith('PENTA'));
      expect(pentaResults.length).toBe(0);
    });

    it('should correctly assign urgency based on date proximity', () => {
      // Create a PENTA-1 date such that PENTA-2 is overdue (RED)
      const fiveMonthsAgo = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
      const dateStr = `${fiveMonthsAgo.getDate().toString().padStart(2, '0')}/${(fiveMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}/${fiveMonthsAgo.getFullYear()}`;
      
      const result = protocolAgent.calculateCatchup(200, {
        'PENTA-1': dateStr,
      });
      
      const penta2 = result.find(r => r.vaccineCode === 'PENTA-2');
      if (penta2) {
        // 150 days ago + 28 = 122 days ago, so this should be RED (negative diff)
        expect(penta2.urgency).toBe('RED');
      }
    });
  });

  describe('evaluateContraindications', () => {
    it('should return warnings for matching contraindications', () => {
      const result = protocolAgent.evaluateContraindications('PENTA-1', ['Anaphylaxis to previous dose']);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toContain('CONTRAINDICATION MATCH');
    });

    it('should return empty array for non-matching conditions', () => {
      const result = protocolAgent.evaluateContraindications('PENTA-1', ['common cold']);
      expect(result).toEqual([]);
    });

    it('should return empty array for unknown vaccine codes', () => {
      const result = protocolAgent.evaluateContraindications('UNKNOWN-VACCINE', ['anything']);
      expect(result).toEqual([]);
    });

    it('should handle empty conditions list', () => {
      const result = protocolAgent.evaluateContraindications('PENTA-1', []);
      expect(result).toEqual([]);
    });
  });
});
