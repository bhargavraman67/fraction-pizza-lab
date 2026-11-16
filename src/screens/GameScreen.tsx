import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Check, Scissors } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  BOARD_W,
  CARD_W,
  CONTROLS_H,
  ORDERS_PER_LEVEL,
  PIZZA_SIZE,
} from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import RoundIconButton from '../components/RoundIconButton';
import OrderTicket from '../components/OrderTicket';
import PizzaBoard from '../components/PizzaBoard';
import StatStrip from '../components/StatStrip';
import ChipRow from '../components/ChipRow';
import FractionDisplay from '../components/FractionDisplay';
import PrimaryButton from '../components/PrimaryButton';
import PauseOverlay from '../components/PauseOverlay';
import useGameSession, { type LevelResult } from '../hooks/useGameSession';

type Props = {
  levelId: number;
  stars: number;
  onGameOver: (result: LevelResult) => void;
  onMenu: () => void;
};

function GameScreen({ levelId, stars, onGameOver, onMenu }: Props) {
  const [paused, setPaused] = useState(false);
  const session = useGameSession(levelId, onGameOver);
  const {
    order,
    orderIndex,
    phase,
    cutInto,
    chip,
    selected,
    hint,
    earnedStars,
    canCut,
    canServe,
    pickChip,
    cut,
    toggleSlice,
    serve,
    quit,
  } = session;

  const shake = useRef(new Animated.Value(0)).current;
  const ticketScale = useRef(new Animated.Value(1)).current;
  const fly = useRef(new Animated.Value(0)).current;
  const boardScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const entry = Animated.spring(boardScale, {
      toValue: 1,
      tension: 48,
      friction: 9,
      useNativeDriver: true,
    });
    entry.start();
    return () => entry.stop();
  }, [boardScale]);

  useEffect(() => {
    if (phase !== 'wrong') {
      return;
    }
    const sequence = Animated.sequence([
      Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -0.55, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]);
    sequence.start();
    return () => sequence.stop();
  }, [phase, shake]);

  useEffect(() => {
    if (phase !== 'correct') {
      return;
    }
    fly.setValue(0);
    const burst = Animated.parallel([
      Animated.timing(fly, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(ticketScale, {
          toValue: 1.06,
          tension: 70,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(ticketScale, {
          toValue: 1,
          tension: 70,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]);
    burst.start();
    return () => burst.stop();
  }, [fly, phase, ticketScale]);

  const handleMenu = useCallback(() => {
    quit();
    onMenu();
  }, [onMenu, quit]);

  const handlePause = useCallback(() => setPaused(true), []);
  const handleResume = useCallback(() => setPaused(false), []);

  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-7, 7] });
  const flyY = fly.interpolate({ inputRange: [0, 1], outputRange: [0, -150] });
  const flyScale = fly.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] });
  const flyOpacity = fly.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });

  const cutting = phase === 'cutting';
  const inCutPhase = phase === 'cut' || cutting;
  const interactive = phase === 'serve';
  const caption = inCutPhase ? 'CUT INTO EQUAL SLICES' : 'TAP THE SLICES TO SERVE';

  return (
    <ScreenBackground variant="game">
      <View style={styles.root}>
        <ScreenHeader
          title={`LEVEL ${levelId}`}
          subtitle={`ORDER ${orderIndex + 1} / ${ORDERS_PER_LEVEL}`}
          leftSlot={
            <RoundIconButton
              label="Back to menu"
              source={assets.iconHome}
              onPress={handleMenu}
            />
          }
          rightSlot={
            <RoundIconButton
              label="Pause"
              source={assets.iconPause}
              onPress={handlePause}
            />
          }
        />

        <View style={styles.area}>
          <Animated.View
            pointerEvents="none"
            style={{ transform: [{ scale: ticketScale }] }}>
            <OrderTicket order={order} width={CARD_W} />
          </Animated.View>

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.boardWrap,
              { transform: [{ translateX: shakeX }, { scale: boardScale }] },
            ]}>
            <PizzaBoard
              size={PIZZA_SIZE}
              boardWidth={BOARD_W}
              slices={cutInto}
              selected={selected}
              interactive={interactive}
              onToggleSlice={toggleSlice}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.fly,
                {
                  opacity: flyOpacity,
                  transform: [{ translateY: flyY }, { scale: flyScale }],
                },
              ]}>
              <Image source={assets.spriteSlice} style={styles.flyImage} resizeMode="contain" />
            </Animated.View>
          </Animated.View>
        </View>

        <StatStrip
          slices={cutInto}
          picked={selected.length}
          stars={stars + earnedStars}
        />

        <View style={styles.controls}>
          <View pointerEvents="none" style={styles.controlsHighlight} />
          <Text style={styles.caption}>{caption}</Text>

          <View style={styles.controlRow}>
            {inCutPhase ? (
              <ChipRow
                options={order.denominators}
                value={chip}
                onChange={pickChip}
                disabled={cutting}
              />
            ) : (
              <View style={styles.readout}>
                <Text style={styles.readoutLabel}>YOU PICKED</Text>
                <FractionDisplay
                  n={selected.length}
                  d={cutInto}
                  size={18}
                  topColor={
                    selected.length > 0
                      ? theme.colors.accent.lime
                      : theme.colors.text.muted
                  }
                />
              </View>
            )}
          </View>

          <View style={styles.hintBox}>
            {hint ? <Text style={styles.hint}>{hint}</Text> : null}
          </View>

          {inCutPhase ? (
            <PrimaryButton
              label="CUT PIZZA"
              onPress={cut}
              Icon={Scissors}
              disabled={!canCut}
              height={58}
              style={styles.cta}
            />
          ) : (
            <PrimaryButton
              label="SERVE ORDER"
              onPress={serve}
              Icon={Check}
              disabled={!canServe}
              height={58}
              style={styles.cta}
            />
          )}
        </View>

        <PauseOverlay visible={paused} onResume={handleResume} onMenu={handleMenu} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  boardWrap: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fly: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flyImage: {
    width: 64,
    height: 64,
  },
  controls: {
    height: CONTROLS_H,
    backgroundColor: theme.colors.bg.secondary,
    borderTopLeftRadius: theme.radius.xxl - 4,
    borderTopRightRadius: theme.radius.xxl - 4,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    ...theme.shadows.sheet,
  },
  controlsHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
  caption: {
    height: 16,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  controlRow: {
    marginTop: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  readoutLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  cta: {
    marginTop: 8,
  },
  hintBox: {
    marginTop: 6,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.9,
    textAlign: 'center',
    color: theme.colors.accent.lime,
  },
});

export default GameScreen;
