---
nav:
  path: /hooks
---

# useQueryParams

用于获取 URL 上的查询参数的 Hook，支持读取当前浏览器地址、指定的 search 字符串或完整 URL。

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx" />

### 自定义 search

<code src="./demo/demo2.tsx" />

### 自定义完整 URL

<code src="./demo/demo3.tsx" />

## API

```ts
// 获取全部参数
const params = useQueryParams(options?: { search?: string; url?: string });

// 获取指定参数
const value = useQueryParams(paramName: string, options?: { search?: string; url?: string });
```

### Params

| 参数      | 说明                               | 类型                                | 默认值                 |
| --------- | ---------------------------------- | ----------------------------------- | ---------------------- |
| paramName | （可选）指定要获取的参数名         | `string`                            | -                      |
| options   | （可选）自定义查询字符串或完整 URL | `{ search?: string; url?: string }` | 使用 `window.location` |

### Result

| 返回类型         | 说明                                     |
| ---------------- | ---------------------------------------- |
| `string \| null` | 如果传入了 `paramName`，返回对应参数值   |
| `object`         | 如果未传入 `paramName`，返回全部参数对象 |
