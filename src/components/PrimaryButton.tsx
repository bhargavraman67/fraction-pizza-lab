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
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { HIT_SLOP } from '../constants/config';

export type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const ICON_SIZE = 24; // fixed across every button in the project (rule #20)

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Lime gradient CTA. Pressable is the PARENT and the Animated.View lives INSIDE
 * it — the reverse order eats onPress on Android release builds (rule #8).
 */
function PrimaryButton({ label, onPress, Icon, disabled = false, height = 62, style }: Props) {
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

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    onPress();
  }, [disabled, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.press,
        { height, width: '100%' },
        disabled ? styles.disabled : theme.shadows.cta,
        style,
      ]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.shell, { height, transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON_SIZE} color={theme.colors.text.onAccent} strokeWidth={2.6} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={styles.label}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.xl,
  },
  disabled: {
    opacity: 0.45,
  },
  shell: {
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
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
    fontSize: 19,
    lineHeight: ICON_SIZE,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: theme.colors.text.onAccent,
  },
});

export default React.memo(PrimaryButton);
