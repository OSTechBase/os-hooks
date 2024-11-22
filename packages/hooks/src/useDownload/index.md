---
nav:
  path: /hooks
---

# useDownload

用于通过 URL 或 Blob 下载文件的 Hook 。

## 代码演示

### 使用 url 下载

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

### 使用 blob 下载

<code hideActions='["CSB"]' src="./demo/demo2.tsx" />

## API

```typescript
type useDownload = (type?: url | Blob) => void;

const download: (data: string | Blob, name: string) => void = useDownload<useDownload>();
```

### Result

| 参数     | 说明           | 类型         |
| -------- | -------------- | ------------ |
| download | 返回的下载方法 | `() => void` |

### Options

| 参数 | 说明            | 类型             | 默认值 |
| ---- | --------------- | ---------------- | ------ |
| type | 下载类型(可选） | `url \| Blob`    | 'url'  |
| data | 下载文件类型    | `string \| Blob` | -      |
| name | 下载文件名称    | `string`         | -      |
