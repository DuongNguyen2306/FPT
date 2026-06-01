import type { PackageDto, PackageMetadata, PackageType } from "../types/api";
import {
  normalizeEquipment,
  normalizePrivileges,
} from "./packageHelpers.js";

/** Gộp metadata lồng nhau + field top-level từ BE. */
export function resolvePackageMetadata(p: PackageDto): PackageMetadata {
  const m = p.metadata ?? {};
  return {
    ...m,
    downloadMbps: m.downloadMbps ?? p.downloadMbps,
    uploadMbps: m.uploadMbps ?? p.uploadMbps,
    includedEquipment: m.includedEquipment ?? p.includedEquipment,
    privileges: m.privileges ?? p.privileges,
  };
}

function toStringList(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return [String(v)];
}

function pickId(p: PackageDto): string {
  return String(p.id ?? p._id ?? p.code ?? "");
}

function pickBannerImage(p: PackageDto): string | undefined {
  const meta = p.metadata as { bannerImage?: string } | undefined;
  const url = p.bannerImage ?? meta?.bannerImage;
  return typeof url === "string" && url.trim() ? url.trim() : undefined;
}

/** Ảnh sản phẩm (thẻ gói, trang chi tiết) — không dùng banner. */
function pickImage(p: PackageDto): string | undefined {
  const url = p.heroImage ?? p.imageUrl ?? p.image;
  return typeof url === "string" && url.trim() ? url.trim() : undefined;
}

