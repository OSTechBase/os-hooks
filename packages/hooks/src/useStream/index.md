---
nav:
  path: /hooks
---

# useStream

用实现流式渲染的 Hook。

## 默认指定格式返参类型

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

## 自定义返参类型

<code hideActions='["CSB"]' src="./demo/demo2.tsx" />

## API

```typescript
  const {messageList,run} = useStream({
  url: string;
  options: Options;
});
```

### Options

| 参数         | 说明                   | 类型          | 默认值  |
| ------------ | ---------------------- | ------------- | ------- |
| init         | 请求参数的配置         | `RequestInit` | `-`     |
| customize    | 是否自定义反参类型     | `boolean`     | `false` |
| formatResult | 对返回数据的自定义处理 | 查看下方说明  | `-`     |

**formatResult 类型说明：**

- 当 `customize` 为 `false` 时： `(res: any) => string`
- 当 `customize` 为 `true` 时： `(res: any, callback: (updatedMessageList: any[]) => void) => void `

### Result

| 参数        | 说明                         | 类型                                                     |
| ----------- | ---------------------------- | -------------------------------------------------------- |
| messageList | 处理后用于更新渲染的数据     | `{ type: string; id: any; response: string }[] \| any[]` |
| run         | 发送请求并更新发送消息的函数 | `(params: ParamsType, message: any) => Promise<void>`    |
