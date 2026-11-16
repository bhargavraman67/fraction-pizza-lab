import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';

const DISC = 182;
const LOGO = 150;
const BAR_W = 200;
const FADE_MS = 320;

type Props = {
  onDone: () => void;
};

function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const discScale = useRef(new Animated.Value(0.72)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.45)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.spring(discScale, {
        toValue: 1,
        tension: 46,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]);

    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(tilt, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tilt, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    // width cannot run on the native driver — this is the one allowed exception.
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    entry.start();
    idle.start();
    bar.start();
    blink.start();

    const exitTimer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => onDoneRef.current());
    }, Math.max(0, LOADER_DURATION_MS - FADE_MS));

    return () => {
      clearTimeout(exitTimer);
      entry.stop();
      idle.stop();
      bar.stop();
      blink.stop();
    };
  }, [discScale, fade, logoFade, progress, pulse, tilt]);

  const rotate = tilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['4%', '100%'],
  });

  return (
    <ScreenBackground variant="loader">
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.disc, { transform: [{ scale: discScale }, { rotate }] }]}>
          <Animated.Image
            source={assets.logo}
            style={[styles.logo, { opacity: logoFade }]}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.title}>FRACTION PIZZA</Text>
        <Text style={styles.title}>LAB</Text>
        <Text style={styles.subtitle}>SLICE IT. SERVE IT. GET IT.</Text>

        <View style={styles.track}>
          <Animated.View pointerEvents="none" style={[styles.fill, { width: barWidth }]}>
            <LinearGradient
              colors={theme.gradients.bar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Animated.Text style={[styles.loading, { opacity: pulse }]}>LOADING…</Animated.Text>

        <View style={styles.sliceRow}>
          <Image source={assets.spriteSlice} style={styles.slice} resizeMode="contain" />
        </View>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.ui.limeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.purple,
  },
  logo: {
    width: LOGO,
    height: LOGO,
  },
  title: {
    marginTop: 4,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: 2.5,
    textAlign: 'center',
    color: theme.colors.text.primary,
    textShadowColor: theme.colors.accent.purple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  track: {
    marginTop: 30,
    width: BAR_W,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(236,233,240,0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.text.muted,
  },
  sliceRow: {
    marginTop: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slice: {
    width: 54,
    height: 54,
    opacity: 0.7,
  },
});

export default LoaderScreen;
