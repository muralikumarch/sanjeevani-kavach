import { useOfflineStatus } from '@/app/providers/OfflineProvider';
import { saveVaccineRecord, getVaccineRecords } from '@/infrastructure/firebase/firestore';

export const useOfflineSync = () => {
  const { isOffline } = useOfflineStatus();

  return {
    isOffline,
    saveVaccineRecord,
    getVaccineRecords,
    // Add additional sync / queue methods here if needed
  };
};
