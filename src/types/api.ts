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

export interface LeadCreateResponse {
  id: string;
  status: string;
  createdAt: string;
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
