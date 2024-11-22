import React from 'react';
import { useMediaRecorder } from 'os-hooks';

const RecorderDemo = () => {
  const {
    mediaUrl,
    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord,
    reset,
    error,
  } = useMediaRecorder();
  return (
    <div>
      <button onClick={startRecord}>录音</button>
      <button onClick={pauseRecord}>暂停</button>
      <button onClick={resumeRecord}>恢复录音</button>
      <button onClick={stopRecord}>结束录音</button>
      <button onClick={reset}>重录</button>
      {mediaUrl && <audio controls src={mediaUrl} />}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default RecorderDemo;

