import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP, TOUCH_MIN } from '../constants/config';
import type { IconComponent } from './PrimaryButton';

const GLYPH = 24; // same icon box as the buttons (rule #20)

type Props = {
  onPress: () => void;
  label: string;
  /** Either a contract PNG… */
  source?: ImageSourcePropType;
  /** …or an icon from the project's single icon library. */
  Icon?: IconComponent;
  iconColor?: string;
  tone?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
};

function RoundIconButton({
  onPress,
  label,
  source,
  Icon,
  iconColor,
  tone,
  borderColor,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.92,
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
            backgroundColor: tone ?? theme.colors.ui.glass,
            borderColor: borderColor ?? theme.colors.ui.limeBorder,
            transform: [{ scale }],
          },
        ]}>
        {source ? (
          <Image source={source} style={styles.glyph} resizeMode="contain" />
        ) : null}
        {!source && Icon ? (
          <Icon size={GLYPH} color={iconColor ?? theme.colors.text.primary} strokeWidth={2.4} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: TOUCH_MIN / 2,
  },
  shell: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: TOUCH_MIN / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    width: GLYPH,
    height: GLYPH,
  },
});

export default React.memo(RoundIconButton);
