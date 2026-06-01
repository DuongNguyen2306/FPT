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
  /**
   * Nhóm tab trang chủ (personal / family / gamer / combo-...).
   */
  audience?: string;
  /**
   * Tiêu đề lớn trên hero trang chi tiết (INTERNET CHO CÁ NHÂN...). 
   */
  heroHeadline?: string;
  /**
   * Ảnh lifestyle bên hero / block đặc quyền.
   */
  lifestyleImageUrl?: string;
  /**
   * Thiết bị kèm theo.
   * BE hỗ trợ cả string[] đơn giản và object[] { label, imageUrl }.
   */
  includedEquipment?: unknown[];
  /**
   * Đặc quyền — BE hỗ trợ string[] hoặc object[] { icon, title, description }.
   */
  privileges?: unknown[];
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
  bannerImage?: string;
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
  createdAt?: string;
  updatedAt?: string;
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

/** Một slide trong admin / trang chủ. */
export interface AdminBannerListItem {
  kind: "standalone" | "package";
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  sortOrder?: number;
  isActive?: boolean;
  packageId?: string;
  code?: string;
  type?: string;
}

/** Một dòng đặc quyền trên form admin. */
export interface PrivilegeFormItem {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string;
}

/** Một thiết bị kèm gói — mỗi dòng một ảnh. */
export interface EquipmentFormItem {
  label: string;
  imageUrl?: string;
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
  bannerImage: string;
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
  heroHeadline: string;
  lifestyleImageUrl: string;
  equipment: EquipmentFormItem[];
  /** @deprecated */
  includedEquipmentText?: string;
  /** @deprecated dùng privileges — giữ khi load dữ liệu cũ */
  privilegesText?: string;
  privileges: PrivilegeFormItem[];
}

/** Admin navigation menu group */
export interface AdminNavigationMenuItem {
  label: string;
  link: string;
  packageCode?: string;
  displayOrder: number;
  isNew: boolean;
  isVisible: boolean;
}

export interface AdminNavigationMenuGroup {
  id: string;
  title: string;
  icon: string;
  displayOrder: number;
  isVisible: boolean;
  items: AdminNavigationMenuItem[];
}
