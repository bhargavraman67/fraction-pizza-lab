import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Border tint — defaults to the lime accent edge. */
  accent?: string;
  /** Surface colour — defaults to the clay pad tone. */
  tone?: string;
  radius?: number;
};

/**
 * The single surface primitive: dense clay pad, outer shadow + a 1px top
 * highlight that fakes the inflated inner light of claymorphism.
 */
function ClayCard({ children, style, accent, tone, radius }: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tone ?? theme.colors.bg.tertiary,
          borderColor: accent ?? theme.colors.ui.limeBorder,
          borderRadius: radius ?? theme.radius.lg,
        },
        style,
      ]}>
      <View
        pointerEvents="none"
        style={[styles.highlight, { borderTopLeftRadius: radius ?? theme.radius.lg, borderTopRightRadius: radius ?? theme.radius.lg }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.shadows.clay,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
});

export default React.memo(ClayCard);
