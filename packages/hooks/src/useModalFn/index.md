---
nav:
  path: /hooks
---

# useModalFn

无需添加 DOM 即可快速打开 Modal 或表单弹窗的 Hook，支持普通内容弹窗和表单弹窗（兼容 `ModalForm` 与 `BetaSchemaForm`）。

## 代码演示

### 基本弹框

<code hideActions='["CSB"]' src="./demo/demo1.tsx" />

### 表单弹框（使用 children）

<code hideActions='["CSB"]' src="./demo/demo2.tsx" />

### 表单弹框（使用 columns）

<code hideActions='["CSB"]' src="./demo/demo3.tsx" />

## API

```ts
const openModal = useModalFn(useModalType: 'dom' | 'form');


### Params

| 参数         | 说明         | 类型                                                               | 默认值 |
| ------------ | ------------ | ------------------------------------------------------------------ | ------ |
| useModalType | 弹框的类型   | `'dom' \| 'form'`                                                  | `dom`  |
| openModal    | 弹框参数配置 | `(config: ModalType \| ModalFormType) => void`                     | -      |

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

| 参数     | 说明                               | 类型                                |
| -------- | ---------------------------------- | ----------------------------------- |
| onClose  | 关闭弹框时的回调                   | `(e: React.SyntheticEvent) => void` |
| onFinish | 表单提交回调，返回 true 则关闭弹框 | `async (values: any) => boolean`    |
| children | 自定义表单内容                     | `JSX.Element`                       |
| columns  | 表单字段配置（启用 BetaSchemaForm）| `ProFormColumnsType<any>[]`         |
```
