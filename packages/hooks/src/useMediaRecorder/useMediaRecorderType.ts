interface UseMediaRecorderReturn {
  mediaUrl: string; // 音频 URL
  blobData: Blob | null; // 音频 Blob
  mediaStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  startRecord: () => Promise<void>; // 开始录音
  stopRecord: () => void; // 停止录音
  pauseRecord: () => void; // 暂停录音
  resumeRecord: () => void; // 恢复录音
  reset: () => void; // 重置状态
  error: Error | null; // 错误状态
}
interface MediaOptions {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
}
export { UseMediaRecorderReturn, MediaOptions };
