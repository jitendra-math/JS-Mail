// src/lib/utils/haptic.ts

type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "error"
  | "warning";

// Check vibration support
function canVibrate(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

// Main trigger function
export function triggerHaptic(type: HapticType = "light") {
  if (!canVibrate()) return;

  switch (type) {
    case "light":
      navigator.vibrate?.(10);
      break;

    case "medium":
      navigator.vibrate?.(20);
      break;

    case "heavy":
      navigator.vibrate?.([30, 20, 30]);
      break;

    case "success":
      navigator.vibrate?.([15, 30, 15]);
      break;

    case "error":
      navigator.vibrate?.([40, 30, 40, 30, 40]);
      break;

    case "warning":
      navigator.vibrate?.([25, 20, 25]);
      break;

    default:
      navigator.vibrate?.(10);
  }
}

// Tiny helpers (optional use)
export const haptic = {
  light: () => triggerHaptic("light"),
  medium: () => triggerHaptic("medium"),
  heavy: () => triggerHaptic("heavy"),
  success: () => triggerHaptic("success"),
  error: () => triggerHaptic("error"),
  warning: () => triggerHaptic("warning"),
};