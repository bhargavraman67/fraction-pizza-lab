import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import assets from '../assets';
import theme from '../constants/theme';
import { BOARD_BORDER, BOARD_PAD, CUT_TOTAL_MS } from '../constants/config';

const toRad = (deg: number) => (deg * Math.PI) / 180;
const round = (value: number) => Math.round(value * 100) / 100;

function wedgePath(center: number, radius: number, a0: number, a1: number): string {
  const x0 = round(center + radius * Math.cos(toRad(a0)));
  const y0 = round(center + radius * Math.sin(toRad(a0)));
  const x1 = round(center + radius * Math.cos(toRad(a1)));
  const y1 = round(center + radius * Math.sin(toRad(a1)));
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${round(center)} ${round(center)} L ${x0} ${y0} A ${round(radius)} ${round(
    radius,
  )} 0 ${large} 1 ${x1} ${y1} Z`;
}

type Props = {
  /** Inner pizza box — the disc is rebuilt from it plus the frame. */
  size: number;
  boardWidth: number;
  slices: number;
  selected: number[];
  interactive: boolean;
  onToggleSlice: (index: number) => void;
};

function PizzaBoard({
  size,
  boardWidth,
  slices,
  selected,
  interactive,
  onToggleSlice,
}: Props) {
  const reveal = useRef(new Animated.Value(0)).current;

  const wedges = useMemo(() => {
    if (slices <= 0) {
      return [];
    }
    const center = size / 2;
    const radius = size / 2 - 3;
    const step = 360 / slices;
    return Array.from({ length: slices }, (_, index) => ({
      index,
      d: wedgePath(center, radius, -90 + index * step, -90 + (index + 1) * step),
    }));
  }, [size, slices]);

  useEffect(() => {
    if (slices <= 0) {
      reveal.setValue(0);
      return;
    }
    reveal.setValue(0);
    const animation = Animated.timing(reveal, {
      toValue: 1,
      duration: CUT_TOTAL_MS + 120,
      useNativeDriver: true, // opacity + transform only
    });
    animation.start();
    return () => animation.stop();
  }, [reveal, slices]);

  const scale = reveal.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <View
      style={[
        styles.disc,
        {
          width: boardWidth,
          height: boardWidth,
          borderRadius: boardWidth / 2,
        },
      ]}>
      <Image
        source={assets.spritePizza}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {slices > 0 ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.overlay,
            { width: size, height: size, opacity: reveal, transform: [{ scale }] },
          ]}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {wedges.map(wedge => {
              const isSelected = selected.includes(wedge.index);
              return (
                <Path
                  key={wedge.index}
                  d={wedge.d}
                  fill={isSelected ? 'rgba(141,224,40,0.42)' : 'rgba(236,233,240,0.06)'}
                  stroke={isSelected ? theme.colors.accent.lime : theme.colors.text.primary}
                  strokeWidth={3}
                  strokeLinejoin="round"
                  onPress={interactive ? () => onToggleSlice(wedge.index) : undefined}
                />
              );
            })}
          </Svg>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    backgroundColor: theme.colors.bg.accent,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.ui.purpleBorder,
    padding: BOARD_PAD,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.clay,
  },
  overlay: {
    position: 'absolute',
    top: BOARD_PAD,
    left: BOARD_PAD,
  },
});

export default React.memo(PizzaBoard);
