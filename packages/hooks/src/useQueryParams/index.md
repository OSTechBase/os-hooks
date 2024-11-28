---
nav:
  path: /hooks
---

# useQueryParams

用于获取 URL 上 params 的 Hook。

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx" />

## API

```typescript
const params = useQueryParams(defaultValue?: string);
```

### Params

| 参数         | 说明                     | 类型                  | 默认值      |
| ------------ | ------------------------ | --------------------- | ----------- |
| defaultValue | 可选项，传入默认的状态值 | `string \| undefined` | `undefined` |

### Result

| 参数   | 说明   | 类型               |
| ------ | ------ | ------------------ |
| params | 返回值 | `string \| object` |
