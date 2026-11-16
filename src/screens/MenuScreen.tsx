import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import {
  BadgeCheck,
  GraduationCap,
  Play,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { SCREEN_W, TOTAL_LEVELS } from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import RoundIconButton from '../components/RoundIconButton';
import LevelChip, { type LevelChipState } from '../components/LevelChip';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import type { Progress } from '../hooks/useProgress';

const SHEET_INNER_W = SCREEN_W - 40;
const CHIP_SIZE = Math.min(56, Math.floor((SHEET_INNER_W - 4 * 10) / 5));
const CHEF = Math.min(150, Math.round(SCREEN_W * 0.42));
const RAIL = 5;

type Props = {
  progress: Progress;
  onPlay: () => void;
  onFacts: () => void;
};

function MenuScreen({ progress, onPlay, onFacts }: Props) {
  const [muted, setMuted] = useState(false);
  const sheetY = useRef(new Animated.Value(60)).current;
  const ctaScale = useRef(new Animated.Value(0.9)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sheet = Animated.spring(sheetY, {
      toValue: 0,
      tension: 48,
      friction: 9,
      useNativeDriver: true,
    });
    const cta = Animated.spring(ctaScale, {
      toValue: 1,
      delay: 260,
      tension: 48,
      friction: 9,
      useNativeDriver: true,
    });
    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    sheet.start();
    cta.start();
    idle.start();
    return () => {
      sheet.stop();
      cta.stop();
      idle.stop();
    };
  }, [bob, ctaScale, sheetY]);

  const toggleSound = useCallback(() => setMuted(value => !value), []);

  const rail = useMemo(() => {
    const start = Math.max(
      1,
      Math.min(progress.level - 2, TOTAL_LEVELS - (RAIL - 1)),
    );
    return Array.from({ length: RAIL }, (_, i) => {
      const id = start + i;
      const state: LevelChipState =
        id < progress.level ? 'cleared' : id === progress.level ? 'current' : 'locked';
      return { id, state };
    });
  }, [progress.level]);

  const bobY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const showStats = progress.ordersDone > 0 && progress.stars > 0;

  return (
    <ScreenBackground variant="menu">
      <View style={styles.root}>
        <View style={styles.art}>
          <ScreenHeader
            variant="plain"
            leftSlot={
              <RoundIconButton
                label={muted ? 'Turn sound on' : 'Turn sound off'}
                Icon={muted ? VolumeX : Volume2}
                onPress={toggleSound}
              />
            }
            rightSlot={
              <View style={styles.starsPill}>
                <Star size={18} color={theme.colors.accent.lime} strokeWidth={2.6} />
                <Text style={styles.starsValue}>{progress.stars}</Text>
              </View>
            }
          />
          <View style={styles.chefWrap}>
            <Animated.View
              pointerEvents="none"
              style={{ transform: [{ translateY: bobY }] }}>
              <Image
                source={assets.spriteChef}
                style={{ width: CHEF, height: CHEF }}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View pointerEvents="none" style={styles.sheetHighlight} />

          <View style={styles.titleRow}>
            <Text style={styles.title}>PIZZERIA LEVELS</Text>
            <Text style={styles.levelMeta}>
              LEVEL {progress.level} / {TOTAL_LEVELS}
            </Text>
          </View>

          <View style={styles.rail}>
            {rail.map(chip => (
              <LevelChip
                key={chip.id}
                index={chip.id}
                state={chip.state}
                size={CHIP_SIZE}
              />
            ))}
          </View>

          {showStats ? (
            <View style={styles.statsRow}>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={BadgeCheck}
                  value={String(progress.ordersDone)}
                  label="orders done"
                  valueColor={theme.colors.accent.lime}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Star}
                  value={String(progress.stars)}
                  label="stars earned"
                  valueColor={theme.colors.accent.purpleSoft}
                />
              </View>
            </View>
          ) : (
            <Text style={styles.freshHint}>
              FRESH DOUGH, FRESH START · LEVEL {progress.level} IS READY
            </Text>
          )}

          <Text style={styles.hint}>CUT THE PIZZA · SERVE THE EXACT FRACTION</Text>

          <Animated.View
            pointerEvents="box-none"
            style={{ transform: [{ scale: ctaScale }] }}>
            <PrimaryButton label="START SLICING" onPress={onPlay} Icon={Play} height={62} />
          </Animated.View>

          <View style={styles.secondaryWrap}>
            <SecondaryButton
              label="FRACTION FACTS"
              onPress={onFacts}
              Icon={GraduationCap}
            />
          </View>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  art: {
    flex: 1,
  },
  chefWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsPill: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: theme.colors.ui.limeBorder,
  },
  starsValue: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  sheet: {
    backgroundColor: theme.colors.bg.secondary,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(141,224,40,0.22)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
    ...theme.shadows.sheet,
  },
  sheetHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  levelMeta: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
  },
  rail: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  freshHint: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1.1,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  hint: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  secondaryWrap: {
    marginTop: 10,
  },
});

export default MenuScreen;
