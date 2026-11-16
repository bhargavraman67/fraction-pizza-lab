import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { House, Play } from 'lucide-react-native';
import theme from '../constants/theme';
import ClayCard from './ClayCard';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

type Props = {
  visible: boolean;
  onResume: () => void;
  onMenu: () => void;
};

function PauseOverlay({ visible, onResume, onMenu }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.root}>
      <ClayCard style={styles.card}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.hint}>THE OVEN IS KEEPING YOUR PIZZA WARM</Text>
        <PrimaryButton label="RESUME" onPress={onResume} Icon={Play} height={58} />
        <View style={styles.spacer} />
        <SecondaryButton label="MENU" onPress={onMenu} Icon={House} />
      </ClayCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24,16,34,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    padding: 22,
    borderRadius: theme.radius.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  hint: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  spacer: {
    height: 10,
  },
});

export default React.memo(PauseOverlay);
