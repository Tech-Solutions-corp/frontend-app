import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Alert } from "react-native";

const ErrorContext = createContext(null);

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const showError = useCallback((message) => {
    console.error("[ErrorProvider]", message);
    setError(message);
    // Mostrar alerta de forma síncrona
    Alert.alert("Erro", message, [
      {
        text: "OK",
        onPress: () => setError(null),
      },
    ]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      error,
      showError,
      clearError,
    }),
    [error, showError, clearError],
  );

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError deve ser usado dentro de ErrorProvider");
  }
  return context;
}
