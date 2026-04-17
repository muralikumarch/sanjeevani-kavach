import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadBlurredImage = async (childId: string, imageBlob: Blob, filename: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `vaccine_cards/${childId}/${filename}`);
    const snapshot = await uploadBytes(storageRef, imageBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to storage: ', error);
    throw error;
  }
};
