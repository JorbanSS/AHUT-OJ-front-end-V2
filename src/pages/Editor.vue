<template>
  <div
    :class="isFullScreen ? 'position-fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50' : 'overflow-hidden bg-white p-6 Border shandow-lg card'">
    <div class="flex space-x-4">
      <select class="select select-bordered w-52 max-w-xs text-base" v-model="lang">
        <option v-for="item in editorLanguageOptions" :value="item.value" :key="item.value">{{ item.label }}</option>
      </select>
      <label class="input input-bordered flex items-center gap-2">
        字体大小（滚轮可调）
        <input type="number" class="grow w-40" placeholder="20" v-model="MONACO_EDITOR_OPTIONS.fontSize" min="6"
          max="100" />
      </label>
      <div class="form-control mt-0.5">
        <label class="label cursor-pointer">
          <span class="label-text">去除编辑器边框+浏览器全屏</span>
          <input type="checkbox" class="toggle ml-4" v-model="isFullScreen" />
        </label>
      </div>
    </div>
    <div class="m-3"></div>
    <div :style="isFullScreen ? 'height: calc(100vh - 124px - 110px)' : 'height: calc(100vh - 124px - 170px)'">
      <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="lang" :options="MONACO_EDITOR_OPTIONS"
        @mount="handleMount" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Editor">
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';
import * as monaco from "monaco-editor";
import { loader } from "@guolao/vue-monaco-editor";
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
let isFullScreen = ref(false);

const code = ref('// 在线 Editor, 请在此编辑你的代码');
const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);

function formatCode() {
  editorRef.value?.getAction('editor.action.formatDocument').run()
}

watch(() => isFullScreen.value, () => {
  if (isFullScreen.value) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
})

</script>