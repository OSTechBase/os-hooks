import { useEffect, useRef, useState } from 'react';
import { audioPlayOptions } from './audioPlayOptions';

const useAudioPlay = (): audioPlayOptions => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [src, setSrc] = useState('');
  const audioRef = useRef(new Audio());
  useEffect(() => {
    const audio = audioRef.current;
    if (src) {
      audio.src = src;
      audio.onended = () => {
        audio.pause();
        setIsPlaying(false);
      };
    }
    return () => audio.pause();
  }, [src]);

  const play = () => {
    const audio = audioRef.current;
    if (src) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else {
      console.warn('No audio source set');
      return;
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };
  const replay = () => {
    const audio = audioRef.current;
    audio.currentTime = 0; // 重置播放时间到起点
    play(); // 调用 play 方法重新播放
  };
  return {
    play,
    pause,
    setSrc,
    replay,
    isPlaying,
    src,
    audio: audioRef.current,
  };
};

export default useAudioPlay;
