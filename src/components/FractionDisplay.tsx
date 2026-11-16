import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  n: number;
  d: number;
  size?: number;
  color?: string;
  topColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A real stacked fraction — numerator over a bar over the denominator.
 * Never a bare "/" glyph: a slash reads badly at kid sizes and the stacked form
 * is what the lesson is about.
 */
function FractionDisplay({ n, d, size = 30, color, topColor, style }: Props) {
  const barWidth = Math.round(size * 1.5);
  return (
    <View style={[styles.root, style]}>
      <Text
        style={[
          styles.num,
          { fontSize: size, lineHeight: Math.round(size * 1.08), color: topColor ?? theme.colors.accent.lime },
        ]}>
        {n}
      </Text>
      <View
        style={[
          styles.bar,
          { width: barWidth, backgroundColor: color ?? theme.colors.text.primary },
        ]}
      />
      <Text
        style={[
          styles.num,
          { fontSize: size, lineHeight: Math.round(size * 1.08), color: color ?? theme.colors.text.primary },
        ]}>
        {d}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  bar: {
    height: 3,
    borderRadius: 2,
    marginVertical: 3,
  },
});

export default React.memo(FractionDisplay);
