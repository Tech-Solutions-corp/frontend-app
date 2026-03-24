import { apiRequest } from "./apiClient";

export const financeApi = {
  login: (email, password) =>
    apiRequest("/api/v1/users/auth", {
      method: "POST",
      body: { email, password },
    }),

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

  listAccountsByUser: (token, userId) =>
    apiRequest(`/api/v1/accounts/user/${userId}`, { token }),

  createAccount: (token, payload) =>
    apiRequest("/api/v1/accounts", {
      method: "POST",
      token,
      body: payload,
    }),

  listCategoriesByUser: (token, userId) =>
    apiRequest(`/api/v1/categories/user/${userId}`, { token }),

  createCategory: (token, payload) =>
    apiRequest("/api/v1/categories", {
      method: "POST",
      token,
      body: payload,
    }),

  listTransactionsByUser: (token, userId) =>
    apiRequest(`/api/v1/transactions/user/${userId}`, { token }),

  createTransaction: (token, payload) =>
    apiRequest("/api/v1/transactions", {
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

  listImportsByUser: (token, userId) =>
    apiRequest(`/api/v1/imports/user/${userId}`, { token }),

  createImport: (token, payload) =>
    apiRequest("/api/v1/imports", {
      method: "POST",
      token,
      body: payload,
    }),
};
