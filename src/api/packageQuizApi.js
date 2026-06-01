import { api } from "../lib/apiClient.js";

/**
 * @param {string} [code]
 * @returns {Promise<import('../types/api').PackageQuizPublic>}
 */
export async function fetchPackageQuiz(code) {
  const { data } = await api.get("/package-quiz", { params: code ? { code } : {} });
  return data;
}

/**
 * @param {{
 *   quizCode?: string;
 *   questionCode?: string;
 *   optionCodes?: string[];
 *   answers?: import('../types/api').PackageQuizAnswerInput[];
 * }} body
 * @returns {Promise<import('../types/api').PackageQuizRecommendResult>}
 */
export async function recommendPackageTypes(body) {
  const { data } = await api.post("/package-quiz/recommend", body);
  return data;
}
