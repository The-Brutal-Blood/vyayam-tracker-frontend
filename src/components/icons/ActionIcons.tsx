import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Stroke-style action icons on a 24pt grid, matching the tab icon language.
 * Color is passed in so they stay theme-agnostic.
 */

export interface ActionIconProps {
  color: string;
  size?: number;
}

const STROKE_WIDTH = 2;

export const PlusIcon = React.memo(function PlusIconBase({ color, size = 20 }: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <Path d="M5 12h14" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
  );
});

export const ClipboardIcon = React.memo(function ClipboardIconBase({
  color,
  size = 20,
}: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v14A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5v-14A1.5 1.5 0 0 0 17.5 5H16"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 2h5A1.5 1.5 0 0 1 16 3.5v1A1.5 1.5 0 0 1 14.5 6h-5A1.5 1.5 0 0 1 8 4.5v-1A1.5 1.5 0 0 1 9.5 2Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path d="M9 11.5h6" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <Path d="M9 15.5h6" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
  );
});

export const SearchIcon = React.memo(function SearchIconBase({
  color,
  size = 20,
}: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path d="m20.5 20.5-4.5-4.5" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
  );
});

export const CheckIcon = React.memo(function CheckIconBase({ color, size = 20 }: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m5 12.5 4.5 4.5L19 7"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const CloseIcon = React.memo(function CloseIconBase({ color, size = 20 }: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="m6 6 12 12" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <Path d="M18 6 6 18" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
  );
});

export const ChevronDownIcon = React.memo(function ChevronDownIconBase({
  color,
  size = 20,
}: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m6 9 6 6 6-6"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const DotsHorizontalIcon = React.memo(function DotsHorizontalIconBase({
  color,
  size = 20,
}: ActionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={12} r={1.8} fill={color} />
      <Circle cx={12} cy={12} r={1.8} fill={color} />
      <Circle cx={19} cy={12} r={1.8} fill={color} />
    </Svg>
  );
});
