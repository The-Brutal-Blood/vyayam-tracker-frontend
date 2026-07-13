import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors } from '@/theme';

import type { BodyWeightEntry } from '../types/bodyWeight.types';
import { formatEntryDate } from '../utils/weightFormat';

export interface WeightChartProps {
  /** Entries in chronological (oldest → newest) order. */
  entries: BodyWeightEntry[];
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HEIGHT = 210;
const Y_AXIS_WIDTH = 42;
const X_AXIS_HEIGHT = 22;
const PAD_TOP = 16;
const PAD_RIGHT = 16;
const MAX_X_LABELS = 4;
const AXIS_FONT = 10;

type TextAnchor = 'start' | 'middle' | 'end';

interface Point {
  x: number;
  y: number;
}

/** Rounds a range to a "nice" number for clean axis steps. */
function niceNum(range: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(range || 1));
  const fraction = range / 10 ** exponent;
  let niceFraction: number;
  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else if (fraction <= 1) {
    niceFraction = 1;
  } else if (fraction <= 2) {
    niceFraction = 2;
  } else if (fraction <= 5) {
    niceFraction = 5;
  } else {
    niceFraction = 10;
  }
  return niceFraction * 10 ** exponent;
}

/** A padded, human-friendly Y scale with evenly-spaced ticks (never zero-based). */
function niceScale(min: number, max: number, maxTicks: number) {
  let lo = min;
  let hi = max;
  if (!(hi > lo)) {
    lo -= 1;
    hi += 1;
  }
  const range = niceNum(hi - lo, false);
  const step = niceNum(range / Math.max(1, maxTicks - 1), true);
  const niceMin = Math.floor(lo / step) * step;
  const niceMax = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  const count = Math.round((niceMax - niceMin) / step);
  for (let i = 0; i <= count; i += 1) {
    ticks.push(niceMin + i * step);
  }
  return { niceMin, niceMax, ticks };
}

/** Catmull-Rom → cubic bezier path plus its (sampled) length for the draw anim. */
function buildSmoothLine(points: Point[]): { d: string; length: number } {
  if (points.length < 2) {
    return { d: '', length: 0 };
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  let length = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    let prevX = p1.x;
    let prevY = p1.y;
    const samples = 12;
    for (let s = 1; s <= samples; s += 1) {
      const t = s / samples;
      const mt = 1 - t;
      const x = mt * mt * mt * p1.x + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * p2.x;
      const y = mt * mt * mt * p1.y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * p2.y;
      length += Math.hypot(x - prevX, y - prevY);
      prevX = x;
      prevY = y;
    }
  }
  return { d, length };
}

/**
 * Professional weight-trend chart: subtle grid + axis labels, an auto-scaled
 * (non-zero) Y range with padding, a smooth curve, faint historical markers,
 * and a highlighted, animated latest point. Built on react-native-svg.
 */
