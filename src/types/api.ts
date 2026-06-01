/** DTO gói từ API — field thực tế có thể khác; mapper xử lý alias. */
export type PackageType =
  | "INTERNET"
  | "SPEEDX"
  | "FPT_PLAY"
  | "CAMERA"
  | "SERVICE";

/** Metadata gói Internet/SpeedX từ BE (có thể nằm trong `metadata` hoặc flatten). */
export interface PackageMetadata {
  downloadMbps?: number;
  uploadMbps?: number;
  includedEquipment?: string | string[];
  privileges?: string | string[];
  audience?: string;
  maxDevices?: number;
  maxConnectedDevices?: number;
  [key: string]: unknown;
}

export interface PackageDto {
  id?: string;
  _id?: string;
  code?: string;
  name?: string;
  shortName?: string;
  type?: PackageType | string;
  tagline?: string;
  description?: string;
  promoBadge?: string;
  price?: number;
  monthlyPrice?: number;
  /** Ảnh carousel trang chủ (21:9), tách khỏi ảnh sản phẩm. */
  bannerImage?: string;
  heroImage?: string;
  imageUrl?: string;
  image?: string;
  accentImage?: string;
  secondaryImage?: string;
  displayCode?: string;
  metadata?: PackageMetadata;
  downloadMbps?: number;
  uploadMbps?: number;
  includedEquipment?: string | string[];
  privileges?: string | string[];
  specCaption?: string;
  specLine?: string;
  statIcon?: string;
  features?: string[];
  bullets?: string[];
  featureList?: string[];
  isActive?: boolean;
}

export interface LeadCreateBody {
  fullName: string;
  phone: string;
  installAddress: string;
  packageId?: string;
}

export interface LeadPackageSnapshot {
  code?: string;
  name?: string;
  price?: number | null;
  type?: string;
}

export interface LeadPublicItem {
  id: string;
  status: string;
  createdAt: string;
  fullName: string;
  phone: string;
  installAddress: string;
  packageId?: string | null;
  packageSnapshot?: LeadPackageSnapshot | null;
}

export interface LeadHistoryByPhoneResponse {
  phone: string;
  total: number;
  items: LeadPublicItem[];
}

export interface MyLeadsResponse {
  items: Array<Record<string, unknown> & { _id?: string; id?: string }>;
  total: number;
  page: number;
  limit: number;
}

export interface LeadCreateResponse {
  id: string;
  status: string;
  createdAt: string;
  fullName?: string;
  phone?: string;
  installAddress?: string;
  packageId?: string | null;
  packageSnapshot?: LeadPackageSnapshot | null;
}

export interface AuthUserDto {
  id?: string;
  _id?: string;
  username?: string;
  fullName?: string;
  email?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUserDto;
}

export interface RegisterBody {
  phone: string;
  password: string;
  fullName: string;
  email?: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: Record<string, unknown>;
}

/** FAQ hiển thị trang khách — GET /faqs */
export interface FaqPublicItem {
  id: string;
  question: string;
  answer: string;
  displayOrder?: number;
}

/** Mega-menu — GET /navigation */
export interface NavigationMenuItem {
  label: string;
  link: string;
  packageCode?: string | null;
  isNew?: boolean;
  displayOrder?: number;
  isVisible?: boolean;
  /** Mega-menu Internet: điều hướng tab trang chủ */
  tabId?: string;
  isTag?: boolean;
}

export interface NavigationMenuGroup {
  id: string;
  title: string;
  icon: string;
  displayOrder?: number;
  isVisible?: boolean;
  items: NavigationMenuItem[];
}

/** Gợi ý loại gói — GET /package-quiz */
export interface PackageQuizOption {
  code: string;
  label: string;
  icon?: string;
  displayOrder?: number;
}

export interface PackageQuizQuestion {
  code: string;
  title: string;
  description?: string | null;
  multiSelect?: boolean;
  displayOrder?: number;
  options: PackageQuizOption[];
}

export interface PackageQuizPublic {
  id: string;
  code: string;
  tagline?: string | null;
  icon?: string;
  questions: PackageQuizQuestion[];
}

export interface PackageQuizAnswerInput {
  questionCode: string;
  optionCodes: string[];
}

export interface PackageQuizRecommendPackage extends PackageDto {
  recommendedType?: string;
}

export interface PackageQuizRecommendResult {
  quizCode: string;
  /** Wizard multi-step */
  answers?: PackageQuizAnswerInput[];
  /** Legacy single-question */
  questionCode?: string;
  selectedOptionCodes?: string[];
  recommendedTypes: string[];
  primaryType: string;
  resultsPath?: string;
  scrollToSection?: string;
  message: string;
  rankings: {
    packageType: string;
    score: number;
    label: string;
    sectionId: string;
  }[];
  packages?: PackageQuizRecommendPackage[];
  totalPackages?: number;
}
