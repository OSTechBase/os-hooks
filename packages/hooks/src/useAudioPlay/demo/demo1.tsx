import React, { useEffect } from 'react';
import { useAudioPlay } from 'os-hooks';

const AudioPlayer: React.FC = () => {
  const { play, pause, replay, setSrc, isPlaying, audio } = useAudioPlay();
  useEffect(() => {
    setSrc('http://music.163.com/song/media/outer/url?id=1908673805.mp3');
    return () => {
      pause()
    }
  }, [])

  const handlePlay = () => {
    play();
  };
  const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audio.volume = volume; // 使用 audio 实例直接设置音量
  };
  return (
    <div>
      <button onClick={handlePlay} disabled={isPlaying}>
        {isPlaying ? '播放...' : '播放'}
      </button>
      <button onClick={pause} disabled={!isPlaying}>
        暂停
      </button>
      <button onClick={replay} disabled={!isPlaying && !isPlaying}>
        重放
      </button>
      <div>
        <label>
          音量:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="1"
            onChange={handleChangeVolume}
          />
        </label>
      </div>
    </div>
  );
};

export default AudioPlayer;
