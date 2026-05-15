import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { ProgressBar } from "./ProgressBar";

interface MacroRowProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export const MacroRow: React.FC<MacroRowProps> = ({
  label,
  current,
  target,
  unit,
  color,
}) => (
  <View style={styles.container}>
    <View style={styles.labelRow}>
      <Text style={typography.body}>{label}</Text>
      <Text style={styles.values}>
        {current}
        {unit} / {target}
        {unit}
      </Text>
    </View>
    <ProgressBar progress={(current / target) * 100} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  values: { color: colors.textSecondary, fontSize: 12 },
});
