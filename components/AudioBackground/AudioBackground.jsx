import { useContext, useEffect, useRef } from 'react';

import SettingsCtx from 'Contexts/Settings';
import { BG_AUDIO } from 'Utils/sfx';

const interactionEvents = [
  'mousedown',
  'scroll',
  'mousewheel',
  'touchstart',
  'keydown',
];

// ratio to apply on volume settings (plays background music lower than the rest)
const VOLUME_RATIO = 0.8;

async function tryPlayAsap() {
  let cleanup = () => null;
  const initPlay = async () => {
    await BG_AUDIO.play();
    interactionEvents.forEach((ev) => window.removeEventListener(ev, initPlay));
  };
  try {
    await initPlay();
  } catch (err) {
    // workaround autoplay limitations
    console.log("can't autoplay, waiting for user interaction");
    interactionEvents.forEach((ev) => window.addEventListener(ev, initPlay));
    cleanup = () =>
      interactionEvents.forEach((ev) =>
        window.removeEventListener(ev, initPlay),
      );
  }
  return cleanup;
}

const AudioBackground = () => {
  const cleanUpListeners = useRef(null);
  const { soundActive, soundVolume } = useContext(SettingsCtx);

  useEffect(() => {
    BG_AUDIO.loop = true;
    BG_AUDIO.volume = VOLUME_RATIO;
    return () => {
      // app unmount or hot-reload
      BG_AUDIO.stop();
    };
  }, []);

  useEffect(() => {
    if (cleanUpListeners.current) {
      cleanUpListeners.current();
      cleanUpListeners.current = null;
    }
    (async () => {
      if (soundActive) {
        cleanUpListeners.current = await tryPlayAsap();
      } else {
        BG_AUDIO.stop();
      }
    })();
  }, [soundActive]);

  useEffect(() => {
    if (BG_AUDIO) {
      BG_AUDIO.setVolume(soundVolume * VOLUME_RATIO);
    }
  }, [soundVolume]);

  return null;
};

export default AudioBackground;
