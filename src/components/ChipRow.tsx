import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP, TOUCH_MIN } from '../constants/config';

const CHIP_W = 52;

type ChipProps = {
  value: number;
  active: boolean;
  disabled: boolean;
  onChange: (value: number) => void;
};

function Chip({ value, active, disabled, onChange }: ChipProps) {
  const handlePress = useCallback(() => onChange(value), [onChange, value]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cut into ${value} slices`}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      onPress={handlePress}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        disabled ? styles.chipDisabled : null,
      ]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{value}</Text>
    </Pressable>
  );
}

const MemoChip = React.memo(Chip);

type Props = {
  options: number[];
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function ChipRow({ options, value, onChange, disabled = false }: Props) {
  return (
    <View style={styles.row}>
      {options.map(option => (
        <MemoChip
          key={option}
          value={option}
          active={value === option}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    width: CHIP_W,
    height: TOUCH_MIN,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: 'rgba(100,42,171,0.4)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  chipActive: {
    backgroundColor: 'rgba(141,224,40,0.2)',
    borderWidth: 2,
    borderColor: theme.colors.accent.lime,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: 'rgba(236,233,240,0.75)',
  },
  chipTextActive: {
    color: theme.colors.accent.lime,
  },
});

export default React.memo(ChipRow);
