import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { IconComponent } from './PrimaryButton';

const ICON_WRAP = 40;
const ICON = 22;

type Props = {
  Icon: IconComponent;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * One stat pill, used identically on Menu and on the level result so the two
 * screens stay consistent. The card is `width:'100%'` and NEVER `flex:1` — a
 * flex:1 child inside a flex:1 slot collapses to a sliver and clips the text.
 */
function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View pointerEvents="none" style={styles.highlight} />
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
        <Icon size={ICON} color={valueColor} strokeWidth={2.5} />
      </View>
      <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
  iconWrap: {
    width: ICON_WRAP,
    height: ICON_WRAP,
    borderRadius: ICON_WRAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginTop: 6,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  label: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
});

export default React.memo(StatCard);
