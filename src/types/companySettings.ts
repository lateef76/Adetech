/**
 * Company Settings Types
 */

export interface CompanySettings {
  id: string;
  userId: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyLogo?: string;
  taxId?: string;
  registrationNumber?: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewCompanySettings = Omit<
  CompanySettings,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