export const WeightChart = React.memo(function WeightChartBase({ entries }: WeightChartProps) {
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const enter = useRef(new Animated.Value(0)).current;
  const draw = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;

  const chart = useMemo(() => {
    if (width <= 0 || entries.length === 0) {
      return null;
    }
    const count = entries.length;
    const plotLeft = Y_AXIS_WIDTH;
    const plotRight = width - PAD_RIGHT;
    const plotTop = PAD_TOP;
    const plotBottom = HEIGHT - X_AXIS_HEIGHT;
    const plotW = Math.max(1, plotRight - plotLeft);
    const plotH = Math.max(1, plotBottom - plotTop);

    const weights = entries.map(entry => entry.weight);
    const dataMin = Math.min(...weights);
    const dataMax = Math.max(...weights);
    const pad = dataMin === dataMax ? 1 : (dataMax - dataMin) * 0.15;
    const { niceMin, niceMax, ticks } = niceScale(dataMin - pad, dataMax + pad, 5);
    const span = niceMax - niceMin || 1;

    const yFor = (weight: number) => plotTop + (1 - (weight - niceMin) / span) * plotH;
    const xFor = (index: number) =>
      count === 1 ? plotLeft + plotW / 2 : plotLeft + (index / (count - 1)) * plotW;

    const points: Point[] = entries.map((entry, index) => ({
      x: xFor(index),
      y: yFor(entry.weight),
    }));
    const line = buildSmoothLine(points);
    const last = points[count - 1];
    const areaPath =
      points.length >= 2
        ? `${line.d} L ${last.x} ${plotBottom} L ${points[0].x} ${plotBottom} Z`
        : '';

    const gridLines = ticks.map(value => ({ value, y: yFor(value) }));

    const labelCount = Math.min(MAX_X_LABELS, count);
    const rawIndices =
      labelCount <= 1
        ? [0]
        : Array.from({ length: labelCount }, (_, k) =>
            Math.round((k * (count - 1)) / (labelCount - 1)),
          );
    const xLabels = Array.from(new Set(rawIndices)).map(index => {
      const anchor: TextAnchor = index === 0 ? 'start' : index === count - 1 ? 'end' : 'middle';
      return { x: points[index].x, label: formatEntryDate(entries[index].date), anchor };
    });

    return { plotLeft, plotRight, plotBottom, points, line, areaPath, gridLines, xLabels, last };
  }, [width, entries]);

  // Re-animate when the plotted values change (data load / after logging).
  const signature = useMemo(
    () => `${width}|${entries.map(entry => `${entry.date}:${entry.weight}`).join(',')}`,
    [width, entries],
  );

  useEffect(() => {
    if (reduceMotion === null || !chart) {
      return undefined;
    }
    if (reduceMotion) {
      enter.setValue(1);
      draw.setValue(1);
      pop.setValue(1);
      return undefined;
    }
    enter.setValue(0);
    draw.setValue(0);
    pop.setValue(0);
    const animation = Animated.parallel([
      Animated.timing(enter, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(draw, {
        toValue: 1,
        duration: 900,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(pop, {
        toValue: 1,
        duration: 340,
        delay: 720,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: false,
      }),
    ]);
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, reduceMotion]);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const dashOffset = chart
    ? draw.interpolate({ inputRange: [0, 1], outputRange: [chart.line.length, 0] })
    : 0;
  const dotRadius = pop.interpolate({ inputRange: [0, 1], outputRange: [0, 5] });
  const haloRadius = pop.interpolate({ inputRange: [0, 1], outputRange: [0, 11] });
  const haloOpacity = pop.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] });
  const currentLabelY = chart ? Math.max(AXIS_FONT + 2, chart.last.y - 12) : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
      ]}
      onLayout={onLayout}
      accessibilityRole="image"
      accessibilityLabel="Weight trend chart"
    >
      {chart ? (
        <Svg width={width} height={HEIGHT}>
          <Defs>
            <LinearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity={0.26} />
              <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Grid + Y-axis labels */}
          {chart.gridLines.map(grid => (
            <React.Fragment key={`grid-${grid.value}`}>
              <Line
                x1={chart.plotLeft}
                y1={grid.y}
                x2={chart.plotRight}
                y2={grid.y}
                stroke={colors.divider}
                strokeWidth={1}
              />
              <SvgText
                x={Y_AXIS_WIDTH - 8}
                y={grid.y + 3.5}
                fill={colors.textDisabled}
                fontSize={AXIS_FONT}
                textAnchor="end"
              >
                {grid.value.toFixed(1)}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Area fill + smooth line */}
          {chart.areaPath ? <Path d={chart.areaPath} fill="url(#weightArea)" /> : null}
          {chart.line.d ? (
            <AnimatedPath
              d={chart.line.d}
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={[chart.line.length, chart.line.length]}
              strokeDashoffset={dashOffset}
            />
          ) : null}

          {/* Faint historical markers (skip the latest, which is highlighted) */}
          {chart.points.slice(0, -1).map((point, index) => (
            <Circle
              key={`pt-${index}`}
              cx={point.x}
              cy={point.y}
              r={2.5}
              fill={colors.primary}
              fillOpacity={0.45}
            />
          ))}

          {/* X-axis labels */}
          {chart.xLabels.map((item, index) => (
            <SvgText
              key={`x-${index}`}
              x={item.x}
              y={HEIGHT - 6}
              fill={colors.textDisabled}
              fontSize={AXIS_FONT}
              textAnchor={item.anchor}
            >
              {item.label}
            </SvgText>
          ))}

          {/* Highlighted, animated latest point */}
          <AnimatedCircle cx={chart.last.x} cy={chart.last.y} r={haloRadius} fill={colors.primary} opacity={haloOpacity} />
          <AnimatedCircle cx={chart.last.x} cy={chart.last.y} r={dotRadius} fill={colors.primary} opacity={pop} />
          <SvgText
            x={chart.last.x}
            y={currentLabelY}
            fill={colors.primary}
            fontSize={AXIS_FONT}
            fontWeight="600"
            textAnchor="end"
          >
            Current
          </SvgText>
        </Svg>
      ) : (
        <View style={styles.placeholder} />
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
  },
  placeholder: {
    height: HEIGHT,
  },
});
