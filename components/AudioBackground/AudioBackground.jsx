import { useEffect } from 'react';

const interactionEvents = [
  'mousedown',
  'scroll',
  'mousewheel',
  'touchstart',
  'keydown',
];

let audioTrack;
function loadSound() {
  audioTrack = new Audio('/sounds/music.mp3');
}
function play() {
  audioTrack.currentTime = 0;
  return audioTrack.play();
}
function stop() {
  return audioTrack.pause();
}

const AudioBackground = () => {
  useEffect(() => {
    loadSound();
    // workaround autoplay limitations
    const initPlay = async () => {
      await play();
      interactionEvents.forEach((ev) =>
        window.removeEventListener(ev, initPlay),
      );
    };
    initPlay().catch((err) => {
      console.log("can't autoplay, waiting for user interaction");
      interactionEvents.forEach((ev) => window.addEventListener(ev, initPlay));
    });
    return () => {
      // app unmount or hot-reload
      stop();
    };
  }, []);

  return null;
};

export default AudioBackground;
