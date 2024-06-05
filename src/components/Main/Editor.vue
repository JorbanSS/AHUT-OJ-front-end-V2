<template>
  <div class="overflow-hidden bg-white shandow-lg w-full">
    <div class="flex justify-between items-center w-full p-2">
      <div class="flex items-center gap-2">
        <button class="btn" @click="$router.push({ name: 'Index' })" v-if="$route.name === 'Editor'">
          <left theme="outline" size="24" />
          <span class="text-lg">AHUT OJ Editor</span>
        </button>
        <select class="select select-bordered w-40 max-w-xs text-base" v-model="submit.Lang">
          <option v-for="item in editorLanguageOptions" :value="item.language" :key="item.language">{{ item.compiler }}</option>
        </select>
        <label class="input input-bordered flex items-center gap-2">
          <span>字体大小</span>
          <input type="number" class="grow w-20" placeholder="20" v-model="MONACO_EDITOR_OPTIONS.fontSize" min="6"
            max="100" />
        </label>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-success text-white" @click="submitCode()" :disabled="userDataStore.UID == '' || submit.Source == ''"
          v-if="$route.matched.length && $route.matched[0].name === 'Problem'">
          <code-one theme="outline" size="22" />
          <span class="text-lg">评测</span>
        </button>
      </div>
    </div>

    <div style="height: 100vh;">
      <vue-monaco-editor v-model:value="submit.Source" theme="vs-dark" :language="submitLanguageOptions.find(item => item.language === submit.Lang)?.language" :options="MONACO_EDITOR_OPTIONS"
        @mount="handleMount" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Editor">
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Left, CodeOne } from '@icon-park/vue-next';
import { push } from 'notivue';

import { editorLanguageOptions, submitLanguageOptions } from "@/config";
import { useUserDataStore } from '@/stores/UserData';
import { useConstValStore } from '@/stores/ConstVal';

import { loader } from "@guolao/vue-monaco-editor";
import * as monaco from "monaco-editor";
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { _submitCode } from '@/apis/problem';
import { ProblemType } from '@/interfaces/problem';
import { SubmitCodeType } from '@/interfaces/record';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';  // 右键显示菜单
// import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js';  // 折叠
// import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js';  // 格式化代码
// import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js';  // 代码联想提示
// import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js';  // 代码联想提示

const router = useRouter();
const userDataStore = useUserDataStore();
const constValStore = useConstValStore();

// self.MonacoEnvironment = {
//   getWorker: function (_, label) { // workerId, label
//     switch (label) {
//       default:
//         return new editorWorker();
//     }
//   }
// };

loader.config({ monaco });

let MONACO_EDITOR_OPTIONS = reactive({
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  fontFamily: "Consolas, '微软雅黑'",
  fontSize: 20,
});

interface propsType {
  problem: ProblemType,
  CID: number,
  LID: number,
};

let props = withDefaults(defineProps<propsType>(), {
  problem: () => ({
    PID: '',
    Title: '',
    Label: '',
    Visible: 0,
    Submit: 0,
    Accepted: 0,
    Description: '',
    Origin: -1,
    OriginPID: '',
    LimitMemory: 0,
    LimitTime: 0,
    SolutionNumber: 0,
    ContentType: 1,
    Input: '',
    Output: '',
    SampleInput: '',
    SampleOutput: '',
    Hit: '',
    PType: '',

    RecordNumber: 0,
  }),
  CID: 0,
  LID: 0,
});

const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);

function formatCode() {
  editorRef.value?.getAction('editor.action.formatDocument').run()
}

let submit = ref<SubmitCodeType>({
  Lang: 4,
  Source: '',
});

function submitCode() {
  let params = {
    PID: props.problem.PID,
    UID: userDataStore.UID,
    CID: props.CID ? props.CID : -1,
    LID: props.LID ? props.LID : -1,
    Source: submit.value.Source,
    Lang: +submit.value.Lang,
    // OnlineJudging: false,
    // SubmitTime: Date.now(),
    // Input: ''
  }
  if (params.Lang == 5 && (userDataStore.PermissionMap & constValStore.SuperAdminBit) == 0) {
    push.warning({
      title: '提交失败',
      message: '暂不支持 Java 语言提交',
    })
    return;
  }
  _submitCode(params)
    .then((data: any) => {
      push.success({
        title: '提交成功',
        message: '已提交代码',
      })
      router.push({
        name: 'Record',
        params: {
          SID: data.SID,
        },
      });
    })

}



</script>