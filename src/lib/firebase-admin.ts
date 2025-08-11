// src/lib/firebase/admin.ts
import "server-only";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Prefer either:
// 1) FIREBASE_SERVICE_ACCOUNT_KEY (full JSON string), or
// 2) triplet: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
function loadServiceAccount():
  | { projectId: string; clientEmail: string; privateKey: string }
  | null {
  // Try full JSON first
  const packed = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (packed) {
    try {
      const parsed = JSON.parse(packed);
      if (parsed.private_key && parsed.client_email && parsed.project_id) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: String(parsed.private_key).replace(/\\n/g, "\n"),
        };
      }
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
  }

  // Fallback to individual env vars
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  return null;
}

let _app: App | null = null;
function getAdminApp(): App {
  if (_app) return _app;

  const creds = loadServiceAccount();
  if (!creds) {
    // Defer the error until someone actually tries to use Admin.
    throw new Error(
      "Firebase Admin SDK not initialized. Missing credentials. " +
        "Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
    );
  }

  _app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: creds.projectId,
          clientEmail: creds.clientEmail,
          privateKey: creds.privateKey,
        }),
      });

  return _app!;
}

// Export *functions* so init happens only when called (no work at import time).
export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}
