import SfxSound from 'Models/SfxSound';

export const SFX_HOVER = new SfxSound();
export const SFX_VALIDATE = new SfxSound();
export const SFX_SELECT = new SfxSound();
export const BG_AUDIO = new SfxSound();

if (typeof window !== 'undefined') {
  SFX_HOVER.load('/sounds/menu-hover.wav');
  SFX_SELECT.load('/sounds/menu-select.wav');
  SFX_VALIDATE.load('/sounds/menu-validate.wav');
  BG_AUDIO.load('/sounds/music.mp3');
}
