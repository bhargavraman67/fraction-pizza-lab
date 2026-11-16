import React from 'react';
import { ImageBackground, StyleSheet, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'result' | 'facts';

type Blob = { size: number; color: string; opacity: number; pos: ViewStyle };

/**
 * `bg_game` is the only background in the asset contract, so every screen is
 * told apart by its gradient overlay + decor blobs (rule #14: Loader must not
 * look like Menu).
 */
const OVERLAYS: Record<BackgroundVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  result: theme.gradients.result,
  facts: theme.gradients.facts,
};

const BLOBS: Record<BackgroundVariant, Blob[]> = {
  loader: [
    {
      size: 320,
      color: theme.colors.accent.purple,
      opacity: 0.12,
      pos: { top: -80, left: -90 },
    },
    {
      size: 240,
      color: theme.colors.accent.lime,
      opacity: 0.12,
      pos: { bottom: -60, right: -70 },
    },
  ],
  menu: [
    {
      size: 260,
      color: theme.colors.accent.lime,
      opacity: 0.14,
      pos: { top: -70, right: -80 },
    },
    {
      size: 300,
      color: theme.colors.accent.purple,
      opacity: 0.12,
      pos: { top: 220, left: -110 },
    },
  ],
  game: [
    {
      size: 280,
      color: theme.colors.accent.purple,
      opacity: 0.13,
      pos: { top: 90, right: -120 },
    },
  ],
  result: [
    {
      size: 300,
      color: theme.colors.accent.lime,
      opacity: 0.13,
      pos: { top: -90, left: -80 },
    },
    {
      size: 240,
      color: theme.colors.accent.purpleSoft,
      opacity: 0.12,
      pos: { bottom: -70, right: -60 },
    },
  ],
  facts: [
    {
      size: 260,
      color: theme.colors.accent.purple,
      opacity: 0.12,
      pos: { bottom: -80, left: -70 },
    },
  ],
};

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

function ScreenBackground({ variant, children }: Props) {
  const blobs = BLOBS[variant];
  return (
    <ImageBackground
      source={assets.bgGame}
      style={styles.root}
      imageStyle={styles.image}
      resizeMode="cover">
      <LinearGradient
        colors={OVERLAYS[variant]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {blobs.map((blob, index) => (
          <View
            key={`${variant}-blob-${index}`}
            style={[
              styles.blob,
              blob.pos,
              {
                width: blob.size,
                height: blob.size,
                borderRadius: blob.size / 2,
                backgroundColor: blob.color,
                opacity: blob.opacity,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  image: {
    resizeMode: 'cover',
  },
  blob: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
});

export default React.memo(ScreenBackground);
