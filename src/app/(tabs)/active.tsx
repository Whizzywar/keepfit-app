import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sharedStyles } from "../../styles/shared";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function ActiveScreen() {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) =>
    `00:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <SafeAreaView
      style={[
        sharedStyles.container,
        { justifyContent: "center", padding: spacing.xl },
      ]}
    >
      <Text
        style={{ color: colors.primary, textAlign: "center", letterSpacing: 1 }}
      >
        CURRENT EXERCISE
      </Text>
      <Text
        style={[
          typography.title1,
          { textAlign: "center", marginVertical: spacing.sm },
        ]}
      >
        Jumping Jacks
      </Text>
      <Text
        style={{
          fontSize: 64,
          fontWeight: "bold",
          color: colors.accent,
          textAlign: "center",
          marginVertical: spacing.lg,
        }}
      >
        {formatTime(timeLeft)}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: spacing.xl,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={[typography.title1, { fontSize: 28 }]}>124</Text>
          <Text style={typography.caption}>KCAL BURNED</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <Ionicons name="heart" size={24} color={colors.error} />
            <Text style={[typography.title1, { fontSize: 28 }]}>142</Text>
          </View>
          <Text style={typography.caption}>BPM</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          marginBottom: spacing.xl,
        }}
      >
        <TouchableOpacity
          onPress={() => setIsActive(false)}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            paddingVertical: spacing.md,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "600" }}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsActive(true)}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            paddingVertical: spacing.md,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "600" }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          padding: spacing.lg,
          borderRadius: 20,
          alignItems: "center",
        }}
      >
        <Text style={typography.caption}>NEXT UP</Text>
        <Text style={[typography.headline, { marginVertical: spacing.xs }]}>
          Forearm Plank
        </Text>
        <Text style={{ color: colors.secondary }}>Duration: 01:00</Text>
      </View>
    </SafeAreaView>
  );
}
