<template>
  <div class="overflow-hidden bg-white shandow-lg w-full">
    <div class="flex justify-between items-center w-full p-2">
      <div class="flex items-center gap-2">
        <button
          class="btn"
          @click="$router.push({ name: 'Index' })"
          v-if="$route.name === 'Editor'"
        >
          <left theme="outline" size="24" />
          <span class="text-lg">AHUT OJ Editor</span>
        </button>
        <span>编辑器选项</span>
        <select
          class="select select-bordered w-40 max-w-xs text-base"
          v-model="editorLanguage"
          @change="updateLanguage"
        >
          <option
            v-for="item in editorLanguageOptions"
            :value="item"
            :key="item.language"
          >
            {{ item.compiler }}
          </option>
        </select>
        <span>字体大小</span>
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="number"
            class="grow w-20"
            placeholder="20"
            v-model="selectedFontSize"
            min="10"
            max="30"
            @change="changeFontSize(`${selectedFontSize}px`)"
          />
        </label>
        <span>Tab大小</span>
        <select
          class="select select-bordered w-40 max-w-xs text-base"
          v-model="selectedTabSize"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="btn btn-success text-white"
          @click="submitCode()"
          :disabled="userDataStore.UID == '' || submit.Source == ''"
          v-if="$route.matched.length && $route.matched[0].name === 'Problem'"
        >
          <code-one theme="outline" size="22" />
          <span class="text-lg">评测</span>
        </button>
      </div>
    </div>

    <Codemirror
      :autofocus="true"
      :indent-with-tab="true"
      v-model="submit.Source"
      placeholder="Please enter the code"
      ref="editorRef"
      :extensions="baseExtensions"
      :tab-size="selectedTabSize"
      @ready="onEditorReady"
      :style="{ height: '91%' }"
      class="flex-1"
    >
    </Codemirror>

    <div class="float-right mr-8 inline-block">
      <span class="text-sm mr-4">Length: {{ state.length }}</span>
      <span class="text-sm mr-4">Lines: {{ state.lines }}</span>
      <span class="text-sm mr-4">Cursor: {{ state.cursor }}</span>
      <span class="text-sm mr-4">Selected: {{ state.selected }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup name="Editor">
import { onMounted, reactive, ref, shallowRef, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { Left, CodeOne } from "@icon-park/vue-next";
import { push } from "notivue";

import { editorLanguageOptions, submitLanguageOptions } from "@/config";
import { useUserDataStore } from "@/stores/UserData";
import { useConstValStore } from "@/stores/ConstVal";

import { _submitCode } from "@/apis/problem";
import { ProblemType } from "@/interfaces/problem";
import { SubmitCodeType } from "@/interfaces/record";
import { EditorLanguageOption } from "@/interfaces/oj";
import { EditorView, keymap } from "@codemirror/view";
import {
  // EditorState,
  Extension,
  Compartment,
  StateEffect,
} from "@codemirror/state";
import { languageServer } from "codemirror-languageserver";
import { basicSetup } from "codemirror";
import { LanguageDescription } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { insertTab, indentLess } from "@codemirror/commands";

import { Codemirror } from "vue-codemirror";
const router = useRouter();
const userDataStore = useUserDataStore();
const constValStore = useConstValStore();

interface propsType {
  problem: ProblemType;
  CID: number;
  LID: number;
}

let props = withDefaults(defineProps<propsType>(), {
  problem: () => ({
    PID: "",
    Title: "",
    Label: "",
    Visible: 0,
    Submit: 0,
    Accepted: 0,
    Description: "",
    Origin: -1,
    OriginPID: "",
    LimitMemory: 0,
    LimitTime: 0,
    SolutionNumber: 0,
    ContentType: 1,
    Input: "",
    Output: "",
    SampleInput: "",
    SampleOutput: "",
    Hit: "",
    PType: "",

    RecordNumber: 0,
  }),
  CID: 0,
  LID: 0,
});

let editorLanguage: EditorLanguageOption = reactive({
  label: "C++",
  value: "cpp",
  compiler: "C++17 (g++ 12.2.0)",
  language: 4,
});

let submit = ref<SubmitCodeType>({
  Lang: editorLanguage.language,
  Source: "",
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
  };
  if (
    params.Lang == 5 &&
    (userDataStore.PermissionMap & constValStore.SuperAdminBit) == 0
  ) {
    push.warning({
      title: "提交失败",
      message: "暂不支持 Java 语言提交",
    });
    return;
  }
  _submitCode(params).then((data: any) => {
    push.success({
      title: "提交成功",
      message: "已提交代码",
    });
    router.push({
      name: "Record",
      params: {
        SID: data.SID,
      },
    });
  });
}

const compartments = new Map<string, Compartment>();

const getCompartment = (key: string) => {
  if (!compartments.has(key)) {
    compartments.set(key, new Compartment());
  }
  return compartments.get(key)!;
};

const configureEditor = (
  key: string,
  extension: Extension,
  view: EditorView
) => {
  const compartment = getCompartment(key);
  if (compartment.get(view.state)) {
    view.dispatch({ effects: compartment.reconfigure(extension) });
  } else {
    view.dispatch({
      effects: StateEffect.appendConfig.of(compartment.of(extension)),
    });
  }
};

const changeLang = (lang: string) => {
  const serverUri = `ws://localhost:4212/ws/${lang}`;
  const ls = languageServer({
    serverUri,
    workspaceFolders: [],
    rootUri: "file:///",
    documentUri: `file:///example`,
    languageId: lang,
  });
  configureEditor("ls", ls, view); // 配置 LSP

  const languageDescription = LanguageDescription.matchLanguageName(
    languages,
    lang,
    true
  );
  languageDescription!.load().then((support) => {
    configureEditor("language", support, view); // 配置语言高亮
  });
};

const changeFontSize = (fontsize: string) => {
  const styleExtension = EditorView.theme({
    "&": { fontSize: fontsize },
    // ".cm-gutter,.cm-content": { minHeight: "600px" },
    ".cm-scroller": { overflow: "auto" },
  });
  configureEditor("fontSize", styleExtension, view);
};

const showBaseInfo: Extension = EditorView.updateListener.of((e) => {
  const ranges = e.state.selection.ranges;
  state.selected = ranges.reduce(
    (plus, range) => plus + range.to - range.from,
    0
  );
  state.cursor = ranges[0].anchor;
  state.length = e.state.doc.length;
  state.lines = e.state.doc.lines;
});

const baseExtensions = [
  basicSetup,
  oneDark,
  keymap.of([
    { key: "Tab", run: insertTab },
    { key: "Shift-Tab", run: indentLess },
  ]),
  showBaseInfo,
  EditorView.lineWrapping,
]; //TODO: 编辑器的state样式依然不太对，当屏幕缩小会导致信息丢失

const editorRef = ref<HTMLDivElement | null>(null);
const state = reactive({
  lines: null as null | number,
  cursor: null as null | number,
  selected: null as null | number,
  length: null as null | number,
});

let view: EditorView;

const selectedLang = ref(editorLanguage.value);
const selectedFontSize = ref("20");
const selectedTabSize = ref(2);

const onEditorReady = (payload) => {
  view = payload.view;
  changeLang(selectedLang.value);
  changeFontSize(`${selectedFontSize.value}px`);
};

const updateLanguage = () => {
  submit.value.Lang = editorLanguage.language;
  changeLang(editorLanguage.value);
};
</script>
<style></style>
