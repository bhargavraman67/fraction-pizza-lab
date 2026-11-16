import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import theme from '../constants/theme';

export type LevelChipState = 'cleared' | 'current' | 'locked';

type Props = {
  index: number;
  state: LevelChipState;
  size: number;
};

function LevelChip({ index, state, size }: Props) {
  const box = { width: size, height: size, borderRadius: Math.round(size * 0.32) };
  if (state === 'locked') {
    return (
      <View style={[styles.chip, styles.locked, box]}>
        <Lock size={16} color={theme.colors.text.faint} strokeWidth={2.4} />
      </View>
    );
  }
  if (state === 'cleared') {
    return (
      <View style={[styles.chip, styles.cleared, box]}>
        <Text style={styles.star}>★</Text>
      </View>
    );
  }
  return (
    <View style={[styles.chip, styles.current, box]}>
      <Text style={styles.number}>{index}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    backgroundColor: theme.colors.accent.purple,
    borderWidth: 2,
    borderColor: theme.colors.accent.lime,
  },
  cleared: {
    backgroundColor: 'rgba(141,224,40,0.18)',
    borderWidth: 2,
    borderColor: theme.colors.accent.lime,
  },
  locked: {
    backgroundColor: 'rgba(85,38,89,0.55)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  number: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    color: theme.colors.text.primary,
  },
  star: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.colors.accent.lime,
  },
});

export default React.memo(LevelChip);
