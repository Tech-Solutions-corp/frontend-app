import { apiRequest } from "./apiClient";
import { apiUpload } from "./apiClient";

export const financeApi = {
  login: (email, password) =>
    apiRequest("/api/v1/users/auth", {
      method: "POST",
      body: { email, password },
    }),

  getCurrentUser: (token) => apiRequest("/api/v1/users/me", { token }),

  register: ({ name, email, password }) =>
    apiRequest("/api/v1/users/register", {
      method: "POST",
      body: { name, email, password },
    }),

  forgotPassword: (email) =>
    apiRequest("/api/v1/users/password/forgot", {
      method: "POST",
      body: { email },
    }),

  resetPassword: ({ token, newPassword }) =>
    apiRequest("/api/v1/users/password/reset", {
      method: "POST",
      body: { token, newPassword },
    }),

  changePassword: (
    token,
    { currentPassword, newPassword, confirmNewPassword },
  ) =>
    apiRequest("/api/v1/users/password/change", {
      method: "POST",
      token,
      body: { currentPassword, newPassword, confirmNewPassword },
    }),

  changeEmail: (token, { currentPassword, newEmail }) =>
    apiRequest("/api/v1/users/email/change", {
      method: "POST",
      token,
      body: { currentPassword, newEmail },
    }),

  listAccountsByUser: (token, userId) =>
    apiRequest(`/api/v1/accounts/user/${userId}`, { token }),

  createAccount: (token, payload) =>
    apiRequest("/api/v1/accounts", {
      method: "POST",
      token,
      body: payload,
    }),

  // allow optional reassignToAccountId and reassignCategoryId query params when deleting an account
  deleteAccount: (token, accountId, reassignToAccountId, reassignCategoryId) => {
    let qs = "";
    if (reassignToAccountId) qs += `reassignToAccountId=${reassignToAccountId}`;
    if (reassignCategoryId) qs += (qs ? "&" : "") + `reassignCategoryId=${reassignCategoryId}`;
    return apiRequest(`/api/v1/accounts/${accountId}` + (qs ? `?${qs}` : ""), {
      method: "DELETE",
      token,
    });
  },

  listCategoriesByUser: (token, userId) =>
    apiRequest(`/api/v1/categories/user/${userId}`, { token }),

  createCategory: (token, payload) =>
    apiRequest("/api/v1/categories", {
      method: "POST",
      token,
      body: payload,
    }),
  deleteCategory: (token, categoryId, reassignTo) =>
    apiRequest(
      `/api/v1/categories/${categoryId}` +
        (reassignTo ? `?reassignTo=${reassignTo}` : ""),
      { method: "DELETE", token },
    ),

  listTransactionsByUser: (token, userId) =>
    apiRequest(`/api/v1/transactions/user/${userId}`, { token }),

  createTransaction: (token, payload) =>
    apiRequest("/api/v1/transactions", {
      method: "POST",
      token,
      body: payload,
    }),

  updateTransaction: (token, transactionId, payload) =>
    apiRequest(`/api/v1/transactions/${transactionId}`, {
      method: "PUT",
      token,
      body: payload,
    }),

  deleteTransaction: (token, transactionId) =>
    apiRequest(`/api/v1/transactions/${transactionId}`, {
      method: "DELETE",
      token,
    }),

  listMonthlyLimitsByUser: (token, userId) =>
    apiRequest(`/api/v1/monthly-limits/user/${userId}`, { token }),

  createMonthlyLimit: (token, payload) =>
    apiRequest("/api/v1/monthly-limits", {
      method: "POST",
      token,
      body: payload,
    }),

  listInsightsByUser: (token, userId) =>
    apiRequest(`/api/v1/ai-insights/user/${userId}`, { token }),

  createInsight: (token, payload) =>
    apiRequest("/api/v1/ai-insights", {
      method: "POST",
      token,
      body: payload,
    }),

  generateInsight: (token, payload) =>
    apiRequest("/api/v1/ai-insights/generate", {
      method: "POST",
      token,
      body: payload,
    }),

  listImportsByUser: (token, userId) =>
    apiRequest(`/api/v1/imports/user/${userId}`, { token }),

  reprocessImport: (token, importId) =>
    apiRequest(`/api/v1/imports/${importId}/reprocess`, {
      method: "POST",
      token,
    }),

  getInsightById: (token, insightId) =>
  apiRequest(`/api/v1/ai-insights/${insightId}`, { token }),

  createImport: (token, payload) =>
    apiRequest("/api/v1/imports", {
      method: "POST",
      token,
      body: payload,
    }),
  createImportFile: (token, { userId, accountId, file }) => {
    // file: { uri, name, type, blob? }
    const formData = new FormData();
    if (file && file.blob) {
      // append blob with filename (works in React Native when blob is available)
      formData.append("file", file.blob, file.name || "arquivo.csv");
    } else {
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type || "text/csv",
      });
    }
    formData.append("accountId", String(accountId));
    return apiUpload(`/api/v1/imports/${userId}/upload`, { token, formData });
  },
};
