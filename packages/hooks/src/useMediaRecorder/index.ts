import { useRef, useState, useCallback, useEffect } from 'react';
import { MediaOptions, UseMediaRecorderReturn } from './useMediaRecorderType';
import useUnmount from '../useUnmount';
const useMediaRecorder = (
  type: string = 'audio/wav',
  mediaOptions: MediaOptions = { audio: true },
): UseMediaRecorderReturn => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [blobData, setBlobData] = useState<Blob | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // 清理媒体流和录音器
  const cleanup = useCallback(() => {
    mediaStream?.getTracks().forEach((track) => track.stop());
    mediaRecorder.current = null;
  }, []);

  // 开始录音
  const startRecord = useCallback(async () => {
    try {
      setError(null); // 清除之前的错误
      setMediaUrl('');
      setBlobData(null);

      // 请求媒体权限
      const stream = await navigator.mediaDevices.getUserMedia(mediaOptions);
      // mediaStream.current = stream;
      setMediaStream(stream);

      // 初始化 MediaRecorder
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      const chunks: BlobPart[] = [];

      // 收集数据块
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      // 停止时生成 Blob 和 URL
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type });
        setBlobData(blob);
        setMediaUrl(URL.createObjectURL(blob));
      };

      // 错误处理
      recorder.onerror = (event: any) => {
        console.error('Recording error:', event.error);
        setError(event.error);
      };

      // 开始录音
      recorder.start();
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err as Error);
    }
  }, [mediaOptions, type]);

  // 停止录音
  const stopRecord = useCallback(() => {
    try {
      if (
        mediaRecorder.current?.state === 'recording' ||
        mediaRecorder.current?.state === 'paused'
      ) {
        mediaRecorder.current.stop();
      }
      cleanup();
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError(err as Error);
    }
  }, [cleanup]);

  // 暂停录音
  const pauseRecord = useCallback(() => {
    try {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.pause();
      }
    } catch (err) {
      console.error('Failed to pause recording:', err);
      setError(err as Error);
    }
  }, []);

  // 恢复录音
  const resumeRecord = useCallback(() => {
    try {
      if (mediaRecorder.current?.state === 'paused') {
        mediaRecorder.current.resume();
      }
    } catch (err) {
      console.error('Failed to resume recording:', err);
      setError(err as Error);
    }
  }, []);

  // 重置状态
  const reset = useCallback(() => {
    cleanup();
    setMediaUrl('');
    setBlobData(null);
    setError(null);
  }, [cleanup]);

  // 自动清理媒体流
  useUnmount(() => {
    cleanup();
  });
  return {
    mediaUrl,
    blobData,
    mediaStream: mediaStream,
    mediaRecorder: mediaRecorder.current,
    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord,
    reset,
    error,
  };
};

export default useMediaRecorder;
