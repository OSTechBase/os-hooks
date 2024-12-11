---
nav:
  path: /hooks
---

# useStream

用实现流式渲染的 Hook。

## 代码演示

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

## API

```typescript
  const {messageList,run} = useStream({
  url: string;
  options: Options;
});
```

### Options

| 参数         | 说明                   | 类型                | 默认值 |
| ------------ | ---------------------- | ------------------- | ------ |
| init         | 请求参数的配置         | `RequestInit`       | `-`    |
| formatResult | 对返回数据的自定义处理 | `(res: any) => any` | `-`    |

### Result

| 参数        | 说明                         | 类型                                                  |
| ----------- | ---------------------------- | ----------------------------------------------------- |
| messageList | 处理后用于更新渲染的数据     | `any[]`                                               |
| run         | 发送请求并更新发送消息的函数 | `(params: ParamsType, message: any) => Promise<void>` |
