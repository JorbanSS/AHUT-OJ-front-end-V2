# AHUT OJ front-end V2

An online judge front-end.

## 相关仓库

第一代前端 [ahutoj-view](https://github.com/ximoyuxiao/ahutoj-view)

后端部分 [ahutoj](https://github.com/ximoyuxiao/ahutoj/tree/docker)

## 技术架构

技术周边: [Node.js](https://nodejs.org/en) \ [Vue 3](https://cn.vuejs.org/) \ [Vite](https://cn.vitejs.dev/) \ [TypeScript](https://www.typescriptlang.org/) \ Scss \ Pinia \ Axios \ Vue-Router

UI: [tailwindcss](https://www.tailwindcss.cn/) \ [daisyUI](https://daisyui.com/) \ [IconPark](https://iconpark.oceanengine.com/official)

Plugin: [md-editor-v3](https://imzbf.github.io/md-editor-v3/zh-CN/index)

## 配置环境

1. 安装 [nvm](https://github.com/nvm-sh/nvm/releases)

```sh
wget https://github.com/nvm-sh/nvm/archive/refs/tags/v0.39.7.tar.gz

tar -xzvf v0.39.7.tar.gz

cd nvm-0.39.7

./install.sh

nvm --version  # 检验是否安装成功
```

2. 安装 Node.js

```sh
nvm ls  # 查看可安装版本

nvm install 20.11.1

nvm use 20.11.1

nvm version  # 查看当前使用的 Node.js 版本
```

3. 安装 pnpm

```sh
npm install -g pnpm
```

在根目录下创建 `.npmrc` 的文件

```
# pnpm 配置
shamefully-hoist=true
auto-install-peers=true
strict-peer-dependencies=false
```

将 package-lock.json 转成 pnpm-lock.yaml 文件，保证依赖版本不变

```sh
pnpm import

pnpm install
```

4. 使用 Vite 构建

```sh
pnpm init vite@latest

pnpm install  # 补全依赖

touch .gitignore
```

将 `node_modules/` 放入 `.gitignore`

5. 安装其余环境

```sh
pnpm install vue-router@4

pnpm install pinia

pnpm install sass

pnpm install vite-plugin-vue-setup-extend -D

pnpm install axios

pnpm install -D ts-node
```

## 安装组件

1. 安装 tailwindcss

```sh
pnpm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

`tailwind.config.js` 文件内加上所有的模板文件

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

创建 `tailwind.css` 文件

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`main.ts` 中添加

```sh
import "./assets/scss/tailwind.css";
```

2. 安装 daisyUI

```sh
pnpm i -D daisyui@latest
```

在 tailwind.config.js 文件里追加 daisyUI 的设置

```js
module.exports = {
  plugins: [require("daisyui")],
}
```

3. 安装其余组件

```sh
pnpm install md-editor-v3

pnpm install @icon-park/vue-next --save

pnpm i notivue

pnpm install v-calendar@next @popperjs/core

pnpm install vue-draggable-plus

pnpm i image-conversion --save

pnpm add vue-gtag-next

pnpm i @guolao/vue-monaco-editor

pnpm install --save vue-clipboard3

pnpm install --save canvas-confetti  # 五彩纸屑
```

`main.ts` 中添加

```ts
import '@icon-park/vue/styles/index.css';
```

4. 安装 AutoAnimate

```sh
pnpm install @formkit/auto-animate
```

使用 `v-auto-animate` 作用于其父元素对象上

## 其他一些琐碎的 

在 `vite.config.ts` 添加如下语句以支持 `<script lang="ts" setup name="Main">` 中 `name=""` 的语法

```ts
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
```

修改如下来实现用 `@/` 访问项目根目录

`vite.config.ts` 添加如下

```ts
{
  export default defineConfig({
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  })
}
```

`tsconfig.json` 添加如下

```json
{
  "compilerOptions": {
          "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
    },
  }
}
```

## 运行项目

```sh
pnpm run dev
```