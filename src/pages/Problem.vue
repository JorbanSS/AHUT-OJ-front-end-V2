<template>
  <div class="flex space-x-6">
    <div class="space-y-6">
      <div class="card shadow-lg Border bg-white p-6 space-y-2" v-if="contest.CID">
        <div class="text-lg space-x-2">
          <span>
            #{{ contest.CID }}
          </span>
          <span class="font-bold ">
            {{ contest.Title }}
          </span>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <div class="group/dropdown" v-for="(item, index) in problems" :key="item.PID">
            <button tabindex="0" role="button" class="btn w-full group-hover/dropdown"
              :class="(item.PID == problem.PID ? 'btn-active' : '')" @click="goToProblem(item.PID)">
              {{ ConvertTools.Number2Alpha(index + 1) }}
            </button>
            <div tabindex="0"
              class="z-[1] card card-compact w-64 p-2 shadow bg-base-200 Border group-hover/dropdown:block hidden absolute mt-2">
              <div class="card-body">
                <h3 class="card-title">
                  <div class="text-lg space-x-2 font-normal">
                    <span>
                      {{ item.PID }}
                    </span>
                    <span class="font-bold">
                      {{ item.Title }}
                    </span>
                  </div>
                </h3>
                <p>
                  AC 率
                  <progress class="progress progress-success w-20 mx-2"
                    :value="ConvertTools.Percentage(item.ACNum, item.SubmitNum)" max="100"></progress>
                  {{ item.ACNum }} / {{ item.SubmitNum }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card shadow-lg bg-white Border p-6 container w-80 h-fit flex space-y-2">
        <div class="text-lg space-x-2">
          <span>
            {{ problem.PID }}
          </span>
          <span class="font-bold">
            {{ problem.Title }}
          </span>
        </div>
        <div class="flex space-x-2">
          <div class="flex badge badge-neutral badge-lg text-sm">
            <stopwatch-start theme="outline" size="16" fill="#fff" />
            &nbsp;{{ problem.limitTime }} ms
          </div>
          <div class="flex badge badge-neutral badge-lg text-sm">
            <disk theme="outline" size="16" fill="#fff" />
            &nbsp;{{ problem.limitMemory }} MB
          </div>
        </div>
        <div class="collapse bg-base-200 collapse-arrow rounded-lg">
          <input type="checkbox" />
          <div class="collapse-title text-md font-bold">
            题目标签
          </div>
          <div class="collapse-content">
            <span class="badge badge-neutral badge-md " v-for="(label, index) in problem.Label.split(/;| /)"
              :key="index" v-if="problem.Label != ''">
              {{ label }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button class="btn" @click="router.push('/admin/problem/edit/' + problem.PID)">
            <editor theme="outline" size="18"/>
            <div class="text-base">
              题目编辑
            </div>
          </button>
          <button class="btn" @click="router.push('/admin/problem/data/' + problem.PID)">
            <ICONdata theme="outline" size="18"/>
            <div class="text-base">
              数据编辑
            </div>
          </button>
        </div>
        <button class="btn btn-info">
          <tips theme="outline" size="20" />
          <div class="text-base">
            题 解
          </div>
          <div class="badge" v-if="problem.SolutionNumber">{{ problem.SolutionNumber }}</div>
        </button>
        <button class="btn btn-success" onclick="codeModal.showModal()">
          <check theme="outline" size="20" />
          <div class="text-base">
            提 交
          </div>
        </button>
      </div>
      <div class="card shadow-lg bg-white Border p-6">
        <div class="font-bold text-lg pb-2">
          大纲
        </div>
        <MdCatalog :editorId="id" :scrollElement="scrollElement" class="text-sm" />
      </div>
    </div>
    <div class="card shadow-lg bg-white Border container h-fit">
      <div class="flex space-x-2 p-6">
        <button class="btn w-fit" @click="copyMarkdown()">
          <copy theme="outline" size="18" />
          复制 MarkDown
        </button>
        <button class="btn w-fit" @click="downloadPdf()">
          <file-pdf theme="outline" size="18" />
          下载 PDF
        </button>
      </div>
      <MdPreview :editorId="id" :modelValue="problem.description" class="p-1 mb-4"/>
    </div>
  </div>
  <dialog id="codeModal" class="modal">
    <div class="modal-box h-[600px]">
      <h3 class="font-bold text-lg pb-6">{{ problem.PID }} {{ problem.Title }}</h3>
      <select class="select select-bordered w-72 max-w-xs text-base" v-model="submit.Lang">
        <option disabled selecte value="0">代码语言</option>
        <option value="1">C (gcc 12.2.0)</option>
        <!-- <option value="2"></option> -->
        <!-- <option value="3">C++11 (g++ 12.2.0)</option> -->
        <option value="4">C++17 (g++ 12.2.0)</option>
        <option value="5">Java (OpenJDK 17.0.10 64bit)</option>
        <option value="6">Python3 (3.10.13)</option>
        <!-- <option value="2">AtCoder</option>
        <option value="3">Virtual Judge</option> -->
      </select>
      <textarea class="textarea textarea-bordered w-full h-[340px] mt-4" placeholder=""
        v-model="submit.Source"></textarea>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">暂存并退出</button>
          <button class="btn" @click="submitCode()">提交代码</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="Problem">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ProblemType, type ContestType, type SubmitCodeType } from '@/type.ts';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/assets/ts/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { Check, Tips, Disk, StopwatchStart, Copy, FilePdf, Editor, Data as ICONdata } from '@icon-park/vue-next'
import { MdPreview, MdCatalog } from 'md-editor-v3';
import useClipboard from 'vue-clipboard3'
import { useUserDataStore } from '@/store/UserData';

import 'md-editor-v3/lib/preview.css';

const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();
const id = 'preview-only';
const scrollElement = document.documentElement;
const { toClipboard } = useClipboard();

let submit = ref<SubmitCodeType>({
  Lang: 0,
  Source: '',
});

let contest = reactive<ContestType>({
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  duration: 0,
  description: '',
  problems: '',
  UID: '',
  Type: 0,
  Pass: '',
})

let problem = reactive<ProblemType>({
  PID: '',
  Title: '',
  Label: '',
  Visible: 0,
  Submit: 0,
  Accepted: 0,
  description: '',
  Origin: 0,
  OriginPID: '',
  limitMemory: 0,
  limitTime: 0,
  SolutionNumber: 0,
  ContentType: 1,
  Input: '',
  Output: '',
  SampleInput: '',
  SampleOutput: '',
  Hit: '',
})

type problems = {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
}

let problems = reactive<Array<problems>>([])

function getProblem() {
  Get('api/problem/' + problem.PID, {
    // Pass='',
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        problem.Accepted = data.Accepted;
        problem.ContestType = data.ContestType;
        problem.description = data.Description;
        problem.Title = data.Title;
        problem.Label = data.Label;
        problem.limitMemory = data.LimitMemory;
        problem.limitTime = data.LimitTime;
        problem.ContentType = data.ContentType;
        problem.SolutionNumber = data.SolutionNumber;
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function init() {
  syncUrl();
  getProblem();
}

function syncUrl() {
  if (typeof route.params.PID == 'string') {
    problem.PID = route.params.PID;
  }
  if (route.params.CID != undefined && typeof route.params.CID == 'string') {
    contest.CID = +route.params.CID;
    getContest();
  }
}

async function copyMarkdown() {
  try {
    await toClipboard(problem.description);
    push.success({
      title: '复制成功',
      message: '已复制题面 MarkDown 到剪贴板',
    })
  } catch (e) {
    push.error({
      title: '复制失败',
      // message: '',
    })
  }
}

async function downloadPdf() {
  try {
    await toClipboard(problem.description);
    push.success({
      title: '下载成功',
      message: '已保存题面 PDF',
    })
  } catch (e) {
    push.error({
      title: '下载失败',
      // message: '',
    })
  }
}

function submitCode() {
  Post('api/submit/commit/', {
    PID: problem.PID,
    UID: userDataStore.UID,
    CID: contest.CID ? contest.CID : -1,
    Source: submit.value.Source,
    Lang: +submit.value.Lang,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '提交成功',
          message: '已提交代码',
        })
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
}

function getContest() {
  if (contest.CID == 0) return;
  Get('api/contest/' + contest.CID, {
    // Pass='',
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        contest.Title = data.Title;
        contest.BeginTime = data.BeginTime;
        contest.EndTime = data.EndTime;
        contest.duration = ConvertTools.TimeInterval(contest.BeginTime, contest.EndTime);
        contest.CID = data.CID;
        contest.IsPublic = data.IsPublic;
        problems = data.Data;
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .then(() => {
      push.success({
        title: '同步成功',
        message: `已同步竞赛 #${contest.CID}`,
      })
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function goToProblem(PID: string) {
  router.push(`/problem/${PID}/${contest.CID}`);
  problem.PID = PID;
  getProblem();
}

onMounted(() => {
  init();
})

</script>

<style scoped></style>