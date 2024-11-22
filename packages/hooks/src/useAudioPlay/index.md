---
nav:
  path: /hooks
---

# useAudioPlay

用于播放音频的 Hook 。

## 代码演示

### 播放音频

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

## API

```typescript
const { play, pause, replay, setSrc, isPlaying, src, audio } = useAudioPlay();
```

### Result

| 参数      | 说明                          | 类型                    |
| --------- | ----------------------------- | ----------------------- |
| setSrc    | 设置播放 src                  | `(src: string) => void` |
| isPlaying | 当前播放状态                  | `boolean`               |
| play      | 播放方法                      | `() => void`            |
| pause     | 暂停方法                      | `() => void`            |
| replay    | 重放方法                      | `() => void`            |
| src       | 播放地址                      | `string`                |
| audio     | udio 实例：可对实例自定义操作 | `HTMLAudioElement`      |
