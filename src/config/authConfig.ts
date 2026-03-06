/**
 * Firebase Authentication Configuration
 *
 * Environment variables required in .env:
 * VITE_FIREBASE_API_KEY
 * VITE_FIREBASE_AUTH_DOMAIN
 * VITE_FIREBASE_PROJECT_ID
 * VITE_FIREBASE_STORAGE_BUCKET
 * VITE_FIREBASE_MESSAGING_SENDER_ID
 * VITE_FIREBASE_APP_ID
 *
 * Example .env:
 * VITE_FIREBASE_API_KEY=AIzaSyD...
 * VITE_FIREBASE_AUTH_DOMAIN=my-app.firebaseapp.com
 * VITE_FIREBASE_PROJECT_ID=my-app
 * VITE_FIREBASE_STORAGE_BUCKET=my-app.appspot.com
 * VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
 * VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
 */

export const firebaseScopes = {
  loginRequest: ['openid', 'profile', 'email'],
};
