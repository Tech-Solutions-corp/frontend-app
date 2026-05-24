import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useI18n } from "../context/I18nContext";
import { COLORS, SHADOW } from "../constants/theme";

const FEATURES = [
  { titleKey: "welcome_feature_1_title", descKey: "welcome_feature_1_desc" },
  { titleKey: "welcome_feature_2_title", descKey: "welcome_feature_2_desc" },
  { titleKey: "welcome_feature_3_title", descKey: "welcome_feature_3_desc" },
  { titleKey: "welcome_feature_4_title", descKey: "welcome_feature_4_desc" },
  { titleKey: "welcome_feature_5_title", descKey: "welcome_feature_5_desc" },
];

export default function WelcomeModal({ visible, onClose }) {
  const { t } = useI18n();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Ícone de planta */}
              <View style={styles.iconWrap}>
                <Text style={styles.iconEmoji}>🌱</Text>
              </View>

              <Text style={styles.title}>{t("welcome_title")}</Text>
              <Text style={styles.subtitle}>{t("welcome_subtitle")}</Text>

              <View style={styles.divider} />

              <ScrollView
                style={styles.featuresScroll}
                showsVerticalScrollIndicator={false}
              >
                {FEATURES.map((feature) => (
                  <View key={feature.titleKey} style={styles.featureRow}>
                    <Text style={styles.featureTitle}>{t(feature.titleKey)}</Text>
                    <Text style={styles.featureDesc}>{t(feature.descKey)}</Text>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.btn} onPress={onClose}>
                <Text style={styles.btnText}>{t("welcome_ready")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxHeight: "82%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E1FF",
    ...SHADOW,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EDF7EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 34,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.navy,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.indigo,
    textAlign: "center",
    marginBottom: 14,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.purple,
    marginBottom: 16,
  },
  featuresScroll: {
    width: "100%",
    flexShrink: 1,
  },
  featureRow: {
    marginBottom: 14,
    backgroundColor: "#F7F4FF",
    borderRadius: 12,
    padding: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 13,
    color: COLORS.indigo,
    lineHeight: 18,
  },
  btn: {
    marginTop: 18,
    backgroundColor: COLORS.indigo,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
