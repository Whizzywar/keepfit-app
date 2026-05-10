import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing } from "@/theme";
import { sharedStyles } from "@/styles/shared";
import { ProgressBar } from "@/components/ProgressBar";
import { MacroRow } from "@/components/MacroRow";
import { dailyLogs } from "@/data/mockData";

export default function NutritionScreen() {
  const [water, setWater] = useState(1.2);
  const maxWater = 3.0;

  const macros = {
    protein: { current: 120, target: 180, unit: "g", color: colors.secondary },
    carbs: { current: 210, target: 250, unit: "g", color: colors.accent },
    fat: { current: 45, target: 70, unit: "g", color: colors.primary },
  };

  const recentIngredients = [
    "Greek Yogurt",
    "Almonds",
    "Whey Protein",
    "Blueberries",
    "Spinach",
  ];

  const addWater = (amount: number) =>
    setWater((prev) => Math.min(maxWater, prev + amount));

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          <Text style={typography.title1}>VELOCITY</Text>
          <Text style={[typography.caption, { marginBottom: spacing.md }]}>
            Nutrition Tracker
          </Text>
        </View>

        {/* Daily Progress Card */}
        <View style={sharedStyles.card}>
          <Text style={typography.title2}>Daily Progress</Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: colors.accent,
              marginBottom: spacing.md,
            }}
          >
            1,840 kcal left
          </Text>
          {Object.entries(macros).map(([key, val]) => (
            <MacroRow
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              current={val.current}
              target={val.target}
              unit={val.unit}
              color={val.color}
            />
          ))}
        </View>

        {/* Hydration Card */}
        <View style={sharedStyles.card}>
          <Text style={typography.title2}>Hydration</Text>
          <Text style={{ color: colors.text, marginBottom: spacing.sm }}>
            {water.toFixed(1)} L / {maxWater} Liters
          </Text>
          <ProgressBar progress={(water / maxWater) * 100} color="#3498db" />
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: spacing.md,
            }}
          >
            <TouchableOpacity
              onPress={() => addWater(0.25)}
              style={{
                backgroundColor: colors.card,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.secondary }}>+250ml</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => addWater(0.5)}
              style={{
                backgroundColor: colors.card,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.secondary }}>+500ml</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: colors.card,
              padding: spacing.sm,
              borderRadius: 12,
              marginTop: spacing.md,
            }}
          >
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              💡 PRO TIP
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Increasing your protein intake by 15% today could help reduce
              recovery time from your high-intensity session.
            </Text>
          </View>
        </View>

        {/* Daily Log Card */}
        <View style={sharedStyles.card}>
          <Text style={typography.title2}>Daily Log</Text>
          {dailyLogs.map((log, idx) => (
            <View
              key={idx}
              style={{
                marginBottom: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.card,
                paddingBottom: spacing.sm,
              }}
            >
              <View style={sharedStyles.row}>
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                  {log.meal}
                </Text>
                <Text style={{ color: colors.accent }}>{log.kcal} kcal</Text>
              </View>
              <Text style={[typography.body, { marginVertical: spacing.xs }]}>
                {log.title}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {log.desc}
              </Text>
              <Text style={{ color: colors.secondary, fontSize: 12 }}>
                P: {log.p}g C: {log.c}g F: {log.f}g
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Ingredients Card */}
        <View style={sharedStyles.card}>
          <Text style={typography.title2}>Recent Ingredients</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.sm,
              marginBottom: spacing.md,
            }}
          >
            {recentIngredients.map((item, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: colors.card,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: colors.text }}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: colors.accent, textAlign: "center" }}>
            🔥 You've hit your protein goals 4 days in a row!
          </Text>
        </View>

        {/* Post-Workout Nutrition Card */}
        <View style={sharedStyles.card}>
          <Text style={typography.title2}>Refuel & Recover</Text>
          <Text style={[typography.headline, { marginVertical: spacing.xs }]}>
            Citrus Salmon & Quinoa Power Bowl
          </Text>
          <Text
            style={{ color: colors.textSecondary, marginBottom: spacing.sm }}
          >
            This combination is precision-engineered for the metabolic window.
            The 35g of bioavailable protein from the salmon initiates muscle
            protein synthesis, while the complex carbohydrates in quinoa
            replenish glycogen stores.
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginBottom: spacing.sm,
            }}
          >
            <View
              style={{
                backgroundColor: `${colors.primary}20`,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                35g PROTEIN
              </Text>
            </View>
            <View
              style={{
                backgroundColor: `${colors.primary}20`,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                42g CARBS
              </Text>
            </View>
          </View>
          <Text style={{ fontWeight: "bold", color: colors.text }}>
            Quick Prep:
          </Text>
          <Text
            style={{ color: colors.textSecondary, marginBottom: spacing.md }}
          >
            1. Season salmon with lemon, salt, pepper. 2. Pan-sear for 4 mins
            per side. 3. Serve over pre-cooked quinoa with greens.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 30,
              paddingVertical: spacing.md,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontWeight: "bold" }}>
              📝 Log this meal
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
