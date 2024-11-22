---
nav:
  path: /hooks
---

# useModalFn

无需添加 dom 而打开 Modal 的 Hook 。

## 代码演示

### 基本弹框

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

### 表单弹框

<code hideActions='["CSB"]' src="./demo/demo2.tsx" />

## API

```typescript
const openModal = useModalFn(useModalType:'dom' | 'form');
```

### Params

| 参数         | 说明         | 类型                                                               | 默认值 |
| ------------ | ------------ | ------------------------------------------------------------------ | ------ |
| useModalType | 弹框的类型   | `dom \| form`                                                      | `dom`  |
| openModal    | 弹框参数配置 | `(config: ModalType) => void) \| ((config: ModalFormType) => void` | -      |

### ModalType

通用属性参考：[ModalProps](https://ant.design/components/modal-cn#api)

#### 基本弹框参数

| 参数     | 说明                     | 类型              |
| -------- | ------------------------ | ----------------- |
| onClose  | 关闭弹框处理自定义的回调 | `function(e)`     |
| onOk     | 点击确定回调             | `() => boolean`   |
| children | 弹窗的 children          | `React.ReactNode` |

### ModalFormType

通用属性参考：[ModalFormProps](https://procomponents.ant.design/components/modal-form#modalform)

#### 基本弹框参数

| 参数     | 说明                     | 类型                      |
| -------- | ------------------------ | ------------------------- |
| onClose  | 关闭弹框处理自定义的回调 | `function(e)`             |
| onFinish | 点击确定回调             | `async (values)=>boolean` |
| children | 弹窗的 children          | `JSX.Element`             |
