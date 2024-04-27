<template>
  <div class="overflow-hidden bg-white Border shandow-lg card">
    <div class="flex space-x-4 p-6">
      <button class="btn" @click="props.init">
        <left theme="outline" size="20" />返回首页
      </button>
      <select class="select select-bordered w-40 max-w-xs text-base" v-model="lang">
        <option v-for="item in editorLanguageOptions" :value="item.value" :key="item.value">{{ item.label }}</option>
      </select>
      <label class="input input-bordered flex items-center gap-2">
        <span>字体大小<span class="text-sm text-gray-400">(滚轮可调)</span></span>
        <input type="number" class="grow w-28" placeholder="20" v-model="MONACO_EDITOR_OPTIONS.fontSize" min="6"
          max="100" />
      </label>
    </div>
    <div style="height: calc(100vh - 124px - 170px)">
      <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="lang" :options="MONACO_EDITOR_OPTIONS"
        @mount="handleMount" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Editor">
import { reactive, ref, shallowRef, watch } from 'vue';

import { loader } from "@guolao/vue-monaco-editor";
import * as monaco from "monaco-editor";
import { Left } from '@icon-park/vue-next';

import { editorLanguageOptions } from "@/config";

loader.config({ monaco });

let MONACO_EDITOR_OPTIONS = reactive({
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  fontFamily: "Consolas, '微软雅黑'",
  fontSize: 20,
});

let lang = ref('cpp');

const code = ref('// 在线 Editor, 请在此编辑你的代码');
const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);

function formatCode() {
  editorRef.value?.getAction('editor.action.formatDocument').run()
}

interface propsType {
  init?: Function;
};

let props = withDefaults(defineProps<propsType>(), {
  init: () => { },
});

</script>