import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Stroke-style tab bar icons on a 24pt grid. Color comes from the tab
 * navigator's active/inactive tint, so these stay theme-agnostic.
 */

export interface TabIconProps {
  color: string;
  size?: number;
}

const STROKE_WIDTH = 2;

export const HomeIcon = React.memo(function HomeIconBase({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20v-9.5Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 21.5v-7h5v7"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const DumbbellIcon = React.memo(function DumbbellIconBase({
  color,
  size = 24,
}: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8.5 12h7" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <Path
        d="M6 7.5h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M17 7.5h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path d="M2.5 10v4" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <Path d="M21.5 10v4" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
  );
});

export const UserIcon = React.memo(function UserIconBase({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={7.5} r={3.5} stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path
        d="M4.5 20.5v-1a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v1"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
});
