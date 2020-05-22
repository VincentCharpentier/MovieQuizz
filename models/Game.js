import { TmdbAPI } from 'Utils/api';
import EventBus from 'Utils/eventBus';

const EVENT = {
  TOUR_START: 'TOUR_START',
  SCORE: 'SCORE',
};

export default class Game {
  movies = [];
  actors = [];
  running = false;
  startDate = null;
  players = [];
  localScore = 0;
  answers = new Map();
  scores = new Map();
  eventBus = new EventBus();

  init = async () => {
    this.movies = await TmdbAPI.getTopMovies();
    this.actors = this.movies.map(({ cast }) => cast).flat();
  };

  onTourDataChange(cb) {
    this.eventBus.addEventListener(EVENT.TOUR_START, cb);
  }
  offTourDataChange(cb) {
    this.eventBus.removeEventListener(EVENT.TOUR_START, cb);
  }

  onScoreChange(cb) {
    this.eventBus.addEventListener(EVENT.SCORE, cb);
  }
  offScoreChange(cb) {
    this.eventBus.removeEventListener(EVENT.SCORE, cb);
  }

  startTour = () => {
    this._tourData = this._pickTwo();
    this.start();
    this.eventBus.emit(EVENT.TOUR_START, this._tourData);
  };

  start = () => {
    this.startDate = Date.now();
    this.running = true;
    this._pid = requestAnimationFrame(this._tick);
  };

  endTour = () => {
    this.stop();
    const { movie, actor } = this._tourData;
    const correctAnswer = movie.cast.some((a) => a.name === actor.name);
    // check answers
    [...this.answers.entries()].forEach(([player, answer]) => {
      if (answer === correctAnswer) {
        this.scores.set(player, this.scores.get(player) + 1);
      }
    });
    this.notifyScoreUpdate();
  };

  notifyScoreUpdate() {
    this.eventBus.emit(EVENT.SCORE, [...this.scores.entries()]);
  }

  answer(player, answer) {
    this.answers.set(player, answer);
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