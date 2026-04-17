import { useAuthContext } from '@/app/providers/AuthProvider';
import { setupRecaptcha, sendOTP, verifyOTP, signOut } from '@/infrastructure/firebase/auth';

export const useFirebaseAuth = () => {
  const { user, loading } = useAuthContext();

  return {
    user,
    loading,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    signOut,
  };
};
