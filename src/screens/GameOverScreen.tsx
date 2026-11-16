import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { BadgeCheck, House, Percent, RotateCcw, Trophy } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { CARD_W, TOTAL_LEVELS } from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import RoundIconButton from '../components/RoundIconButton';
import ClayCard from '../components/ClayCard';
import StarRow from '../components/StarRow';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import type { LevelResult } from '../hooks/useGameSession';

type Props = {
  result: LevelResult;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onMenu: () => void;
};

function GameOverScreen({ result, onPlayAgain, onNextLevel, onMenu }: Props) {
  const rise = useRef(new Animated.Value(28)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.spring(rise, {
        toValue: 0,
        tension: 48,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);
    entry.start();
    return () => entry.stop();
  }, [fade, rise]);

  const verdict = result.cleared ? 'LEVEL CLEARED!' : 'NICE TRY!';
  const hasNext = result.cleared && result.levelId < TOTAL_LEVELS;

  return (
    <ScreenBackground variant="result">
      <View style={styles.root}>
        <ScreenHeader
          variant="plain"
          title="LEVEL RESULT"
          subtitle={`LEVEL ${result.levelId} / ${TOTAL_LEVELS}`}
          leftSlot={
            <RoundIconButton
              label="Back to menu"
              source={assets.iconHome}
              onPress={onMenu}
            />
          }
        />

        <Animated.View
          pointerEvents="box-none"
          style={[styles.body, { opacity: fade, transform: [{ translateY: rise }] }]}>
          {/* decor sits in its own row, clear of the heading box (rule #17) */}
          <View pointerEvents="none" style={styles.decorRow}>
            <Image source={assets.spriteStar} style={styles.decor} resizeMode="contain" />
          </View>

          <Text style={styles.verdict}>{verdict}</Text>

          <View style={styles.starsWrap}>
            <StarRow earned={result.stars} />
          </View>

          <ClayCard style={[styles.score, { width: CARD_W }]} radius={theme.radius.xl}>
            <View style={styles.statsRow}>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={BadgeCheck}
                  value={`${result.orders}/${result.totalOrders}`}
                  label="orders"
                  valueColor={theme.colors.accent.lime}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Percent}
                  value={`${result.accuracy}%`}
                  label="accuracy"
                  valueColor={theme.colors.accent.purpleSoft}
                />
              </View>
            </View>

            <Text style={styles.tipLabel}>TIP OF THE LEVEL:</Text>
            <Text style={styles.tip}>{result.tip}</Text>
          </ClayCard>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.hint}>SERVE EVERY ORDER FIRST TRY FOR THREE ★</Text>
          <PrimaryButton
            label="SLICE AGAIN"
            onPress={onPlayAgain}
            Icon={RotateCcw}
            height={62}
          />
          <View style={styles.secondaryRow}>
            {hasNext ? (
              <View style={styles.secondarySlot}>
                <SecondaryButton label="NEXT LEVEL" onPress={onNextLevel} Icon={Trophy} />
              </View>
            ) : null}
            <View style={styles.secondarySlot}>
              <SecondaryButton
                label="MENU"
                onPress={onMenu}
                Icon={House}
                iconColor={theme.colors.text.primary}
                tone="rgba(24,16,34,0.35)"
                borderColor="rgba(236,233,240,0.2)"
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  decorRow: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decor: {
    width: 34,
    height: 34,
    opacity: 0.75,
  },
  verdict: {
    marginTop: 4,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.text.primary,
    textShadowColor: theme.colors.accent.purple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  starsWrap: {
    marginTop: 16,
    marginBottom: 18,
  },
  score: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  tipLabel: {
    marginTop: 16,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
  tip: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 26,
  },
  hint: {
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  secondaryRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondarySlot: {
    flex: 1,
  },
});

export default GameOverScreen;
