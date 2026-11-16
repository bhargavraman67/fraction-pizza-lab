import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import theme from '../constants/theme';
import { HEADER_BODY_H, STATUS_PAD, TOUCH_MIN } from '../constants/config';

type Props = {
  title?: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** `plain` drops the bar background for screens that sit on full-bleed art. */
  variant?: 'bar' | 'plain';
  style?: StyleProp<ViewStyle>;
};

/**
 * One header for every screen — Menu, Game, GameOver and Facts all use this so
 * padding, slot sizes and the status-bar inset can never drift apart.
 */
function ScreenHeader({ title, subtitle, leftSlot, rightSlot, variant = 'bar', style }: Props) {
  return (
    <View
      style={[
        styles.root,
        variant === 'bar' ? styles.bar : styles.plain,
        style,
      ]}>
      <View style={styles.slot}>{leftSlot ?? null}</View>
      <View style={styles.center}>
        {title ? (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.slotRight}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: HEADER_BODY_H + STATUS_PAD,
    paddingTop: STATUS_PAD, // rule #6 — never let content sit under the status bar
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: theme.colors.ui.header,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.limeFaint,
  },
  plain: {
    backgroundColor: 'transparent',
  },
  slot: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  slotRight: {
    minWidth: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(ScreenHeader);
