import { Alert, Platform } from "react-native";

let _showCustomAlert = null;

export function registerAlertHandler(handler) {
  _showCustomAlert = handler;
}

export function showAlert(title, message) {
  setTimeout(() => {
    if (_showCustomAlert) {
      _showCustomAlert(title, message);
    } else if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, 100);
}
