import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';

const BADGE = 56;

type Props = {
  earned: number;
};

function Star({ active, delay }: { active: boolean; delay: number }) {
  const scale = useRef(new Animated.Value(active ? 0.4 : 1)).current;

  useEffect(() => {
    if (!active) {
      return;
    }
    const animation = Animated.spring(scale, {
      toValue: 1,
      delay,
      tension: theme.animation.pop.tension,
      friction: theme.animation.pop.friction,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [active, delay, scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.badge,
        { opacity: active ? 1 : 0.22, transform: [{ scale }] },
      ]}>
      <Image source={assets.spriteStar} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
}

function StarRow({ earned }: Props) {
  return (
    <View style={styles.row}>
      <Star active={earned >= 1} delay={0} />
      <Star active={earned >= 2} delay={140} />
      <Star active={earned >= 3} delay={280} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: BADGE,
    height: BADGE,
  },
});

export default React.memo(StarRow);
