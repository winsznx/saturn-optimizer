export const UI_TOKENS = {
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  duration: {
    fast: 120,
    base: 200,
    slow: 320,
  },
  zIndex: {
    dropdown: 20,
    sticky: 30,
    overlay: 40,
    modal: 50,
    toast: 60,
    tooltip: 70,
  },
} as const;

export type UiRadius = keyof typeof UI_TOKENS.radius;
export type UiDuration = keyof typeof UI_TOKENS.duration;
export type UiZIndex = keyof typeof UI_TOKENS.zIndex;
