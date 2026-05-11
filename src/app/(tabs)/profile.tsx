import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing } from "../theme/spacing";
import { sharedStyles } from "../styles/shared";
import { useWorkout } from "../context/WorkoutContext";

export default function ProfileScreen() {
  const { currentStreak } = useWorkout();

  const personalBets = [
    { name: "DEADLIFT", value: "185 kg", date: "Oct 12, 2023" },
    { name: "5KM RUN", value: "19:42", date: "Nov 04, 2023" },
    { name: "MAX PLANK", value: "06:15", date: "Jan 15, 2024" },
  ];

  const recentActivities = [
    { name: "Morning Trail Run", xp: "+450 mins" },
    { name: "Heavy Leg Day", xp: "+820 mins" },
    { name: "Evening HIIT Cycle", xp: "+300 mins" },
  ];

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView>
        <View
          style={{
            padding: spacing.lg,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={typography.title1}>Jordan Vance</Text>
            <Text style={typography.caption}>
              Elite Level • Member since 2023
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                marginTop: spacing.sm,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  PRO ATHLETE
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.secondary,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: colors.background,
                  }}
                >
                  STREAK: {currentStreak} DAYS
                </Text>
              </View>
            </View>
          </View>
          <Ionicons name="person-circle" size={70} color={colors.text} />
        </View>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: spacing.lg,
            gap: spacing.sm,
            marginBottom: spacing.xl,
          }}
        >
          {[
            { value: "124.8", unit: "Hours", desc: "TOTAL PERFORMANCE" },
            { value: "142", desc: "WORKOUTS" },
            { value: "52K", desc: "CALORIES" },
            { value: "284", desc: "ACTIVE DAYS" },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                paddingVertical: spacing.md,
                borderRadius: 16,
                alignItems: "center",
                minWidth: "45%",
              }}
            >
              <Text
                style={[
                  typography.title1,
                  { fontSize: 22, color: colors.accent },
                ]}
              >
                {stat.value}
              </Text>
              {stat.unit && <Text style={typography.caption}>{stat.unit}</Text>}
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textSecondary,
                  marginTop: spacing.xs,
                }}
              >
                {stat.desc}
              </Text>
            </View>
          ))}
        </View>

        {/* Personal Bets */}
        <View
          style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}
        >
          <View style={sharedStyles.row}>
            <Text style={typography.title2}>Personal Bets</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontSize: 12 }}>
                VIEW ALL
              </Text>
            </TouchableOpacity>
          </View>
          {personalBets.map((bet, idx) => (
            <View key={idx} style={sharedStyles.row}>
              <View>
                <Text style={typography.body}>{bet.name}</Text>
                <Text style={typography.caption}>{bet.date}</Text>
              </View>
              <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
                {bet.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View
          style={{ marginHorizontal: spacing.lg, marginBottom: spacing.xl }}
        >
          <Text style={typography.title2}>Recent Activity</Text>
          {recentActivities.map((act, idx) => (
            <View
              key={idx}
              style={[sharedStyles.row, { paddingVertical: spacing.sm }]}
            >
              <Text style={typography.body}>{act.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                <Text style={{ color: colors.accent, fontWeight: "bold" }}>
                  +{act.xp}
                </Text>
                <Text style={typography.caption}>XP</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textSecondary}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
