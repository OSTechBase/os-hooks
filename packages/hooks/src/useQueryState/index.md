---
nav:
  path: /hooks
---

# useQueryState

用于将状态同步到 URL 查询参数中的 Hook。

它会对参数值先做 JSON 序列化，再做 Base64 编码；读取时会自动解码并反序列化，适合做查询条件缓存、列表筛选回填、分页状态恢复等场景。

默认会自动识别当前路由模式：普通路由优先写入 `search`，hash 路由优先写入 hash 查询段，并保留当前路由片段。

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx" />

### 默认值与移除参数

<code src="./demo/demo2.tsx" />

## API

```ts
const [state, setState, helpers] = useQueryState<T>(key, options);
```

### Params

| 参数    | 说明             | 类型                           | 默认值 |
| ------- | ---------------- | ------------------------------ | ------ |
| key     | 查询参数名       | `string`                       | -      |
| options | Hook 配置项      | `UseQueryStateOptions<T>`      | -      |

### Options

| 参数         | 说明                                                              | 类型                                                   | 默认值      |
| ------------ | ----------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| defaultValue | URL 中没有参数时返回的默认值                                      | `T \| (() => T)`                                       | -           |
| history      | 更新 URL 时使用 `pushState` 还是 `replaceState`                   | `'push' \| 'replace'`                                  | `'replace'` |
| locationMode | 查询参数的读写位置，支持普通 search、hash 路由或自动识别          | `'auto' \| 'search' \| 'hash'`                         | `'auto'`    |
| serializer   | 自定义序列化方法，序列化结果会再做 Base64 编码                    | `(value: T) => string`                                 | `JSON.stringify` |
| deserializer | 自定义反序列化方法，入参是 Base64 解码后的原始字符串              | `(value: string) => T`                                 | `JSON.parse` |
| onError      | 编解码、解析或写入 URL 失败时的错误回调                           | `(error: unknown) => void`                             | `console.error` |

### Result

| 返回值      | 说明                            | 类型 |
| ----------- | ------------------------------- | ---- |
| state       | 当前参数对应的解码后状态        | `T \| undefined` |
| setState    | 更新状态并同步到 URL            | `(value: T \| undefined \| ((prevState?: T) => T \| undefined)) => void` |
| helpers     | 额外操作方法                    | `{ remove: () => void }` |
