import React from 'react';
import { useMediaRecorder } from 'os-hooks';
import { Flex } from 'antd';

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
    <Flex wrap gap={10}>
      <button onClick={() => startRecord()}>录音</button>
      <button onClick={() => startRecord(250, (blob) => {
        console.log('实时录音', blob);
      })}>实时录音</button>
      <button onClick={pauseRecord}>暂停</button>
      <button onClick={resumeRecord}>恢复录音</button>
      <button onClick={stopRecord}>结束录音</button>
      <button onClick={reset}>重录</button>
      {mediaUrl && <audio controls src={mediaUrl} />}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </Flex >
  );
};

export default RecorderDemo;

