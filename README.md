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
```

```sh
pnpm install
```

3. 使用 Vite 构建

```sh
npm init vite@latest

npm install  # 补全依赖

touch .gitignore
```

将 `node_modules/` 放入 `.gitignore`

4. 安装 Vue Router

```sh
npm install vue-router@4
```

5. 安装 Pinia

```sh
npm install pinia
```

6. 安装 Sass

```sh
npm install sass
```

7. 安装其余环境

```sh
npm install vite-plugin-vue-setup-extend -D

npm install axios

npm install -D ts-node
```

## 安装组件

1. 安装 md-editor-v3

```sh
npm install md-editor-v3
```

2. 安装 tailwindcss

```sh
npm install -D tailwindcss postcss autoprefixer

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

测试

```html
<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>
```

3. 安装 daisyUI

```sh
npm i -D daisyui@latest
```

在 tailwind.config.js 文件里追加 daisyUI 的设置

```js
module.exports = {
  plugins: [require("daisyui")],
}
```

测试

```html
<div class="dropdown">
  <div tabindex="0" role="button" class="btn m-1">Click</div>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
```

4. 安装 IconPark

```sh
npm install @icon-park/vue-next --save
```

`main.ts` 中添加

```ts
import '@icon-park/vue/styles/index.css';
```

引用

```html
<template>
  <home theme="filled"/>
</template>

<script>
import {Home} from '@icon-park/vue-next';

export default {
    components: {
        Home
    }
}
</script>
```

5. 安装 notivue

```sh
npm i notivue
```

6. 安装 VCalendar

```sh
npm install v-calendar@next @popperjs/core
```

7. 安装 AutoAnimate

```sh
npm install @formkit/auto-animate
```

使用 `v-auto-animate` 作用于其父元素对象上

8. 安装 vue draggable plus

```sh
npm install vue-draggable-plus
```

9. 支持谷歌分析

先安装 vue-gtag, 可让您将事件数据发送到 Google Analytics（分析）、Google Ads 和 Google Marketing Platform

```sh
npm add vue-gtag-next
```

10. 安装 Vue Monaco Editor

```sh
pnpm i @guolao/vue-monaco-editor
```

## 其他一些琐碎的 

在 `vite.config.ts` 添加如下语句以支持 `<script lang="ts" setup name="Main">` 中 `name=""` 的语法

```ts
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
```

```sh
npm install --save vue-clipboard3

npm install --save canvas-confetti
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
npm run dev
```