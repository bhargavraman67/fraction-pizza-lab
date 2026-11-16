import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP } from '../constants/config';
import type { IconComponent } from './PrimaryButton';

const ICON_SIZE = 24; // same size as PrimaryButton — never mix sizes (rule #20)

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  iconColor?: string;
  tone?: string;
  borderColor?: string;
  labelColor?: string;
  style?: StyleProp<ViewStyle>;
};

function SecondaryButton({
  label,
  onPress,
  Icon,
  iconColor,
  tone,
  borderColor,
  labelColor,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          {
            backgroundColor: tone ?? theme.colors.ui.purpleFill,
            borderColor: borderColor ?? theme.colors.ui.border,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon
                size={ICON_SIZE}
                color={iconColor ?? theme.colors.accent.lime}
                strokeWidth={2.4}
              />
            </View>
          ) : null}
          <Text numberOfLines={1} style={[styles.label, labelColor ? { color: labelColor } : null]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
  },
  shell: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: theme.colors.text.primary,
  },
});

export default React.memo(SecondaryButton);
