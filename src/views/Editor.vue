<template>
  <div class="overflow-hidden bg-white shandow-lg w-full">
    <div class="flex gap-2 p-2">
      <button class="btn" @click="$router.push({ name: 'Index' })" v-if="$route.name == 'Editor'">
        <left theme="outline" size="24" />
        <span class="text-lg">AHUT OJ Editor</span>
      </button>
      <select class="select select-bordered w-40 max-w-xs text-base" v-model="lang">
        <option v-for="item in editorLanguageOptions" :value="item.value" :key="item.value">{{ item.label }}</option>
      </select>
      <label class="input input-bordered flex items-center gap-2">
        <span>字体大小</span>
        <input type="number" class="grow w-20" placeholder="20" v-model="MONACO_EDITOR_OPTIONS.fontSize" min="6"
          max="100" />
      </label>
    </div>
    <div style="height: 100vh;">
      <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="lang" :options="MONACO_EDITOR_OPTIONS"
      @mount="handleMount" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Editor">
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';

import { Left, Sleep } from '@icon-park/vue-next';

import { editorLanguageOptions } from "@/config";

import { loader } from "@guolao/vue-monaco-editor";
// import * as monaco from "monaco-editor";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';  // 右键显示菜单
// import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js';  // 折叠
// import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js';  // 格式化代码
// import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js';  // 代码联想提示
// import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js';  // 代码联想提示

let lang = ref('cpp');

self.MonacoEnvironment = {
  getWorker: function (_, label) { // workerId, label
    switch (label) {
      default:
        return new editorWorker();
    }
  }
};

loader.config({ monaco });

let MONACO_EDITOR_OPTIONS = reactive({
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  fontFamily: "Consolas, '微软雅黑'",
  fontSize: 20,
});

// interface propsType {

// };

// let props = withDefaults(defineProps<propsType>(), {

// });

const code = ref('// 在线 Editor, 请在此编辑你的代码');
const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);

function formatCode() {
  editorRef.value?.getAction('editor.action.formatDocument').run()
}

</script>