<template>
  <div style="height: calc(100vh - 124px - 48px)">
    <vue-monaco-editor v-model:value="code" theme="vs-dark" language="cpp" :options="MONACO_EDITOR_OPTIONS"
      @mount="handleMount" style="height: calc(100vh - 124px - 48px);" />
  </div>
</template>

<script lang="ts" setup name="Editor">
import { ref, shallowRef } from 'vue';
import * as monaco from "monaco-editor";
import { loader } from "@guolao/vue-monaco-editor";

loader.config({ monaco });

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};

const code = ref('// C++ Editor');
const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);

function formatCode() {
  editorRef.value?.getAction('editor.action.formatDocument').run()
}

</script>