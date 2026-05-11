import { Stack } from "expo-router";
import { WorkoutProvider } from "../contexts/WorkoutContext";
import { StatusBar } from "expo-status-bar";

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
