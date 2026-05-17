import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";

import { MacroRow } from "../../component/MacroRow";
import { ProgressBar } from "../../component/ProgressBar";
import { Body, Caption, Title1, Title2 } from "../../component/Typography";
import { WorkoutCard } from "../../component/WorkoutCard";
import { useWorkout } from "../../context/WorkoutContext"; //
import { workouts } from "../../data/mockData";
import { sharedStyles } from "../../styles/shared";
import { spacing } from "../../theme/spacing";

export default function HomeScreen() {
  const { currentStreak } = useWorkout();
  const inProgressWorkout = workouts[0];

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: spacing.lg }}>
          <Title1>Good morning, Whizzy</Title1>
          <Caption style={{ marginBottom: spacing.md }}>
            Ready to push your limits today?
          </Caption>

          <WorkoutCard
            workout={inProgressWorkout}
            isActive={true}
            showProgress={true}
            progress={53} // example: 24/45 min ≈ 53%
            onPress={() => console.log("Resume workout")}
          />

          {/* Progress Bar */}
          <View style={{ marginTop: spacing.md }}>
            <Body style={{ marginBottom: spacing.sm }}>Workout Progress</Body>
            <ProgressBar progress={53} height={8} />
          </View>

          {/* Macros */}
          <View style={{ marginTop: spacing.lg }}>
            <Title2>Today's Nutrition</Title2>
            <MacroRow
              macros={[
                { label: "Calories", value: 1840, unit: "kcal" },
                { label: "Protein", value: 124, unit: "g" },
                { label: "Carbs", value: 210, unit: "g" },
                { label: "Fat", value: 58, unit: "g" },
              ]}
            />
          </View>

          {/* Weekly Activity Section */}
          <View style={{ marginTop: spacing.lg }}>
            <Title2>Weekly Activity</Title2>
            <Body style={{ color: colors.accent, marginBottom: spacing.sm }}>
              CURRENT STREAK: {currentStreak} DAYS
            </Body>
            {/* Weekday circles can be added here as before */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
