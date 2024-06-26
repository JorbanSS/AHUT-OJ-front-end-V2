<template>
  <div class="card shadow-lg bg-white Border w-full"
    v-if="props.problem.ContentType == constValStore.PROBLEM_CONTENTTYPE_PDF">
    <button class="btn w-fit ml-4 my-4" @click="downloadPdf()">
      <file-pdf theme="outline" size="18" />
      下载 PDF
    </button>
  </div>
  <div class="card shadow-lg bg-white Border h-fit w-full" v-else>
    <div class="flex space-x-3 ml-4 mt-4 w-full">
      <button class="btn w-fit" @click="copyMarkdown()">
        <copy theme="outline" size="18" />
        复制 MarkDown
      </button>
      <a v-if="props.problem.Origin != -1 && (props.contest.CID == 0 || props.contest.CID != 0 && props.contest.EndTime < props.contest.TimeNow)"
        :href="OriginURL" target="_blank">
        <button class="btn w-fit">
          <link-two theme="outline" size="20" />
          跳转原题
        </button>
      </a>
    </div>
    <MdPreview editorId="preview-only" :modelValue="props.problem.content" class="px-1 mb-4 w-full" />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, withDefaults, onMounted, watch, computed } from 'vue';

import { push } from 'notivue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import useClipboard from 'vue-clipboard3';
import { Copy, FilePdf, LinkTwo } from '@icon-park/vue-next';

import { ProblemType } from '@/interfaces/problem';
import { useConstValStore } from '@/stores/ConstVal';
import { ContestType } from '@/interfaces/contest';

const constValStore = useConstValStore();
const { toClipboard } = useClipboard();

interface propsType {
  problem?: ProblemType,
  contest?: ContestType,
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
  }),
  contest: () => ({
    CID: 0,
    BeginTime: 0,
    EndTime: 0,
    IsPublic: 0,
    Size: 0,
    Title: '',
    Duration: 0,
    Description: '',
    Problems: '',
    UID: '',
    Type: 0,
    Pass: '',
    content: '',
    TimeNow: 0,
    Status: 0,
  }),
});

async function copyMarkdown() {
  try {
    await toClipboard(props.problem.content);
    push.success({
      title: '复制成功',
      message: '已复制题面 MarkDown 到剪贴板',
    })
  } catch (e) {
    push.error({
      title: '复制失败',
    })
  }
}

async function downloadPdf() {
  const link = document.createElement('a');
  link.href = '/oss/problem-pdfs/' + props.problem.Description;
  link.setAttribute('download', props.problem.PID + '-' + props.problem.Title + '.pdf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  push.success({
    title: '下载成功',
    message: '已保存题面 PDF',
  })
}

let OriginCID = ref(0);
let OriginPNO = ref('');

watch(() => props.problem.OriginPID, () => {
  if (props.problem.Origin != -1) {
    const digitRegex = /^\d+/;
    let match = props.problem.OriginPID.match(digitRegex);
    if (match) {
      OriginCID.value = parseInt(match[0]);
      OriginPNO.value = props.problem.OriginPID.substring(match[0].length);
    }
  }
});

let OriginURL = computed(() => {
  if (props.problem.Origin == -1) return '';
  if (props.problem.Origin == 1) {
    return 'https://codeforces.com/' + (props.problem.OriginCID > 100000 ? 'gym' : 'contest') + '/' + props.problem.OriginCID + '/problem/' + OriginPNO
  }
  if (props.problem.Origin == 2) {
    return 'https://atcoder.jp/contests/' + props.problem.OriginPID.split('_')[0] + '/tasks/' + props.problem.OriginPID;
  }
})

</script>