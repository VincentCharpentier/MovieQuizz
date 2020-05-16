export default class SfxSound {
  constructor(url) {
    this.sound = null;
  }
  load(url) {
    this.sound = new Audio(url);
  }
  play() {
    this.sound.currentTime = 0;
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}
