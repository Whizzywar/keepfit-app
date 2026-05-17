import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
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
import { sharedStyles } from "../../styles/shared";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const EXERCISES = [
  {
    name: "Jumping Jacks",
    duration: 45,
    sets: 3,
    muscle: "Full Body",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // replace with real exercise video URL
    tips: "Keep arms fully extended overhead. Land softly on the balls of your feet.",
  },
  {
    name: "Forearm Plank",
    duration: 60,
    sets: 2,
    muscle: "Core",
    image:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    tips: "Keep hips level. Don't let your lower back sag. Breathe steadily.",
  },
  {
    name: "Push-Ups",
    duration: 40,
    sets: 3,
    muscle: "Chest · Triceps",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    tips: "Lower chest to just above the floor. Keep elbows at 45°. Full extension at top.",
  },
  {
    name: "Mountain Climbers",
    duration: 30,
    sets: 3,
    muscle: "Core · Cardio",
    image:
      "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    tips: "Keep hips low and level. Drive knees toward chest at a steady pace.",
  },
  {
    name: "Burpees",
    duration: 45,
    sets: 2,
    muscle: "Full Body",
    image:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    tips: "Explode upward on the jump. Land with soft knees. Keep core tight throughout.",
  },
];

export default function ActiveScreen() {
  const [curIndex, setCurIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(EXERCISES[0].duration);
  const [isActive, setIsActive] = useState(true);
  const [kcal, setKcal] = useState(124);
  const [bpm, setBpm] = useState(142);
  const [elapsedTotal, setElapsedTotal] = useState(130);
  const [showTips, setShowTips] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<Video>(null);
  const modalVideoRef = useRef<Video>(null);
  const heartAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const exercise = EXERCISES[curIndex];
  const totalTime = exercise.duration;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const overallProgress =
    (curIndex * 100) / EXERCISES.length + progress / EXERCISES.length;

  // Fade in when exercise changes
  useEffect(() => {
    setVideoError(false);
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
    let interval: NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((p) => p - 1);
        setElapsedTotal((p) => p + 1);
        setKcal((p) => p + 0.3);
        setBpm(138 + Math.round(Math.sin(Date.now() / 2000) * 8));
      }, 1000);
    } else if (timeLeft === 0) {
      handleCompleteSet();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Pause/resume video when workout pauses
  useEffect(() => {
    if (videoRef.current) {
      isActive ? videoRef.current.playAsync() : videoRef.current.pauseAsync();
    }
  }, [isActive]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleCompleteSet = () => {
    if (currentSet < exercise.sets) {
      setCurrentSet((p) => p + 1);
      setTimeLeft(totalTime);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    if (curIndex < EXERCISES.length - 1) {
      const next = curIndex + 1;
      setCurIndex(next);
      setCurrentSet(1);
      setTimeLeft(EXERCISES[next].duration);
    }
  };

  const toggleVideoPlay = async () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsVideoPlaying((p) => !p);
  };

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video Hero */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View
            style={{
              position: "relative",
              height: 240,
              backgroundColor: colors.surface,
            }}
          >
            {!videoError ? (
              <Video
                ref={videoRef}
                source={{ uri: exercise.video }}
                style={{ width: "100%", height: 240 }}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={isActive}
                isMuted={false}
                onError={() => setVideoError(true)}
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded) {
                    setIsVideoPlaying(status.isPlaying);
                  }
                }}
              />
            ) : (
              // Fallback to image if video fails
              <Image
                source={{ uri: exercise.image }}
                style={{ width: "100%", height: 240 }}
                resizeMode="cover"
              />
            )}

            {/* Overlay */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                backgroundColor: "rgba(0,0,0,0.5)",
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
                    {exercise.name}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {exercise.muscle}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  {/* Play/Pause video button */}
                  {!videoError && (
                    <TouchableOpacity
                      onPress={toggleVideoPlay}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: 20,
                        padding: 8,
                      }}
                    >
                      <Ionicons
                        name={isVideoPlaying ? "pause" : "play"}
                        size={16}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  )}

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

          {/* Queue with thumbnails */}
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
          {EXERCISES.slice(curIndex + 1, curIndex + 4).map((ex, i) => (
            <View
              key={ex.name}
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
              <View style={{ borderRadius: 10, overflow: "hidden" }}>
                <Image
                  source={{ uri: ex.image }}
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
                  {ex.name}
                </Text>
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {ex.muscle} · {ex.sets} sets · {fmt(ex.duration)}
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

      {/* Tips Modal with video */}
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
              {exercise.name}
            </Text>

            {/* Video in modal */}
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: spacing.md,
              }}
            >
              <Video
                ref={modalVideoRef}
                source={{ uri: exercise.video }}
                style={{ width: "100%", height: 200 }}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted
              />
            </View>

            <Text style={{ color: colors.text, lineHeight: 22, fontSize: 15 }}>
              {exercise.tips}
            </Text>

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
