---
nav:
  path: /hooks
---

# useUrlAsFile

用于将 url 转 file 的 Hook 。

## 代码演示

### url=>file

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

## API

```typescript
const [file, setUrlAsFile, cancelFetch] = useUrlAsFile();
```

### Result

| 参数         | 说明         | 类型                                                               |
| ------------ | ------------ | ------------------------------------------------------------------ |
| file         | 当前状态     | `File \| null`                                                     |
| setUrlAsFile | 设置当前状态 | `(url: string \| URL , filename: string) => Promise<File \| null>` |
| cancelFetch  | 取消请求     | `() => void`                                                       |
