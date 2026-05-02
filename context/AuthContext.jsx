import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUnauthorizedCallback } from "../services/apiClient";
import { financeApi } from "../services/financeApi";

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "auth_user_id";
const USER_EMAIL_KEY = "auth_user_email";
const USER_NAME_KEY = "auth_user_name";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [savedToken, savedUserId, savedEmail, savedName] =
          await Promise.all([
            AsyncStorage.getItem(TOKEN_KEY),
            AsyncStorage.getItem(USER_ID_KEY),
            AsyncStorage.getItem(USER_EMAIL_KEY),
            AsyncStorage.getItem(USER_NAME_KEY),
          ]);

        setToken(savedToken);
        setUserId(savedUserId);
        setUserEmail(savedEmail);
        setUserName(savedName);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email, password) => {
    const auth = await financeApi.login(email, password);
    setToken(auth.token);
    setUserId(String(auth.id));
    setUserEmail(email);

    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, auth.token),
      AsyncStorage.setItem(USER_ID_KEY, String(auth.id)),
      AsyncStorage.setItem(USER_EMAIL_KEY, email),
    ]);

    try {
      const userData = await financeApi.getCurrentUser(auth.token);
      const userName = userData?.name || email;
      setUserName(userName);
      await AsyncStorage.setItem(USER_NAME_KEY, userName);
    } catch (err) {
      setUserName(email);
      await AsyncStorage.setItem(USER_NAME_KEY, email);
    }
  };

  const register = async ({ name, email, password }) => {
    const created = await financeApi.register({ name, email, password });
    setUserName(created?.name || name);
    await AsyncStorage.setItem(USER_NAME_KEY, created?.name || name);
    await login(email, password);
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_ID_KEY),
      AsyncStorage.removeItem(USER_EMAIL_KEY),
      AsyncStorage.removeItem(USER_NAME_KEY),
    ]);
    setToken(null);
    setUserId(null);
    setUserEmail(null);
    setUserName(null);
  };

  useEffect(() => {
    setUnauthorizedCallback(async () => {
      await logout();
      router.replace("/login");
    });
  }, []);

  const value = useMemo(
    () => ({
      token,
      userId,
      userEmail,
      userName,
      loading,
      isAuthenticated: Boolean(token && userId),
      login,
      register,
      logout,
      forgotPassword: financeApi.forgotPassword,
      resetPassword: financeApi.resetPassword,
      changePassword: (payload) => financeApi.changePassword(token, payload),
      changeEmail: (payload) => financeApi.changeEmail(token, payload),
    }),
    [token, userId, userEmail, userName, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
