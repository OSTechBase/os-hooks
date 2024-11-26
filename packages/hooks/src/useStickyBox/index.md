---
nav:
  path: /hooks
---

# useStickyBox

用来处理函数节流的 Hook。

## 代码演示

### 容器为浏览器

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

### 嵌套滚动容器

<code hideActions='["CSB"]' src="./demo/demo2.tsx" />

## API

```typescript
  const [setNode, stickyState] = useStickyBox({
  offsetTop?: number;
  offsetBottom?: number;
});
```

### Options

| 参数         | 说明       | 类型     | 默认值 |
| ------------ | ---------- | -------- | ------ |
| offsetTop    | 吸顶偏移量 | `number` | `0`    |
| offsetBottom | 吸底偏移量 | `number` | `0`    |

### Result

| 参数        | 说明       | 类型          |
| ----------- | ---------- | ------------- |
| setNode     | 节点的 ref | `HTMLElement` |
| stickyState | 粘贴 状态  | `StickyState` |

### StickyState

| 参数           | 说明     | 类型      | 默认值  |
| -------------- | -------- | --------- | ------- |
| isStickyTop    | 粘顶状态 | `boolean` | `false` |
| isStickyBottom | 粘底状态 | `boolean` | `false` |
