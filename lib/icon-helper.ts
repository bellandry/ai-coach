import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import * as React from "react";

type LucideIcon = React.ComponentType<LucideProps>;

export function getLucideIcon(iconName: string): LucideIcon | null {
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[
    iconName
  ];
  return IconComponent || null;
}
