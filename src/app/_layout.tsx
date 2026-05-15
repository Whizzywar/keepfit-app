import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { WorkoutProvider } from "../context/WorkoutContext";

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </WorkoutProvider>
  );
}
