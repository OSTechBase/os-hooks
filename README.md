# os-hooks

React 业务 Hooks

## ⛰️ 能力支持

### 1. 可靠的代码健壮

使用 Typescript 构建，提供完善的类型定义文件

### 2. 完善的文档能力

支持文档记录，支持 demo 演示

### 3. 完整的测试用例

配套完整的测试用例，帮助您提升项目健壮性

## 📦 安装

```bash
$ npm install --save os-hooks
# or
$ pnpm add os-hooks
```

## 🔨 使用

```ts
import { useToggle } from 'os-hooks';
```

## 🌟 设计目的

在前端项目开发中，我们通常有着各种各样可以复用的业务场景，如何能够将重复的代码量转为可复用的开发工具，是判断一个程序员编码水平及代码能力的衡量因素之一。但如何实现代码复用，也是前端开发同学乃至前端架构师都老生常谈的一个问题。

Open Source Hooks 是针对 React 开发中出现的各种各样可以复用的业务场景定制的一个前端业务 react hooks 库。

## ⚒️ 技术选型

### 包管理工具 -- pnpm

作为基础包，选择社区内更推崇的`pnpm`作为包管理工具，主要原因有：

1. `pnpm`安装速度更快，磁盘空间利用率高；
2. `pnpm`的`lock`文件适用于多个单一子功能的模块，且能保证每个模块的依赖不耦合；
3. 打包产物清晰，打包后产物确保全部为静态站点资源；

### 构建工具 -- webpack & gulp

1. 最终产物为多个基础子功能模块的耦合，选择`gulp`这种流程式的构建工具，能够更清晰的表达构建流程；
2. 选择常用的`webpack`作为构建产物的声明式接入方式；

### 静态文件打包工具 -- dumi

就目前前端社区而言，`dumi`是当之无愧的为组件研发而生的静态站点解决方案；

### 测试工具 -- jest

`jest`功能全面，资料丰富，能够很好地支撑原子化集合的工具函数；

## 📧 联系

- **Open Source Hooks** <https://ostechbase.github.io/os-hooks/>
- **GitHub**: <https://github.com/OSTechBase/os-hooks>
- **NPM**: <https://www.npmjs.com/package/os-hooks>

</br>
