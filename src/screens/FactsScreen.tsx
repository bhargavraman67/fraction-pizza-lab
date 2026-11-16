import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { House } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import RoundIconButton from '../components/RoundIconButton';
import ClayCard from '../components/ClayCard';
import SecondaryButton from '../components/SecondaryButton';

const MINI = 56;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const round = (value: number) => Math.round(value * 100) / 100;

function wedge(center: number, radius: number, a0: number, a1: number): string {
  const x0 = round(center + radius * Math.cos(toRad(a0)));
  const y0 = round(center + radius * Math.sin(toRad(a0)));
  const x1 = round(center + radius * Math.cos(toRad(a1)));
  const y1 = round(center + radius * Math.sin(toRad(a1)));
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${center} ${center} L ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1} Z`;
}

function MiniPizza({ n, d }: { n: number; d: number }) {
  const paths = useMemo(() => {
    const center = MINI / 2;
    const radius = MINI / 2 - 3;
    const step = 360 / d;
    return Array.from({ length: d }, (_, i) => ({
      key: i,
      d: wedge(center, radius, -90 + i * step, -90 + (i + 1) * step),
      filled: i < n,
    }));
  }, [d, n]);

  return (
    <Svg width={MINI} height={MINI} viewBox={`0 0 ${MINI} ${MINI}`}>
      <Circle
        cx={MINI / 2}
        cy={MINI / 2}
        r={MINI / 2 - 2}
        fill="rgba(100,42,171,0.35)"
        stroke="rgba(236,233,240,0.25)"
        strokeWidth={1}
      />
      {paths.map(item => (
        <Path
          key={item.key}
          d={item.d}
          fill={item.filled ? 'rgba(141,224,40,0.55)' : 'transparent'}
          stroke={theme.colors.text.primary}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

const FACTS = [
  {
    id: 'bottom',
    n: 1,
    d: 4,
    title: 'THE BOTTOM NUMBER',
    body: 'It tells you how many equal slices the whole pizza was cut into. Bigger bottom number, smaller slices.',
  },
  {
    id: 'top',
    n: 3,
    d: 4,
    title: 'THE TOP NUMBER',
    body: 'It tells you how many of those slices go on the plate. Three slices out of four is 3/4 of the pizza.',
  },
  {
    id: 'same',
    n: 4,
    d: 8,
    title: 'SAME PIZZA, DIFFERENT CUTS',
    body: 'Four slices out of eight fill exactly the same plate as one half. Different names, same amount.',
  },
];

type Props = {
  onBack: () => void;
  onLearned: (count: number) => void;
};

function FactsScreen({ onBack, onLearned }: Props) {
  useEffect(() => {
    onLearned(FACTS.length);
  }, [onLearned]);

  return (
    <ScreenBackground variant="facts">
      <View style={styles.root}>
        <ScreenHeader
          title="FRACTION FACTS"
          subtitle="THREE SHORT LESSONS"
          leftSlot={
            <RoundIconButton
              label="Back to pizzeria"
              source={assets.iconHome}
              onPress={onBack}
            />
          }
        />

        <View style={styles.body}>
          {FACTS.map(fact => (
            <ClayCard
              key={fact.id}
              accent="rgba(100,42,171,0.6)"
              style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.mini}>
                  <MiniPizza n={fact.n} d={fact.d} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{fact.title}</Text>
                  <Text style={styles.cardBody}>{fact.body}</Text>
                </View>
              </View>
            </ClayCard>
          ))}
        </View>

        <View style={styles.footer}>
          <SecondaryButton
            label="BACK TO PIZZERIA"
            onPress={onBack}
            Icon={House}
            tone="rgba(141,224,40,0.18)"
            borderColor={theme.colors.accent.lime}
            labelColor={theme.colors.accent.lime}
          />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: theme.radius.lg,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mini: {
    width: MINI,
    height: MINI,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
  cardBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: 'rgba(236,233,240,0.72)',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 26,
    paddingTop: 4,
  },
});

export default FactsScreen;
