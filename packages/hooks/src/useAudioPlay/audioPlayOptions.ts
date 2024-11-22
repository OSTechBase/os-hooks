export interface audioPlayOptions {
  play: () => void;
  pause: () => void;
  replay: () => void;
  setSrc: (src: string) => void;
  isPlaying: boolean;
  src: string;
  audio: HTMLAudioElement;
}
