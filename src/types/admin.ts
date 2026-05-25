export type PackageType = "INTERNET" | "SPEEDX" | "FPT_PLAY" | "CAMERA" | "SERVICE";
export type BillingCycle = "MONTHLY" | "ONCE" | "FREE";
export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CANCELLED";

export interface AdminUser {
  id: string;
  email: string;
  role: "ADMIN";
}

export interface PackageMetadataInput {
  downloadMbps?: number;
  uploadMbps?: number;
  maxDevices?: number;
  includedEquipment?: string[];
  privileges?: string[];
  audience?: string;
}

export interface PackageFe {
  id?: string;
  _id?: string;
  code?: string;
  type?: PackageType | string;
  name?: string;
  shortName?: string;
  displayCode?: string;
  tagline?: string;
  description?: string;
  promoBadge?: string;
  price?: number | null;
  monthlyPrice?: number | null;
  billingCycle?: BillingCycle;
  heroImage?: string;
  imageUrl?: string;
  accentImage?: string;
  specCaption?: string;
  specLine?: string;
  statIcon?: string;
  features?: string[];
  metadata?: PackageMetadataInput;
  isActive?: boolean;
  sortOrder?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadPackageSnapshot {
  code?: string;
  name?: string;
  price?: number | null;
  type?: string;
}

export interface Lead {
  _id: string;
  id?: string;
  fullName: string;
  phone: string;
  installAddress: string;
  packageId?: string;
  packageSnapshot?: LeadPackageSnapshot;
  customerId?: string | null;
  status: LeadStatus;
  source?: string;
  ip?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFormValues {
  type: PackageType;
  code: string;
  name: string;
  shortName: string;
  displayCode: string;
  tagline: string;
  description: string;
  promoBadge: string;
  billingCycle: BillingCycle;
  price: string;
  priceContact: boolean;
  speedLabel: string;
  heroImage: string;
  accentImage: string;
  specCaption: string;
  specLine: string;
  statIcon: string;
  features: string[];
  isActive: boolean;
  sortOrder: string;
  downloadMbps: string;
  uploadMbps: string;
  maxDevices: string;
  audience: string;
  includedEquipmentText: string;
  privilegesText: string;
}
