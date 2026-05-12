import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing } from "../theme/spacing";

import { sharedStyles } from "../styles/shared";
import { workouts } from "../data/mockData";

export default function HomeScreen() {
  // const { currentStreak } = useWorkout();
  const currentStreak = 5; // demo
  const inProgressWorkout = workouts[0]; // demo

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: spacing.lg }}>
          <Text style={typography.title1}>Good morning, Alex</Text>
          <Text style={[typography.caption, { marginBottom: spacing.md }]}>
            Ready to push your limits today?
          </Text>

          {/* In Progress Card */}
          <View style={sharedStyles.card}>
            <Text
              style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}
            >
              IN PROGRESS
            </Text>
            <Text style={[typography.headline, { marginVertical: spacing.sm }]}>
              {inProgressWorkout.name}
            </Text>
            <View style={sharedStyles.row}>
              <Text style={{ color: colors.secondary }}>
                {inProgressWorkout.duration} MIN
              </Text>
              <Text style={{ color: colors.accent }}>320 KCAL</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 30,
                paddingVertical: 12,
                alignItems: "center",
                marginTop: spacing.md,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "bold" }}>
                Resume Workout
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Activity */}
          <View style={{ marginTop: spacing.lg }}>
            <Text style={typography.title2}>Weekly Activity</Text>
            <Text style={{ color: colors.accent, marginBottom: spacing.sm }}>
              CURRENT STREAK: {currentStreak} DAYS
            </Text>
            {/* Weekday circles omitted for brevity, similar to original */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