function pickPrice(p: PackageDto): number | undefined {
  const v = p.price ?? p.monthlyPrice;
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

function bandwidthLine(p: PackageDto): string {
  const meta = resolvePackageMetadata(p);
  const down = meta.downloadMbps;
  const up = meta.uploadMbps;
  if (down != null && up != null && down === up) {
    return `${down} Mbps (đối xứng)`;
  }
  if (down != null && up != null) {
    return `${down}/${up} Mbps`;
  }
  if (down != null) return `${down} Mbps`;
  if (p.specLine) return p.specLine;
  return "";
}

function pickFeatures(p: PackageDto): string[] {
  if (Array.isArray(p.features) && p.features.length) return p.features;
  if (Array.isArray(p.bullets) && p.bullets.length) return p.bullets;
  if (Array.isArray(p.featureList) && p.featureList.length) return p.featureList;
  if (p.description) return [p.description];
  return [];
}

function statIconForType(t: string | undefined): string {
  switch (t) {
    case "FPT_PLAY":
      return "tv";
    case "CAMERA":
      return "camera";
    case "SERVICE":
      return "sparkles";
    case "INTERNET":
    case "SPEEDX":
    default:
      return "gauge";
  }
}

/** Item cho ProductPlanCard / OfferCard / PackageCard */
export interface ProductPlanItem {
  id: string;
  code?: string;
  displayCode: string;
  name: string;
  metadata?: PackageMetadata;
  tagline?: string;
  promoBadge?: string;
  bannerImage?: string;
  heroImage?: string;
  accentImage?: string | null;
  price?: number;
  priceNote?: string;
  priceDisplay?: string;
  specCaption: string;
  specLine: string;
  downloadMbps?: number;
  uploadMbps?: number;
  statIcon: string;
  features: string[];
  /** Nhóm tab: personal | family | gamer | combo-camera | combo-tv */
  audience?: string;
}

/** Item cho SpeedXCard */
export interface SpeedXItem {
  id: string;
  code?: string;
  metadata?: PackageMetadata;
  displayCode: string;
  shortName: string;
  tagline?: string;
  bannerImage?: string;
  heroImage?: string;
  price?: number;
  specCaption: string;
  specLine: string;
  features: string[];
}

export function mapPackageToProductPlan(
  p: PackageDto,
  fallbackType?: PackageType
): ProductPlanItem {
  const type = (p.type as string | undefined) ?? fallbackType ?? "INTERNET";
  const id = pickId(p);
  const meta = resolvePackageMetadata(p);
  const name = p.name ?? p.shortName ?? p.code ?? pickId(p);
  const displayCode =
    (p.displayCode ?? p.code ?? type).toString().toUpperCase();
  const statIcon = (p.statIcon as string | undefined) ?? statIconForType(type);

  const audience =
    typeof meta.audience === "string"
      ? meta.audience
      : inferAudience(p, name, p.code);

  return {
    id,
    code: p.code,
    metadata: meta,
    displayCode,
    name,
    tagline: p.tagline ?? p.description,
    promoBadge: p.promoBadge,
    bannerImage: pickBannerImage(p),
    heroImage: pickImage(p),
    accentImage: p.accentImage ?? p.secondaryImage ?? null,
    price: pickPrice(p),
    specCaption: p.specCaption ?? "",
    specLine: p.specLine ?? bandwidthLine(p),
    downloadMbps: meta.downloadMbps,
    uploadMbps: meta.uploadMbps,
    statIcon,
    features: pickFeatures(p),
    audience,
  };
}

function inferAudience(
  p: PackageDto,
  name: string,
  code?: string
): string {
  const blob = `${code ?? ""} ${name} ${p.displayCode ?? ""}`.toLowerCase();
  if (blob.includes("combo") && blob.includes("camera")) return "combo-camera";
  if (blob.includes("combo") || blob.includes("truyền hình") || blob.includes("tv"))
    return "combo-tv";
  if (blob.includes("game") || blob.includes("meta")) return "gamer";
  if (blob.includes("sky") || blob.includes("gia đình") || blob.includes("family"))
    return "family";
  return "personal";
}

export function mapPackageToSpeedX(
  p: PackageDto,
  fallbackType?: PackageType
): SpeedXItem {
  const type = (p.type as string | undefined) ?? fallbackType ?? "SPEEDX";
  const id = pickId(p);
  const price = pickPrice(p);
  const shortName = p.shortName ?? p.name ?? p.code ?? pickId(p);

  return {
    id,
    code: p.code,
    metadata: resolvePackageMetadata(p),
    displayCode: (p.displayCode ?? p.code ?? type).toString().toUpperCase(),
    shortName,
    tagline: p.tagline ?? p.description,
    bannerImage: pickBannerImage(p),
    heroImage: pickImage(p),
    price,
    specCaption: p.specCaption ?? "",
    specLine: p.specLine ?? bandwidthLine(p),
    features: pickFeatures(p),
  };
}

function pickDetailBullets(p: PackageDto): string[] {
  if (Array.isArray(p.features) && p.features.length) return p.features;
  if (Array.isArray(p.bullets) && p.bullets.length) return p.bullets;
  if (Array.isArray(p.featureList) && p.featureList.length) return p.featureList;
  if (p.description) return [p.description];
  return [];
}

/** View thống nhất cho trang / modal chi tiết gói. */
export interface PackageDetailView {
  id: string;
  code?: string;
  type?: string;
  displayCode: string;
  name: string;
  tagline?: string;
  description?: string;
  promoBadge?: string;
  heroImage?: string;
  accentImage?: string | null;
  price?: number;
  specCaption: string;
  specLine: string;
  downloadMbps?: number;
  uploadMbps?: number;
  maxDevices?: number;
  heroHeadline?: string;
  lifestyleImageUrl?: string;
  detailBullets: string[];
  includedEquipment: { label: string; imageUrl?: string }[];
  privileges: { title: string; description?: string; icon?: string }[];
  features: string[];
}

export function mapDtoToDetailView(p: PackageDto): PackageDetailView {
  const type = (p.type as string | undefined) ?? "INTERNET";
  const meta = resolvePackageMetadata(p);
  const includedEquipment = normalizeEquipment(meta.includedEquipment);
  const privileges = normalizePrivileges(meta.privileges);
  const detailBullets = pickDetailBullets(p);
  const heroHeadline = meta.heroHeadline;
  const lifestyleImageUrl = meta.lifestyleImageUrl;
  const maxDevices =
    typeof meta.maxDevices === "number"
      ? meta.maxDevices
      : typeof meta.maxConnectedDevices === "number"
        ? meta.maxConnectedDevices
        : undefined;

  if (type === "SPEEDX") {
    const sx = mapPackageToSpeedX(p, "SPEEDX");
    const m = sx.metadata ?? {};
    return {
      id: sx.id,
      code: sx.code,
      type: "SPEEDX",
      displayCode: sx.displayCode,
      name: sx.shortName,
      tagline: sx.tagline,
      description: p.description,
      promoBadge: p.promoBadge,
      heroImage: sx.heroImage,
      accentImage: p.accentImage ?? p.secondaryImage ?? null,
      price: sx.price,
      specCaption: sx.specCaption,
      specLine: sx.specLine,
      downloadMbps: m.downloadMbps,
      uploadMbps: m.uploadMbps,
      maxDevices,
      heroHeadline,
      lifestyleImageUrl,
      detailBullets: detailBullets.length ? detailBullets : sx.features,
      includedEquipment,
      privileges,
      features: sx.features,
    };
  }
  const plan = mapPackageToProductPlan(p, type as PackageType);
  return {
    id: plan.id,
    code: plan.code,
    type,
    displayCode: plan.displayCode,
    name: plan.name,
    tagline: plan.tagline,
    description: p.description,
    promoBadge: plan.promoBadge,
    heroImage: plan.heroImage,
    accentImage: plan.accentImage,
    price: plan.price,
    specCaption: plan.specCaption,
    specLine: plan.specLine,
    downloadMbps: plan.downloadMbps,
    uploadMbps: plan.uploadMbps,
    maxDevices,
    heroHeadline,
    lifestyleImageUrl,
    detailBullets: detailBullets.length ? detailBullets : plan.features,
    includedEquipment,
    privileges,
    features: plan.features,
  };
}

/** Tìm gói combo (Internet + TV) theo code hoặc tên. */
export function findComboPackageId(internet: ProductPlanItem[]): string | null {
  const hit = internet.find((x) => {
    const code = (x.displayCode ?? "").toLowerCase();
    const name = (x.name ?? "").toLowerCase();
    return code.includes("combo") || name.includes("combo");
  });
  return hit?.id ?? null;
}
