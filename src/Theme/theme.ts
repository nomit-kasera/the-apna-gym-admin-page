import { createSystem, defaultConfig, defineTokens } from "@chakra-ui/react";

const colors = defineTokens.colors({
  primary: { value: "#ef4b6e" },
  "primary-foreground": { value: "#ffffff" },
  secondary: { value: "#111111" },
  "secondary-foreground": { value: "#ffffff" },
  background: { value: "#f8f9fa" },
  foreground: { value: "#1a1a1a" },
  muted: { value: "#dedede" },
  card: { value: "#ffffff" },
  border: { value: "#d1d1d1" },
  mutedForeground: {value: "#484848"}
});

const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        ...colors,
      },
    },
  },
  globalCss: {
    body: {
      bg: "background",
      color: "foreground",
    },
  },
});

export default theme;
