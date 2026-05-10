import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/theme";

interface ProgressBarProps {
  progress: number; // 0–100
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  height = 8,
}) => (
  <View style={[styles.background, { height }]}>
    <View
      style={[
        styles.fill,
        {
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: color,
        },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4 },
});
