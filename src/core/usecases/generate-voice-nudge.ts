import { IProtocolAgent } from '../interfaces/protocol-agent.interface';
import { IVaniAgent } from '../interfaces/vani-agent.interface';
import { SupportedLanguage } from '../../infrastructure/gcp/language-map';

/**
 * Use Case: Takes a calculated catchup schedule and generates an empathetic audio nudge in the target dialect.
 * Notice how this business logic depends purely on interfaces, not implementations.
 */
export async function generateUrgencyVoiceNudgeUseCase(
  childName: string,
  vaccineCode: string,
  urgency: 'GREEN' | 'YELLOW' | 'RED',
  targetLanguage: SupportedLanguage,
  vaniAgent: IVaniAgent
): Promise<string> {
  
  let alertText = '';

  if (urgency === 'RED') {
    alertText = `Attention parent. ${childName} has missed their critical dose of ${vaccineCode}. Please contact your ASHA worker immediately.`;
  } else if (urgency === 'YELLOW') {
    alertText = `${childName} is due for ${vaccineCode} within the next 2 weeks. Make sure to schedule an appointment.`;
  } else {
    alertText = `${childName} is on track with their vaccines. The next dose of ${vaccineCode} is safely scheduled.`;
  }

  // Call the injected standard VaniAgent (which will wrap Bhashini at runtime)
  const audioBlob = await vaniAgent.generateAudioNudge(alertText, 'en', targetLanguage);
  
  return audioBlob;
}
