import { adminApi } from "../lib/adminClient.js";

/**
 * Upload ảnh từ máy lên Cloudinary (qua BE).
 * @param {File} file
 * @param {string} [folder]
 */
export async function uploadAdminImage(file, folder) {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);

  const { data } = await adminApi.post("/admin/uploads/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Import ảnh từ URL có sẵn lên Cloudinary.
 * @param {{ url: string; folder?: string }} body
 */
export async function uploadAdminImageFromUrl(body) {
  const { data } = await adminApi.post("/admin/uploads/from-url", body);
  return data;
}
