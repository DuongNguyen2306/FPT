import {
  formEquipmentToMetadata,
  formPrivilegesToMetadata,
  normalizeEquipment,
  normalizePrivileges,
} from "./packageHelpers.js";

/**
 * @typedef {Object} PackageDetailModalData
 * @property {string} id
 * @property {string} [code]
 * @property {string} name
 * @property {string} [tagline]
 * @property {string} [promoBadge]
 * @property {string} [heroImage]
 * @property {string} [accentImage]
 * @property {string} [lifestyleImageUrl]
 * @property {number} [price]
 * @property {number} [downloadMbps]
 * @property {number} [uploadMbps]
 * @property {number} [maxDevices]
 * @property {{ label: string; imageUrl?: string }[]} equipment
 * @property {{ title: string; description?: string; icon?: string; imageUrl?: string }[]} privileges
 * @property {string} [infrastructure]
 * @property {string} [qosTechnology]
 * @property {string[]} perks
 * @property {string} [installFeeNote]
 * @property {string} [contractNote]
 */

/**
 * @param {import('./mapPackageFromApi').ProductPlanItem | import('./mapPackageFromApi').SpeedXItem | null | undefined} pkg
 * @returns {PackageDetailModalData | null}
 */
export function toPackageDetailModalData(pkg) {
  if (!pkg) return null;

  const meta = pkg.metadata ?? {};
  const name = pkg.name ?? pkg.shortName ?? "Gói dịch vụ";
  const equipment = normalizeEquipment(meta.includedEquipment);

  const privileges = normalizePrivileges(meta.privileges);
  const perks = [];

  const features = Array.isArray(pkg.features) ? pkg.features.filter(Boolean) : [];
  for (const f of features.slice(0, 8)) {
    if (f && !perks.includes(f)) perks.push(f);
  }
  if (!privileges.length) {
    if (pkg.promoBadge?.trim()) perks.unshift(pkg.promoBadge.trim());
  }
  if (!perks.length) {
    perks.push(
      "Ưu đãi khi thanh toán online — liên hệ tư vấn để biết chi tiết",
      "Miễn phí công lắp đặt (áp dụng theo chương trình)",
      "Tặng modem / thiết bị theo gói đăng ký"
    );
  }

  const audience = meta.audience;
  const typeHint = pkg.type ?? meta.type;

  let infrastructure =
    (typeof meta.infrastructure === "string" && meta.infrastructure) ||
    (typeof meta.networkType === "string" && meta.networkType) ||
    "";
  if (!infrastructure && (typeHint === "SPEEDX" || String(name).toLowerCase().includes("speedx"))) {
    infrastructure = "XGS-PON";
  }
  if (!infrastructure) infrastructure = "GPON / FTTH";

  let qosTechnology =
    (typeof meta.qosPriority === "string" && meta.qosPriority) ||
    (typeof meta.qos === "string" && meta.qos) ||
    "";
  if (!qosTechnology && audience === "gamer") qosTechnology = "QoS Game ưu tiên";
  if (!qosTechnology && typeHint === "SPEEDX") qosTechnology = "Wi-Fi 7, băng thông ưu tiên";

  const maxDevices = meta.maxDevices ?? meta.maxConnectedDevices;

  const lifestyleImageUrl =
    (typeof meta.lifestyleImageUrl === "string" && meta.lifestyleImageUrl.trim()) || undefined;

  return {
    id: pkg.id,
    code: pkg.code,
    name,
    tagline: pkg.tagline,
    promoBadge: pkg.promoBadge?.trim() || undefined,
    heroImage: pkg.heroImage ?? pkg.bannerImage ?? undefined,
    accentImage: pkg.accentImage ?? undefined,
    lifestyleImageUrl,
    price: pkg.price,
    downloadMbps: pkg.downloadMbps ?? meta.downloadMbps,
    uploadMbps: pkg.uploadMbps ?? meta.uploadMbps,
    maxDevices: typeof maxDevices === "number" ? maxDevices : undefined,
    equipment:
      equipment.length > 0
        ? equipment
        : [
            { label: "Modem Wi-Fi 6 (theo gói)" },
            { label: "Hỗ trợ mesh khi nâng cấp" },
          ],
    privileges,
    infrastructure,
    qosTechnology,
    perks,
    installFeeNote:
      (typeof meta.installFeeNote === "string" && meta.installFeeNote) ||
      "Phí lắp đặt ban đầu có thể được miễn giảm theo chương trình khuyến mãi tại thời điểm đăng ký (thường ~300.000đ).",
    contractNote:
      (typeof meta.contractNote === "string" && meta.contractNote) ||
      (typeof meta.contractMonths === "number"
        ? `Thời gian cam kết sử dụng dịch vụ: ${meta.contractMonths} tháng (theo hợp đồng).`
        : "Thời gian cam kết và điều khoản hợp đồng áp dụng theo chính sách FPT Telecom tại thời điểm ký."),
  };
}

/**
 * Map form admin → dữ liệu modal chi tiết (live preview).
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ heroPreviewUrl?: string | null; accentPreviewUrl?: string | null }} [opts]
 * @returns {PackageDetailModalData}
 */
export function packageFormValuesToDetailModalData(values, opts = {}) {
  const priceRaw = values.price?.trim();
  const price =
    values.priceContact || !priceRaw || Number.isNaN(Number(priceRaw))
      ? undefined
      : Number(priceRaw);

  const downloadMbps = values.downloadMbps?.trim() ? Number(values.downloadMbps) : undefined;
  const uploadMbps = values.uploadMbps?.trim() ? Number(values.uploadMbps) : undefined;
  const maxDevices = values.maxDevices?.trim() ? Number(values.maxDevices) : undefined;

  return toPackageDetailModalData({
    id: "admin-preview",
    code: values.code?.trim() || undefined,
    type: values.type,
    name: values.name?.trim() || "Tên gói cước mẫu",
    tagline: values.tagline?.trim() || values.description?.trim()?.slice(0, 120),
    promoBadge: values.promoBadge?.trim(),
    heroImage: opts.heroPreviewUrl || values.heroImage?.trim() || undefined,
    accentImage: opts.accentPreviewUrl || values.accentImage?.trim() || undefined,
    price,
    downloadMbps,
    uploadMbps,
    metadata: {
      audience: values.audience,
      downloadMbps,
      uploadMbps,
      maxDevices,
      lifestyleImageUrl: values.lifestyleImageUrl?.trim() || undefined,
      includedEquipment: formEquipmentToMetadata(values.equipment ?? []),
      privileges: formPrivilegesToMetadata(values.privileges),
    },
    features: (values.features ?? []).map((s) => s.trim()).filter(Boolean),
  });
}
