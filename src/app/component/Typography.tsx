import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { colors, typography as typographyStyles, spacing } from "@/theme";

type Variant = "title1" | "title2" | "headline" | "body" | "caption";

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color = colors.text,
  align = "left",
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      style={[typographyStyles[variant], { color, textAlign: align }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

// Pre‑defined convenience components
export const Title1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="title1" {...props} />
);
export const Title2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="title2" {...props} />
);
export const Headline: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="headline" {...props} />
);
export const Body: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="body" {...props} />
);
export const Caption: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="caption" {...props} />
);
