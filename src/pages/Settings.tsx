import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { CompanySettingsForm } from "@/components/settings/CompanySettingsForm";
import { motion } from "framer-motion";

export function SettingsPage() {
  const { user } = useAuth();
  const { settings, loading, saveSettings } = useCompanySettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <DashboardHeader
          title="Settings"
          description="Configure your application and company settings"
          userName={user?.displayName || "User"}
        />

        <motion.div variants={itemVariants}>
          <CompanySettingsForm
            initialSettings={settings || undefined}
            onSubmit={saveSettings}
            isLoading={loading}
          />
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
