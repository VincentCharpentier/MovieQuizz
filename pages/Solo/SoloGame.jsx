import React, { useState, useEffect, useRef, useCallback } from 'react';

import Button from 'Components/Button';
import Game from 'Models/Game';
import { SFX_VALIDATE } from 'Utils/sfx';

import styles from './SoloGame.module.scss';

const LocalPlayer = Symbol();

export default () => {
  // constant game instant
  let game = useRef(new Game()).current;
  const [loading, setLoading] = useState(true);
  const [actor, setActor] = useState(null);
  const [movie, setMovie] = useState(null);
  const [score, setScore] = useState(0);

  const answer = useCallback((match) => {
    game.answer(LocalPlayer, match);
    const answer = game.endTour();
    game.startTour();
  }, []);

  const handleScoreUpdate = useCallback(
    (scores) => {
      const [, newScore] = scores.find(([player]) => player === LocalPlayer);
      if (newScore > score) {
        // todo: effect
        console.log('score updated', score, newScore);
      }
      setScore(newScore);
    },
    [score],
  );

  const handleTourDataChange = useCallback((tourData) => {
    setActor(tourData.actor);
    setMovie(tourData.movie);
  }, []);

  useEffect(() => {
    game.onTourDataChange(handleTourDataChange);
    game.onScoreChange(handleScoreUpdate);
    return () => {
      game.offTourDataChange(handleTourDataChange);
      game.offScoreChange(handleScoreUpdate);
    };
  }, [handleTourDataChange, handleScoreUpdate]);

  useEffect(() => {
    game.init().then(() => {
      setLoading(false);
      game.addPlayer(LocalPlayer);
      game.startTour();
    });
  }, []);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div className={styles.root}>
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
      <div className={styles.btnRow}>
        <div>
          <Button
            className={styles.btn}
            onClick={() => answer(true)}
            clickSound={SFX_VALIDATE}
            color="#8fef8f">
            Plays in
          </Button>
        </div>
        <div>
          <Button
            className={styles.btn}
            onClick={() => answer(false)}
            clickSound={SFX_VALIDATE}
            color="#ef8f8f">
            Doesn't
          </Button>
        </div>
      </div>
      <div className={styles.scoreRow}>
        <ScoreBlock title="Score" value={score} />
        <ScoreBlock title="Highscore" value={0} />
      </div>
    </div>
  );
};

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
