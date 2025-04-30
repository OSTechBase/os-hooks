---
nav:
  path: /hooks
---

# useMediaRecorder

用于录制音频或视频的 Hook 。

## 代码演示

### 录制音频

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

### 录制视频

<code hideActions='["CSB"]' src="./demo/demo2.tsx" />

## API

```typescript
const { audioUrl, startRecord, stopRecord, pauseRecord, resumeRecord, reset, error } =
  useMediaRecorder(type:string,options:MediaOptions);
```

### Params

| 参数    | 说明                    | 类型           | 默认值            |
| ------- | ----------------------- | -------------- | ----------------- |
| type    | 生成 url 或 blob 的类型 | `string`       | `audio/wav`       |
| options | 多媒体配置              | `MediaOptions` | `{ audio: true }` |

### MediaOptions

| 参数  | 说明         | 类型                               | 默认值 |
| ----- | ------------ | ---------------------------------- | ------ |
| audio | 录制音频参数 | `boolean \| MediaTrackConstraints` | `true` |
| video | 录制视频参数 | `boolean`                          | -      |

### Result

| 参数          | 说明                 | 类型                                                                                           |
| ------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| mediaUrl      | 录制媒体的 url       | `string`                                                                                       |
| blobData      | 录制媒体的 blob 数据 | `Blob`                                                                                         |
| mediaRecorder | 媒体实例             | `MediaRecorder`                                                                                |
| startRecord   | 开始录音             | `() => Promise<void> \| (timeslice?: number, onChunk?: (blob: Blob) => void) => Promise<void>` |
| pauseRecord   | 暂停录音             | `() => void`                                                                                   |
| stopRecord    | 停止录音             | `() => void`                                                                                   |
| resumeRecord  | 恢复录音             | `() => void`                                                                                   |
| reset         | 重置录音             | `() => void`                                                                                   |
| error         | 错误状态             | `Error \| null`                                                                                |
