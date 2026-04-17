import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";

export default function ThemedScreen({
  children,
  scroll = true,
  contentContainerStyle,
  style,
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <SafeAreaView style={[styles.safe, style]}>
      <View style={styles.bgBlobTop} />
      <View style={styles.bgBlobBottom} />

      <Animated.View style={[styles.animatedLayer, { opacity, transform: [{ translateY }] }]}> 
        {scroll ? (
          <ScrollView contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fullContent, contentContainerStyle]}>{children}</View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  animatedLayer: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 110,
  },
  fullContent: {
    flex: 1,
    padding: 24,
  },
  bgBlobTop: {
    position: "absolute",
    top: -80,
    right: -30,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: COLORS.pink,
    opacity: 0.22,
  },
  bgBlobBottom: {
    position: "absolute",
    bottom: -100,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.purple,
    opacity: 0.18,
  },
});
