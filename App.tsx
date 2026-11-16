/**
 * FractionPizzaLab — screen state machine only. No gameplay lives here.
 */
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import theme from './src/constants/theme';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import FactsScreen from './src/screens/FactsScreen';
import useProgress from './src/hooks/useProgress';
import type { LevelResult } from './src/hooks/useGameSession';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'facts';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [result, setResult] = useState<LevelResult | null>(null);
  const { progress, applyResult, advanceLevel, learnFacts } = useProgress();

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const goFacts = useCallback(() => setScreen('facts'), []);

  const handleGameOver = useCallback(
    (levelResult: LevelResult) => {
      applyResult(levelResult);
      setResult(levelResult);
      setScreen('gameover');
    },
    [applyResult],
  );

  const handleNextLevel = useCallback(() => {
    advanceLevel();
    setScreen('game');
  }, [advanceLevel]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}
      {screen === 'menu' ? (
        <MenuScreen progress={progress} onPlay={goGame} onFacts={goFacts} />
      ) : null}
      {screen === 'game' ? (
        <GameScreen
          key={`level-${progress.level}`}
          levelId={progress.level}
          stars={progress.stars}
          onGameOver={handleGameOver}
          onMenu={goMenu}
        />
      ) : null}
      {screen === 'gameover' && result ? (
        <GameOverScreen
          result={result}
          onPlayAgain={goGame}
          onNextLevel={handleNextLevel}
          onMenu={goMenu}
        />
      ) : null}
      {screen === 'facts' ? (
        <FactsScreen onBack={goMenu} onLearned={learnFacts} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});

export default App;
