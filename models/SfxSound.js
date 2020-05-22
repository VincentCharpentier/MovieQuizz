export default class SfxSound {
  constructor(url) {
    this.sound = null;
  }
  load(url) {
    this.sound = new Audio(url);
  }
  play() {
    this.sound.currentTime = 0;
    return this.sound.play();
  }
  stop() {
    return this.sound.pause();
  }
  setVolume(volume) {
    this.sound.volume = volume;
  }
}
