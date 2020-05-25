import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

import Button from 'Components/Button';
import Routes from 'Constants/routes';
import Game from 'Models/Game';
import { SFX_VALIDATE } from 'Utils/sfx';

import styles from './SoloGame.module.scss';

const LocalPlayer = Symbol();

const HIGHSCORE_LS_KEY = 'localHighScore';
function retriveLocalHighscore() {
  return localStorage.getItem(HIGHSCORE_LS_KEY);
}

function saveLocalHighscore(highscore) {
  localStorage.setItem(HIGHSCORE_LS_KEY, highscore);
}

function getLocalPlayerScore(allScores) {
  const [, score] = allScores.find(([player]) => player === LocalPlayer);
  return score;
}

export default () => {
  const router = useRouter();
  // constant game instant
  let game = useRef(new Game()).current;
  const [loading, setLoading] = useState(true);
  const [actor, setActor] = useState(null);
  const [highscore, setHighscore] = useState();
  const [movie, setMovie] = useState(null);
  const [score, setScore] = useState(0);
  const [roundNo, setRoundNo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const isNewHighScore = !highscore || score > highscore;

  const handleAnswer = useCallback((match) => {
    game.answer(LocalPlayer, match);
    game.endRound();
  }, []);

  const initGame = useCallback(() => {
    setIsGameOver(false);
    game.init().then(() => {
      setLoading(false);
      game.addPlayer(LocalPlayer);
      game.startRound();
    });
  }, [setIsGameOver, setLoading, game]);

  const handleScoreUpdate = useCallback(
    (allScores) => {
      const newScore = getLocalPlayerScore(allScores);
      if (newScore > score) {
        // todo: effect
        // console.log('score updated', score, newScore);
      }
      setScore(newScore);
    },
    [score],
  );

  const handleRoundDataChange = useCallback((roundData) => {
    setActor(roundData.actor);
    setMovie(roundData.movie);
    setRoundNo(game.roundCount);
    setTimerKey(game.startDate);
  }, []);

  const handleGameOver = useCallback(
    (allScores) => {
      const newScore = getLocalPlayerScore(allScores);
      if (!highscore || newScore > highscore) {
        saveLocalHighscore(newScore);
        setHighscore(newScore);
      }
      setIsGameOver(true);
    },
    [setHighscore, setIsGameOver],
  );

  const handleReplay = useCallback(() => {
    setScore(0);
    initGame();
  }, [setScore, initGame]);

  const handleQuit = useCallback(() => {
    router.push(Routes.HOME);
  }, [router]);

  useEffect(() => {
    game.onRoundDataChange(handleRoundDataChange);
    game.onScoreChange(handleScoreUpdate);
    game.onGameOver(handleGameOver);
    return () => {
      game.offRoundDataChange(handleRoundDataChange);
      game.offScoreChange(handleScoreUpdate);
      game.offGameOver(handleGameOver);
    };
  }, [handleRoundDataChange, handleScoreUpdate, handleGameOver]);

  useEffect(() => {
    setHighscore(retriveLocalHighscore());
    initGame();
  }, []);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div className={styles.root}>
      {!isGameOver && (
        <GameScreen
          {...{
            roundNo,
            actor,
            movie,
            handleAnswer,
            score,
            highscore,
            timerKey,
          }}
        />
      )}
      {isGameOver && (
        <EndGameScreen
          {...{ score, handleReplay, handleQuit, isNewHighScore }}
        />
      )}
    </div>
  );
};

const EndGameScreen = ({ score, handleQuit, handleReplay, isNewHighScore }) => (
  <div className={styles.endGameScreen}>
    <ScoreBlock title="Final Score" value={score} />
    {isNewHighScore && <div>NEW HIGHSCORE !</div>}
    <div>
      <Button onClick={handleReplay}>Replay</Button>
      <Button onClick={handleQuit}>Quit</Button>
    </div>
  </div>
);

const GameScreen = ({
  roundNo,
  actor,
  movie,
  handleAnswer,
  score,
  highscore,
  timerKey,
}) => (
  <>
    <p>Round {roundNo} / 10</p>
    <div className={styles.picContainer}>
      {actor && (
        <div className={styles.subjectContainer}>
          <img src={actor.pic} />
          <p>
            <AutoSizeText text={actor.name} />
          </p>
        </div>
      )}
      {movie && (
        <div className={styles.subjectContainer}>
          <img src={movie.pic} />
          <p>
            <AutoSizeText text={movie.title} />
          </p>
        </div>
      )}
    </div>
    <div className={styles.timerBar}>
      <div key={timerKey} className={styles.fillBar} />
    </div>
    <div className={styles.btnRow}>
      <div>
        <Button
          className={styles.btn}
          onClick={() => handleAnswer(true)}
          clickSound={SFX_VALIDATE}
          color="#8fef8f">
          Plays in
        </Button>
      </div>
      <div>
        <Button
          className={styles.btn}
          onClick={() => handleAnswer(false)}
          clickSound={SFX_VALIDATE}
          color="#ef8f8f">
          Doesn't
        </Button>
      </div>
    </div>
    <div className={styles.scoreRow}>
      <ScoreBlock title="Score" value={score} />
      <ScoreBlock title="Highscore" value={highscore || 'N/A'} />
    </div>
  </>
);

const computeTextSize = (text) =>
  1 * 0.9 ** Math.round(text.length / 10) + 'em';

const AutoSizeText = ({ text, style, ...rest }) => {
  const _style = {
    fontSize: computeTextSize(text),
    ...style,
  };
  return (
    <span style={_style} {...rest}>
      {text}
    </span>
  );
};

const ScoreBlock = ({ title, value }) => (
  <div className={styles.scoreBlock}>
    <div>{title}</div>
    <div>{value}</div>
  </div>
);
