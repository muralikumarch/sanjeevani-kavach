import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;

  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_JSON is missing in environment variables');
  }

  try {
    // Attempt to parse as JSON string first, otherwise assume it's a path
    const parsedKey = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(parsedKey),
    });
  } catch (e) {
    // Fallback: Assume the env var is a path to the JSON file
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
    });
  }
}

export async function verifyAuthToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // Returns user information (uid, email, etc.)
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
}
