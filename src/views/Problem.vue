<template>
  <div class="flex space-x-6" v-auto-animate>
    <div class="space-y-6">
      <div class="card shadow-lg Border bg-white p-6 w-72" v-if="contest.CID || problemList.LID">
        <div class="text-lg space-x-2 space-y-2" v-if="contest.CID">
          <span>
            #{{ contest.CID }}
          </span>
          <span class="font-bold ">
            {{ contest.Title }}
          </span>
        </div>
        <div>
          <progress class="progress w-full"
            :value="ConvertTools.Percentage(Math.min(contest.Duration, contest.TimeNow - contest.BeginTime), contest.Duration)"
            max="100" v-if="contest.CID">
          </progress>
        </div>
        <div class="text-lg space-x-2" v-if="problemList.LID">
          <span>
            #{{ problemList.LID }}
          </span>
          <span class="font-bold ">
            {{ problemList.Title }}
          </span>
        </div>
        <div class="grid grid-cols-5 gap-2 w-60 pt-2">
          <div class="group/dropdown" v-for="(item, index) in problems" :key="item.PID">
            <button tabindex="0" role="button" class="btn w-full group-hover/dropdown"
              :class="(item.PID == problem.PID ? 'btn-active' : '')"
              @click="contest.CID ? contest.goToProblem(item.PID) : problemList.goToProblem(item.PID)">
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
      <div class="card shadow-lg bg-white Border p-6 container w-72 h-fit flex space-y-2">
        <div class="text-lg space-x-2">
          <span>
            {{ problem.PID }}
          </span>
          <span class="font-bold">
            {{ problem.Title }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex badge badge-neutral badge-lg w-full rounded-lg h-8">
            <stopwatch-start theme="outline" size="17" fill="#fff" />
            &nbsp;{{ problem.LimitTime }} ms
          </div>
          <div class="flex badge badge-neutral badge-lg w-full rounded-lg h-8">
            <disk theme="outline" size="16" fill="#fff" />
            &nbsp;{{ problem.LimitMemory }} MB
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
        <div class="grid grid-cols-2 gap-2" v-if="userDataStore.PermissionMap & constValStore.ProblemAdminBit">
          <button class="btn" @click="router.push('/admin/problem/edit/' + problem.PID)">
            <!-- <editor theme="outline" size="18" /> -->
            <div class="text-base">
              题目编辑
            </div>
          </button>
          <button class="btn" @click="router.push('/admin/problem/data/' + problem.PID)">
            <!-- <ICONdata theme="outline" size="18" /> -->
            <div class="text-base">
              数据编辑
            </div>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button class="btn" @click="$router.push(`/records?PID=${problem.PID}`)">
            <ICONdata theme="outline" size="18" />
            <div class="text-base">
              记 录
            </div>
          </button>
          <button class="btn">
            <tips theme="outline" size="20" />
            <div class="text-base">
              题 解
            </div>
            <div class="badge" v-if="problem.SolutionNumber">{{ problem.SolutionNumber }}</div>
          </button>
        </div>
        <button class="btn btn-success" onclick="codeModal.showModal()">
          <check theme="outline" size="20" />
          <div class="text-base">
            提 交
          </div>
        </button>
      </div>
      <div class="card shadow-lg bg-white Border p-6 w-72">
        <div class="font-bold text-lg pb-2">
          大纲
        </div>
        <MdCatalog :editorId="id" :scrollElement="scrollElement" class="text-sm" />
      </div>
    </div>
    <div class="card shadow-lg bg-white Border container h-fit"
      v-if="problem.ContentType == constValStore.PROBLEM_CONTENTTYPE_PDF">
      <button class="btn w-fit ml-6 my-6" @click="downloadPdf()">
        <file-pdf theme="outline" size="18" />
        下载 PDF
      </button>
    </div>
    <div class="card shadow-lg bg-white Border container h-fit" v-else>
      <div class="flex space-x-3 ml-6 mt-6">
        <button class="btn w-fit" @click="copyMarkdown()">
          <copy theme="outline" size="18" />
          复制 MarkDown
        </button>
        <a v-if="problem.Origin == 1 && (contest.CID == 0 || contest.CID != 0 && contest.EndTime < contest.TimeNow)"
          href="" target="_blank">
          <button class="btn w-fit">
            <link-two theme="outline" size="20" />
            跳转原题
          </button>
        </a>
      </div>
      <MdPreview :editorId="id" :modelValue="problem.content" class="px-1 mb-4" />
    </div>
  </div>
  <dialog id="codeModal" class="modal">
    <div class="modal-box max-w-3xl">
      <h3 class="font-bold text-lg pb-6">{{ problem.PID }} {{ problem.Title }}</h3>
      <select class="select select-bordered w-72 max-w-xs text-base" v-model="submit.Lang">
        <option v-for="item in submitLanguageOptions" :value="item.value" :key="item.value">
          {{ item.name }} ({{ item.compiler }})
        </option>
      </select>
      <textarea class="textarea textarea-bordered w-full h-[340px] mt-4" placeholder=""
        v-model="submit.Source"></textarea>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">暂存并退出</button>
          <button class="btn" @click="problem.submitCode != undefined ? problem.submitCode() : 0">提交代码</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="Problem">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Check, Copy, Disk, FilePdf, Data as ICONdata, StopwatchStart, Tips, LinkTwo } from '@icon-park/vue-next';
