import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { TICKET_H } from '../constants/config';
import type { Order } from '../game/fractions';
import ClayCard from './ClayCard';
import FractionDisplay from './FractionDisplay';

type Props = {
  order: Order;
  width: number;
};

function OrderTicket({ order, width }: Props) {
  const isAdd = order.kind === 'add' && order.addends !== null;
  return (
    <ClayCard
      accent="rgba(141,224,40,0.3)"
      style={[styles.card, { width, height: TICKET_H }]}>
      <Image source={assets.spritePlate} style={styles.plate} resizeMode="contain" />
      <View style={styles.body}>
        <Text style={styles.caption}>
          {isAdd ? 'CUSTOMER WANTS BOTH' : 'CUSTOMER WANTS'}
        </Text>
        {isAdd && order.addends ? (
          <View style={styles.sumRow}>
            <FractionDisplay n={order.addends[0].n} d={order.addends[0].d} size={20} />
            <Text style={styles.plus}>+</Text>
            <FractionDisplay n={order.addends[1].n} d={order.addends[1].d} size={20} />
          </View>
        ) : (
          <FractionDisplay n={order.target.n} d={order.target.d} size={24} />
        )}
      </View>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 2,
  },
  plate: {
    width: 52,
    height: 52,
    marginRight: 14,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  sumRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  plus: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.colors.text.primary,
  },
});

export default React.memo(OrderTicket);
