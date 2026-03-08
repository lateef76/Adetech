/**
 * useCompanySettings Hook - Manage company settings
 */

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  getCompanySettings,
  saveCompanySettings,
} from "@/services/companySettings";
import type {
  CompanySettings,
  NewCompanySettings,
} from "@/types/companySettings";

export function useCompanySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch company settings
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanySettings(user.uid);
        setSettings(data);
      } catch (err) {
        console.error("Error fetching company settings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user?.uid]);

  // Save company settings
  const handleSaveSettings = async (newSettings: NewCompanySettings) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return false;
    }

    try {
      const saved = await saveCompanySettings(user.uid, newSettings);
      setSettings(saved);
      console.log("Company settings saved successfully");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save settings";
      setError(message);
      console.error("Error saving settings:", message);
      return false;
    }
  };

  return {
    settings,
    loading,
    error,
    saveSettings: handleSaveSettings,
    refetch: async () => {
      if (user?.uid) {
        const data = await getCompanySettings(user.uid);
        setSettings(data);
      }
    },
  };
}
