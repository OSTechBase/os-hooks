import React, { useEffect, useRef } from 'react';
import { useMediaRecorder } from 'os-hooks';

const RecorderDemo = () => {
  const {
    mediaUrl,
    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord,
    reset,
    mediaStream,
    mediaRecorder,
    error,
  } = useMediaRecorder('video/webm', { video: true, audio: true });

  const videoRef = useRef<HTMLVideoElement>(null);

  // 绑定实时视频流到 <video> 元素
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div>
      <h1>视频录制 Demo</h1>
      <div>
        {mediaRecorder && <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: '100%', maxWidth: '500px', border: '1px solid #ccc' }}
        />}
        {mediaUrl && (
          <>
            <h3>录制结果：</h3>
            <video
              src={mediaUrl}
              controls
              style={{ width: '100%', maxWidth: '500px', border: '1px solid #ccc' }}
            />
          </>
        )}
      </div>
      <div style={{ margin: '10px 0' }}>
        <button onClick={startRecord}>开始录制</button>
        <button onClick={pauseRecord}>暂停录制</button>
        <button onClick={resumeRecord}>恢复录制</button>
        <button onClick={stopRecord}>停止录制</button>
        <button onClick={reset}>重置</button>
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default RecorderDemo;
