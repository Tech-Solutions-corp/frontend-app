import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import SinoIcon from "../assets/sino-icon.png";
import { formatDateTime } from "../utils/dateFormatter";
import { COLORS } from "../constants/theme";

function formatInsightType(type = "") {
  if (type === "SPENDING_PATTERN") return "Padrão De Gastos";
  if (type === "SAVING_TIP") return "Dica De Economia";
  if (type === "ANOMALY_DETECTION") return "Detecção De Anomalia";
  return String(type)
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const NotificationBell = () => {
  const { token, userId } = useAuth();
  const [insights, setInsights] = useState([]);
  const [visible, setVisible] = useState(false);

  const loadInsights = async () => {
    try {
      const data = await financeApi.listInsightsByUser(token, userId);
      setInsights(data || []);
    } catch (e) {
      setInsights([]);
    }
  };

  useEffect(() => {
    if (!token || !userId) return;
    loadInsights();
  }, [token, userId]);

  const open = () => {
    loadInsights();
    setVisible(true);
  };

  const close = () => setVisible(false);

  return (
    <>
      <TouchableOpacity style={styles.headerBtn} onPress={open}>
        <Image style={styles.btn} source={SinoIcon} />
        {insights && insights.length > 0 ? <View style={styles.badge} /> : null}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Notificações</Text>
                {insights.length === 0 ? (
                  <Text style={styles.empty}>Nenhuma Notificação</Text>
                ) : (
                  <FlatList
                    data={insights}
                    keyExtractor={(i) => String(i.id)}
                    style={{ flexShrink: 1 }}
                    contentContainerStyle={{ paddingBottom: 4 }}
                    renderItem={({ item }) => (
                      <View style={styles.item}>
                        <Text style={styles.itemTitle}>
                          {formatInsightType(item.insightType)}
                        </Text>
                        <Text style={styles.itemText}>{item.content}</Text>
                        <Text style={styles.itemDate}>
                          {formatDateTime(item.generatedAt)}
                        </Text>
                      </View>
                    )}
                  />
                )}
                <TouchableOpacity style={styles.closeBtn} onPress={close}>
                  <Text style={styles.closeText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: { width: 23, height: 23 },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: COLORS.purple,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  modalCard: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.purple,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 8,
  },
  empty: { color: COLORS.indigo, textAlign: "center", paddingVertical: 12 },
  item: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE8FF",
    paddingBottom: 8,
  },
  itemTitle: { color: COLORS.purple, fontWeight: "700", marginBottom: 4 },
  itemText: { color: COLORS.navy },
  itemDate: { color: COLORS.indigo, fontSize: 12, marginTop: 6 },
  closeBtn: { marginTop: 8, alignItems: "center" },
  closeText: { color: COLORS.purple, fontWeight: "700" },
});

export default NotificationBell;
