import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../component/ProgressBar";
import { sharedStyles } from "../styles/shared";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

import { Workout } from "../types/index";

export default function WorkoutsScreen() {
  const [selectedTab, setSelectedTab] = useState<
    "All" | "HIIT" | "Yoga" | "Strength"
  >("All");
  const tabs = ["All", "HIIT", "Yoga", "Strength"] as const;

  const libraryWorkouts: Workout[] = [
    {
      id: "wb1",
      name: "Full Body Strength",
      duration: 30,
      type: "Strength",
      intensity: "Moderate",
    },
    {
      id: "wb2",
      name: "Vinyasa Flow",
      duration: 20,
      type: "Yoga",
      intensity: "Low",
    },
    {
      id: "wb3",
      name: "Zero Gear Burn",
      duration: 15,
      type: "HIIT",
      intensity: "High",
    },
  ];

  const filteredWorkouts =
    selectedTab === "All"
      ? libraryWorkouts
      : libraryWorkouts.filter((w) => w.type === selectedTab);

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          <Text style={typography.title1}>VELOCITY</Text>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.surface,
              borderRadius: 12,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              alignItems: "center",
              marginTop: spacing.md,
            }}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              placeholder="Search for workouts, trainers..."
              placeholderTextColor={colors.textSecondary}
              style={{
                flex: 1,
                color: colors.text,
                marginLeft: spacing.sm,
                fontSize: 16,
              }}
            />
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: spacing.md, paddingLeft: spacing.lg }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: 20,
                backgroundColor:
                  selectedTab === tab ? colors.primary : colors.surface,
                marginRight: spacing.sm,
              }}
            >
              <Text
                style={{
                  color:
                    selectedTab === tab ? colors.text : colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended for You */}
        <View
          style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}
        >
          <Text style={[typography.title2, { marginBottom: spacing.sm }]}>
            ⭐ Recommended for You
          </Text>
          <View
            style={[
              sharedStyles.card,
              {
                backgroundColor: colors.card,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={[typography.headline, { color: colors.text }]}>
              Elite Power HIIT
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "bold" }}>
                START WORKOUT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Library */}
        <View style={{ marginHorizontal: spacing.lg }}>
          <Text style={typography.title2}>Workout Library</Text>
          {filteredWorkouts.map((workout) => (
            <View
              key={workout.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.card,
              }}
            >
              <View>
                <Text style={typography.body}>{workout.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {workout.duration} MIN · {workout.type} · {workout.intensity}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          ))}
        </View>

        {/* Weekly Progress */}
        <View
          style={{ marginHorizontal: spacing.lg, marginVertical: spacing.xl }}
        >
          <Text style={typography.title2}>WEEKLY PROGRESS</Text>
          <View style={sharedStyles.row}>
            <Text style={{ color: colors.text }}>4/7 SESSIONS</Text>
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              65%
            </Text>
          </View>
          <ProgressBar progress={65} color={colors.primary} height={10} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
