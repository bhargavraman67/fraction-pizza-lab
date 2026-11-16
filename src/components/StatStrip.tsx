import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { STAT_STRIP_H } from '../constants/config';

type CellProps = {
  value: string;
  label: string;
  color: string;
};

function Cell({ value, label, color }: CellProps) {
  return (
    <View style={styles.cell}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

type Props = {
  slices: number;
  picked: number;
  stars: number;
};

/** The thin three-cell read-out between the board and the controls. */
function StatStrip({ slices, picked, stars }: Props) {
  return (
    <View style={styles.root}>
      <Cell value={String(slices)} label="slices" color={theme.colors.accent.lime} />
      <View style={styles.divider} />
      <Cell value={String(picked)} label="picked" color={theme.colors.text.primary} />
      <View style={styles.divider} />
      <Cell value={`${stars} ★`} label="stars" color={theme.colors.accent.lime} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: STAT_STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46,26,69,0.8)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.ui.hairline,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.ui.hairline,
  },
  value: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  label: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
});

export default React.memo(StatStrip);
