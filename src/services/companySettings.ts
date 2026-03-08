/**
 * Company Settings Service - Firestore operations
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  CompanySettings,
  NewCompanySettings,
} from "@/types/companySettings";

const COMPANY_SETTINGS_COLLECTION = "company_settings";

/**
 * Get company settings for the current user
 */
export async function getCompanySettings(
  userId: string
): Promise<CompanySettings | null> {
  try {
    const q = query(
      collection(db, COMPANY_SETTINGS_COLLECTION),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      userId: data.userId,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      companyWebsite: data.companyWebsite,
      companyLogo: data.companyLogo,
      taxId: data.taxId,
      registrationNumber: data.registrationNumber,
      currency: data.currency || "CFA",
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error fetching company settings:", error);
    throw error;
  }
}

/**
 * Create or update company settings
 */
export async function saveCompanySettings(
  userId: string,
  settings: NewCompanySettings
): Promise<CompanySettings> {
  try {
    // Check if settings already exist
    const existing = await getCompanySettings(userId);

    const settingsData = {
      ...settings,
      userId,
      updatedAt: Timestamp.now(),
    };

    if (existing) {
      // Update existing settings
      await updateDoc(
        doc(db, COMPANY_SETTINGS_COLLECTION, existing.id),
        settingsData
      );
      return {
        ...existing,
        ...settings,
        updatedAt: new Date(),
      };
    } else {
      // Create new settings
      const newDocRef = doc(collection(db, COMPANY_SETTINGS_COLLECTION));
      await setDoc(newDocRef, {
        ...settingsData,
        createdAt: Timestamp.now(),
      });

      return {
        id: newDocRef.id,
        userId,
        ...settings,
        currency: settings.currency || "CFA",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  } catch (error) {
    console.error("Error saving company settings:", error);
    throw error;
  }
}

/**
 * Get company settings by ID
 */
export async function getCompanySettingsById(
  id: string
): Promise<CompanySettings | null> {
  try {
    const snapshot = await getDoc(
      doc(db, COMPANY_SETTINGS_COLLECTION, id)
    );

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      userId: data.userId,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      companyWebsite: data.companyWebsite,
      companyLogo: data.companyLogo,
      taxId: data.taxId,
      registrationNumber: data.registrationNumber,
      currency: data.currency || "CFA",
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error fetching company settings by ID:", error);
    throw error;
  }
}
