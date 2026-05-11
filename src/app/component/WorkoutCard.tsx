import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import type { Workout } from "../types/index";
import { Body, Caption, Typography } from "./Typography";

interface WorkoutCardProps {
  workout: Workout;
  onPress?: (workout: Workout) => void;
  showProgress?: boolean;
  progress?: number; // 0–100
  isActive?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
  showProgress = false,
  progress = 0,
  isActive = false,
}) => {
  const getIntensityColor = () => {
    switch (workout.intensity) {
      case "High":
        return colors.primary;
      case "Moderate":
        return colors.accent;
      default:
        return colors.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={() => onPress?.(workout)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Typography variant="headline" color={colors.text}>
            {workout.name}
          </Typography>
          {isActive && (
            <View style={styles.activeBadge}>
              <Typography variant="caption" color={colors.background}>
                IN PROGRESS
              </Typography>
            </View>
          )}
        </View>
        <Ionicons name="fitness" size={24} color={colors.secondary} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons
            name="time-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Caption>{workout.duration} min</Caption>
        </View>
        <View style={styles.detailItem}>
          <Ionicons
            name="barbell-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Caption>{workout.type}</Caption>
        </View>
        <View style={styles.detailItem}>
          <View
            style={[
              styles.intensityDot,
              { backgroundColor: getIntensityColor() },
            ]}
          />
          <Caption>{workout.intensity}</Caption>
        </View>
      </View>

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Caption>{Math.round(progress)}% completed</Caption>
        </View>
      )}

      {!showProgress && (
        <View style={styles.footer}>
          <Body color={colors.secondary}>START</Body>
          <Ionicons
            name="arrow-forward-circle"
            size={24}
            color={colors.secondary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  activeContainer: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  details: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.card,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.secondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
