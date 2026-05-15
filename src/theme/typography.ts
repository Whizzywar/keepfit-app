import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  title1: { fontSize: 28, fontWeight: "bold", color: colors.text },
  title2: { fontSize: 24, fontWeight: "bold", color: colors.text },
  headline: { fontSize: 20, fontWeight: "600", color: colors.text },
  body: { fontSize: 16, color: colors.text },
  caption: { fontSize: 12, color: colors.textSecondary },
});
