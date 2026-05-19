import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../../component/ProgressBar";
import {
  ExerciseData,
  getExerciseByName,
} from "../../services/exerciseService";
import { sharedStyles } from "../../styles/shared";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

// src/app/(tabs)/active.tsx

// ✅ These are real ExerciseDB gym exercise names
const EXERCISE_CONFIG = [
  // Chest
  { name: "barbell bench press", duration: 45, sets: 4, rest: 60 },
  // Back
  { name: "pull up", duration: 40, sets: 3, rest: 60 },
  // Shoulders
  { name: "barbell overhead press", duration: 45, sets: 3, rest: 60 },
  // Biceps
  { name: "barbell curl", duration: 40, sets: 3, rest: 45 },
  // Triceps
  { name: "triceps dip", duration: 40, sets: 3, rest: 45 },
  // Upper legs
  { name: "barbell squat", duration: 50, sets: 4, rest: 90 },
  // Lower legs
  { name: "standing calf raises", duration: 35, sets: 3, rest: 45 },
  // Waist / core
  { name: "decline crunch", duration: 40, sets: 3, rest: 30 },
];

type Exercise = ExerciseData & {
  duration: number;
  sets: number;
};

export default function ActiveScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [curIndex, setCurIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_CONFIG[0].duration);
  const [isActive, setIsActive] = useState(false); // start paused until loaded
  const [kcal, setKcal] = useState(124);
  const [bpm, setBpm] = useState(142);
  const [elapsedTotal, setElapsedTotal] = useState(0);
  const [showTips, setShowTips] = useState(false);

  const heartAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const exercise = exercises[curIndex];
  const config = EXERCISE_CONFIG[curIndex];
  const totalTime = config?.duration ?? 45;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const overallProgress =
    (curIndex * 100) / EXERCISE_CONFIG.length +
    progress / EXERCISE_CONFIG.length;

  // Fetch all exercises from ExerciseDB on mount

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const results = await Promise.all(
          EXERCISE_CONFIG.map(async (cfg) => {
            let data = await getExerciseByName(cfg.name);

            // ✅ Fallback: if exact name fails, search broadly
            if (!data) {
              console.warn(`Trying broad search for: "${cfg.name}"`);
              const broad = await fetch(
                `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(cfg.name.split(" ")[0])}?limit=1`,
                {
                  headers: {
                    "X-RapidAPI-Key": "",
                    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
                  },
                },
              ).then((r) => r.json());
              data = broad[0] ?? null;
            }

            if (!data)
              throw new Error(`Could not find exercise: "${cfg.name}"`);

            return {
              ...data,
              duration: cfg.duration,
              sets: cfg.sets,
              rest: cfg.rest,
            };
          }),
        );

        setExercises(results);
        setTimeLeft(results[0].duration);
        setIsActive(true);
      } catch (err) {
        console.error("Failed to load exercises:", err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Fade in on exercise change
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [curIndex]);

  // Heart pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (loading) return;
    let interval: NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((p) => p - 1);
        setElapsedTotal((p) => p + 1);
        setKcal((p) => p + 0.3);
        setBpm(138 + Math.round(Math.sin(Date.now() / 2000) * 8));
      }, 1000);
    } else if (!loading && timeLeft === 0) {
      handleCompleteSet();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, loading]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleCompleteSet = () => {
    if (exercise && currentSet < exercise.sets) {
      setCurrentSet((p) => p + 1);
      setTimeLeft(totalTime);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    if (curIndex < exercises.length - 1) {
      const next = curIndex + 1;
      setCurIndex(next);
      setCurrentSet(1);
      setTimeLeft(exercises[next].duration);
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView
        style={[
          sharedStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <Text
          style={{
            color: colors.secondary,
            marginTop: spacing.md,
            letterSpacing: 1,
          }}
        >
          LOADING EXERCISES...
        </Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (fetchError || exercises.length === 0) {
    return (
      <SafeAreaView
        style={[
          sharedStyles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          },
        ]}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={colors.secondary}
        />
        <Text
          style={[
            typography.headline,
            { textAlign: "center", marginTop: spacing.md },
          ]}
        >
          Failed to load exercises
        </Text>
        <Text
          style={{
            color: colors.secondary,
            textAlign: "center",
            marginTop: spacing.sm,
          }}
        >
          Check your API key or internet connection
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GIF Hero — replaces Video/Image hero */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View
            style={{
              position: "relative",
              height: 260,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              source={{ uri: exercise.gifUrl }}
              style={{ width: "100%", height: 260 }}
              resizeMode="cover"
            />

            {/* Dark overlay */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 130,
                backgroundColor: "rgba(0,0,0,0.55)",
                justifyContent: "flex-end",
                padding: spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: colors.accent,
                      fontSize: 11,
                      letterSpacing: 2,
                      fontWeight: "600",
                    }}
                  >
                    CURRENT EXERCISE
                  </Text>
                  <Text
                    style={[typography.title1, { color: "#fff", marginTop: 2 }]}
                  >
                    {exercise.name.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Text>
                  {/* Live API data — target + body part */}
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {exercise.target} · {exercise.bodyPart} ·{" "}
                    {exercise.equipment}
                  </Text>
                </View>

                {/* Tips button */}
                <TouchableOpacity
                  onPress={() => setShowTips(true)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 20,
                    paddingHorizontal: spacing.md,
                    paddingVertical: 6,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons name="bulb-outline" size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 12 }}>Tips</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={{ padding: spacing.lg }}>
          {/* Timer */}
          <View style={{ alignItems: "center", marginBottom: spacing.md }}>
            <Text
              style={{ fontSize: 64, fontWeight: "bold", color: colors.accent }}
            >
              {fmt(timeLeft)}
            </Text>
            <Text
              style={{
                color: colors.secondary,
                fontSize: 11,
                letterSpacing: 1,
              }}
            >
              REMAINING
            </Text>
          </View>

          <ProgressBar
            progress={progress}
            height={6}
            style={{ marginBottom: spacing.sm }}
          />

          {/* Set dots */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginBottom: spacing.lg,
            }}
          >
            {Array.from({ length: exercise.sets }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor:
                    i < currentSet - 1 ? colors.accent : "transparent",
                  borderWidth: 1.5,
                  borderColor:
                    i <= currentSet - 1 ? colors.accent : colors.secondary,
                }}
              />
            ))}
          </View>

          {/* Overall progress */}
          <View style={{ marginBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color: colors.secondary,
                  fontSize: 11,
                  letterSpacing: 1,
                }}
              >
                WORKOUT PROGRESS
              </Text>
              <Text style={{ color: colors.secondary, fontSize: 11 }}>
                {Math.round(overallProgress)}%
              </Text>
            </View>
            <ProgressBar progress={overallProgress} height={4} />
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={[typography.title1, { fontSize: 24 }]}>
                {Math.round(kcal)}
              </Text>
              <Text style={typography.caption}>KCAL</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                  <Ionicons name="heart" size={20} color={colors.error} />
                </Animated.View>
                <Text style={[typography.title1, { fontSize: 24 }]}>{bpm}</Text>
              </View>
              <Text style={typography.caption}>BPM</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={[typography.title1, { fontSize: 24 }]}>
                {fmt(elapsedTotal)}
              </Text>
              <Text style={typography.caption}>ELAPSED</Text>
            </View>
          </View>

          {/* Controls */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsActive((p) => !p)}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                paddingVertical: spacing.md,
                borderRadius: 30,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {isActive ? "⏸  Pause" : "▶  Resume"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSkip}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                paddingVertical: spacing.md,
                borderRadius: 30,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                ⏭ Skip
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleCompleteSet}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 30,
              paddingVertical: spacing.md,
              alignItems: "center",
              marginBottom: spacing.xl,
            }}
          >
            <Text
              style={{
                color: colors.background,
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Complete Set {currentSet}/{exercise.sets} ✓
            </Text>
          </TouchableOpacity>

          {/* Queue with GIF thumbnails */}
          <Text
            style={{
              color: colors.secondary,
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: spacing.sm,
            }}
          >
            COMING UP
          </Text>
          {exercises.slice(curIndex + 1, curIndex + 4).map((ex, i) => (
            <View
              key={ex.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                backgroundColor: i === 0 ? colors.surface : colors.card,
                borderRadius: 14,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                borderWidth: i === 0 ? 1 : 0,
                borderColor: i === 0 ? colors.accent + "44" : "transparent",
              }}
            >
              {/* GIF thumbnail from API */}
              <View style={{ borderRadius: 10, overflow: "hidden" }}>
                <Image
                  source={{ uri: ex.gifUrl }}
                  style={{ width: 56, height: 56 }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: i === 0 ? colors.accent : colors.text,
                    fontWeight: "500",
                  }}
                >
                  {ex.name.replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {ex.target} · {ex.sets} sets · {fmt(ex.duration)}
                </Text>
              </View>
              {i === 0 && (
                <View
                  style={{
                    backgroundColor: colors.accent + "22",
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}
                >
                  <Text
                    style={{
                      color: colors.accent,
                      fontSize: 10,
                      letterSpacing: 1,
                    }}
                  >
                    NEXT
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Tips Modal — instructions from API */}
      <Modal visible={showTips} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: spacing.xl,
              maxHeight: "85%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: spacing.md,
              }}
            >
              <Text style={[typography.headline, { color: colors.accent }]}>
                💡 Form Tips
              </Text>
              <TouchableOpacity onPress={() => setShowTips(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[typography.title2, { marginBottom: spacing.sm }]}>
              {exercise.name.replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>

            {/* Muscle info pills from API */}
            <View
              style={{
                flexDirection: "row",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: spacing.md,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.accent + "22",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: colors.accent, fontSize: 11 }}>
                  🎯 {exercise.target}
                </Text>
              </View>
              {exercise.secondaryMuscles.slice(0, 2).map((m) => (
                <View
                  key={m}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                    {m}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                  🏋️ {exercise.equipment}
                </Text>
              </View>
            </View>

            {/* GIF in modal */}
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: spacing.md,
              }}
            >
              <Image
                source={{ uri: exercise.gifUrl }}
                style={{ width: "100%", height: 200 }}
                resizeMode="contain"
              />
            </View>

            {/* Step-by-step instructions from API */}
            <ScrollView
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
            >
              {exercise.instructions.map((step, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    gap: spacing.sm,
                    alignItems: "flex-start",
                    marginBottom: spacing.sm,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: colors.accent + "22",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.accent,
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                    >
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.text,
                      lineHeight: 22,
                      flex: 1,
                      fontSize: 14,
                    }}
                  >
                    {step}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowTips(false)}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 30,
                paddingVertical: spacing.md,
                alignItems: "center",
                marginTop: spacing.lg,
              }}
            >
              <Text style={{ color: colors.background, fontWeight: "700" }}>
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