import { MdCatalog, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { push } from 'notivue';
import useClipboard from 'vue-clipboard3';

import { _getContest } from '@/apis/contest';
import { _getProblem, _submitCode } from '@/apis/problem';
import { _getProblemList } from '@/apis/problemList';
import { submitLanguageOptions } from '@/config';
import { useConstValStore } from '@/stores/ConstVal';
import { useUserDataStore } from '@/stores/UserData';
import { type ContestType } from '@/interfaces/contest';
import { type ProblemType } from '@/interfaces/problem';
import { ProblemListType } from '@/interfaces/problemList';
import { type SubmitCodeType } from '@/interfaces/record';
import { ConvertTools, getServerTime } from '@/utils/globalFunctions';

const { toClipboard } = useClipboard();
const userDataStore = useUserDataStore();
const constValStore = useConstValStore();
const router = useRouter();
const route = useRoute();
const id = 'preview-only';
const scrollElement = document.documentElement;

let submit = ref<SubmitCodeType>({
  Lang: 4,
  Source: '',
});

let contest = reactive<ContestType>({
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

  get() {
    if (this.CID == 0) return;
    _getContest({}, this.CID)
      .then((data: any) => {
        this.Title = data.Title;
        this.BeginTime = data.BeginTime;
        this.EndTime = data.EndTime;
        this.Duration = ConvertTools.TimeInterval(this.BeginTime, this.EndTime);
        this.CID = data.CID;
        this.IsPublic = data.IsPublic;
        problems = data.Data;
        push.success({
          title: '同步成功',
          message: `已同步竞赛 #${this.CID}`,
        })
      })
  },

  goToProblem(PID: string) {
    router.replace(`/problem/${PID}/C${this.CID}`);
    problem.PID = PID;
  },
})

let problemList = reactive<ProblemListType>({
  CID: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  Description: '',
  Problems: '',
  UID: '',
  Type: 0,
  Pass: '',
  content: '',

  get() {
    if (this.LID == 0) return;
    _getProblemList({}, this.LID)
      .then((data: any) => {
        this.Title = data.Title;
        this.BeginTime = data.BeginTime;
        this.EndTime = data.EndTime;
        this.Duration = ConvertTools.TimeInterval(this.BeginTime, this.EndTime);
        this.LID = data.LID;
        this.IsPublic = data.IsPublic;
        problems = data.Data;
        push.success({
          title: '同步成功',
          message: `已同步题单 #${this.LID}`,
        })
      })
  },

  goToProblem(PID: string) {
    router.push(`/problem/${PID}/L${this.LID}`);
    problem.PID = PID;
  },
})

let problem = reactive<ProblemType>({
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

  get() {
    _getProblem({}, problem.PID)
      .then((data: any) => {
        this.Accepted = data.Accepted;
        this.ContestType = data.ContestType;
        this.Description = data.Description;
        this.Title = data.Title;
        this.Label = data.Label;
        this.LimitMemory = data.LimitMemory;
        this.LimitTime = data.LimitTime;
        this.ContentType = data.ContentType;
        this.SolutionNumber = data.SolutionNumber;
        this.SampleInput = data.SampleInput;
        this.SampleOutput = data.SampleOutput;
        this.Input = data.Input;
        this.Output = data.Output;
        this.Hit = data.Hit;
        this.PType = data.PType;
        this.Origin = data.Origin;
        this.OriginPID = data.OriginPID;
        this.content = this.convertToMarkdown();
      })
      .then(() => {
        if (this.ContentType == constValStore.PROBLEM_CONTENTTYPE_PDF) {
          push.info({
            title: '提示',
            message: '题面为 PDF 格式，请点击下载按钮下载',
          })
        }
      })
  },

  submitCode() {
    if (submit.value.Source == "") {
      push.warning({
        title: '提交失败',
        message: '代码不能为空',
      })
      return;
    }
    let params = {
      PID: problem.PID,
      UID: userDataStore.UID,
      CID: contest.CID ? contest.CID : -1,
      LID: problemList.LID ? problemList.LID : -1,
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
        router.push(`/record/${data.SID}`);
      })
  },

  convertToMarkdown(): string {
    let res = "";
    if (problem.Description) {
      res += "## 题目描述\n\n";
      res += problem.Description;
    }
    if (problem.Input) {
      res += "\n\n## 输入格式\n\n";
      res += problem.Input;
    }
    if (problem.Output) {
      res += "\n\n## 输出格式\n\n";
      res += problem.Output;
    }
    if (problem.SampleInput) {
      res += "\n\n## 样例输入\n\n";
      res += "```\n\n" + problem.SampleInput + "\n\n```";
    }
    if (problem.SampleOutput) {
      res += "\n\n## 样例输出\n\n";
      res += "```\n\n" + problem.SampleOutput + "\n\n```";
    }
    return res;
  }
})

type problems = {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
}

let problems = reactive<Array<problems>>([])

async function copyMarkdown() {
  try {
    await toClipboard(problem.content);
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
  link.href = '/oss/problem-pdfs/' + problem.Description;
  console.log(link.href);
  link.setAttribute('download', problem.PID + '-' + problem.Title + '.pdf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  push.success({
    title: '下载成功',
    message: '已保存题面 PDF',
  })
}

function syncUrl() {
  if (typeof route.params.PID == 'string') {
    problem.PID = route.params.PID;
  }
  if (route.params.BindID != undefined && typeof route.params.BindID == 'string') {
    let bindID: string = route.params.BindID;
    if (bindID[0] == "C") {
      contest.CID = +bindID.substring(1);
      contest.get();
      getServerTime()
        .then((res: any) => {
          contest.TimeNow = res;
        })
    } else if (bindID[0] == "L") {
      problemList.LID = +bindID.substring(1);
      problemList.get();
    }
  }
}

onMounted(() => {
  syncUrl();
})

watch(() => problem.PID, () => {
  problem.get();
})

</script>