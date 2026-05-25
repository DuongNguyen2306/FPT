import { linesToArray } from "./adminFormat.js";

/**
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ heroFile?: File | null; accentFile?: File | null; heroImageUrl?: string; folder?: string }} opts
 */
export function buildPackageFormData(values, opts = {}) {
  const { heroFile, accentFile, heroImageUrl, folder = "telecom-packages" } = opts;
  const fd = new FormData();

  if (heroFile) {
    fd.append("file", heroFile);
  } else if (heroImageUrl?.trim()) {
    fd.append("heroImage", heroImageUrl.trim());
  }

  if (accentFile) {
    fd.append("accentFile", accentFile);
  }

  const priceRaw = values.priceContact ? "" : values.price.trim();
  const features = (values.features ?? []).map((s) => s.trim()).filter(Boolean);

  const metadata = {};
  if (values.downloadMbps.trim()) metadata.downloadMbps = Number(values.downloadMbps);
  if (values.uploadMbps.trim()) metadata.uploadMbps = Number(values.uploadMbps);
  if (values.maxDevices.trim()) metadata.maxDevices = Number(values.maxDevices);
  if (values.audience.trim()) metadata.audience = values.audience.trim();
  const equipment = linesToArray(values.includedEquipmentText);
  const privileges = linesToArray(values.privilegesText);
  if (equipment.length) metadata.includedEquipment = equipment;
  if (privileges.length) metadata.privileges = privileges;

  fd.append("type", values.type);
  fd.append("code", values.code.trim());
  fd.append("name", values.name.trim());
  fd.append("tagline", values.tagline.trim());

  if (priceRaw !== "") fd.append("price", priceRaw);
  fd.append("billingCycle", values.billingCycle);
  fd.append("features", JSON.stringify(features));

  if (values.speedLabel?.trim()) {
    fd.append("speedLabel", values.speedLabel.trim());
  }
  if (values.displayCode?.trim()) fd.append("displayCode", values.displayCode.trim());
  if (values.promoBadge?.trim()) fd.append("promoBadge", values.promoBadge.trim());
  if (values.specLine?.trim()) fd.append("specLine", values.specLine.trim());
  if (values.description?.trim()) fd.append("description", values.description.trim());
  if (values.shortName?.trim()) fd.append("shortName", values.shortName.trim());
  if (values.specCaption?.trim()) fd.append("specCaption", values.specCaption.trim());
  if (values.statIcon?.trim()) fd.append("statIcon", values.statIcon.trim());

  if (Object.keys(metadata).length) {
    fd.append("metadata", JSON.stringify(metadata));
  }

  fd.append("folder", folder);
  fd.append("isActive", String(values.isActive));
  fd.append("sortOrder", String(Number(values.sortOrder) || 0));

  return fd;
}
