import { TmdbAPI } from 'Utils/api';
import EventBus from 'Utils/eventBus';

const MAX_ROUND = 10;
const ROUND_DURATION = 5000;
const ANSWER_BASE_SCORE = 1000;

const EVENT = {
  TOUR_START: 'TOUR_START',
  SCORE: 'SCORE',
  GAME_OVER: 'GAME_OVER',
};

export default class Game {
  _hasData = false;
  movies = [];
  actors = [];
  running = false;
  startDate = null;
  players = [];
  localScore = 0;
  answers = new Map();
  scores = new Map();
  eventBus = new EventBus();
  roundCount = 1;
  endRoundTimer = null;

  init = async () => {
    this.roundCount = 1;
    if (!this._hasData) {
      this.movies = await TmdbAPI.getTopMovies();
      this.actors = this.movies.map(({ cast }) => cast).flat();
      this._hasData = true;
    }
  };

  onRoundDataChange(cb) {
    this.eventBus.addEventListener(EVENT.TOUR_START, cb);
  }
  offRoundDataChange(cb) {
    this.eventBus.removeEventListener(EVENT.TOUR_START, cb);
  }

  onScoreChange(cb) {
    this.eventBus.addEventListener(EVENT.SCORE, cb);
  }
  offScoreChange(cb) {
    this.eventBus.removeEventListener(EVENT.SCORE, cb);
  }

  onGameOver(cb) {
    this.eventBus.addEventListener(EVENT.GAME_OVER, cb);
  }
  offGameOver(cb) {
    this.eventBus.removeEventListener(EVENT.GAME_OVER, cb);
  }

  startRound = () => {
    this._tourData = this._pickTwo();
    this.start();
    this.eventBus.emit(EVENT.TOUR_START, this._tourData);
    this._endRoundTimer = setTimeout(this.endRound, ROUND_DURATION);
  };

  start = () => {
    this.startDate = Date.now();
    this.running = true;
    this._pid = requestAnimationFrame(this._tick);
  };

  endRound = () => {
    clearTimeout(this._endRoundTimer);
    this.stop();
    const { movie, actor } = this._tourData;
    const correctAnswer = movie.cast.some((a) => a.name === actor.name);
    // check answers & compute scores
    [...this.answers.entries()].forEach(([player, [answer, timestamp]]) => {
      if (answer === correctAnswer) {
        const answerTime = timestamp - this.startDate;
        const scoreRatio = 1 - answerTime / ROUND_DURATION;
        const answerScore = Math.round(ANSWER_BASE_SCORE * scoreRatio);
        const prevScore = this.scores.get(player);
        this.scores.set(player, prevScore + answerScore);
      }
    });
    // clear answers
    this.answers.clear();
    this.notifyScoreUpdate();
    this.roundCount++;
    if (this.roundCount > MAX_ROUND) {
      this.eventBus.emit(EVENT.GAME_OVER, [...this.scores.entries()]);
    } else {
      this.startRound();
    }
  };

  notifyScoreUpdate() {
    this.eventBus.emit(EVENT.SCORE, [...this.scores.entries()]);
  }

  answer(player, answer) {
    this.answers.set(player, [answer, Date.now()]);
  }

  _pickTwo() {
    const randMovieIdx = Math.floor(Math.random() * this.movies.length);
    const movie = this.movies[randMovieIdx];
    const pickExternal = movie.cast.length === 0 || !!Math.round(Math.random());
    let actor;
    if (pickExternal) {
      const randActorIdx = Math.floor(Math.random() * this.actors.length);
      actor = this.actors[randActorIdx];
    } else {
      const randActorIdx = Math.floor(Math.random() * movie.cast.length);
      actor = movie.cast[randActorIdx];
    }
    return { movie, actor };
  }

  stop() {
    cancelAnimationFrame(this._pid);
    this.running = false;
  }

  addPlayer(player) {
    this.players.push(player);
    this.scores.set(player, 0);
    this.notifyScoreUpdate();
  }

  _tick = (t) => {
    if (!this._lastTick) {
      this._lastTick = t;
    }
    let dt = t - this._lastTick;
    this._lastTick = t;

    // Game tick logic

    this._pid = requestAnimationFrame(this._tick);
  };
}
