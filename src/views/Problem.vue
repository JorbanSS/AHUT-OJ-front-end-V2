<template>
  <div class="flex flex-row overflow-x-hidden" style="height: calc(100vh - 70px);" v-auto-animate>
    <div ref="leftPanel" class="bg-base-200 p-6 overflow-y-auto space-y-6" :style="{ width: `${leftWidth}px` }">
      <div class="flex flex-col gap-6 mx-auto" v-if="contest.CID || problemList.LID">
        <div class="flex flex-col space-y-6" v-auto-animate>
          <div class="flex flex-row space-x-6 mx-auto">
            <div class="card shadow-lg Border bg-white p-4 h-fit" v-if="contest.CID || problemList.LID">
              <div class="text-lg space-x-2 space-y-2 hover:text-blue-500 cursor-pointer" @click="$router.push({
                name: contest.CID ? 'Contest' : 'ProblemList',
                params: contest.CID ? { CID: contest.CID } : { LID: problemList.LID }
              })">
                <span>
                  #{{ contest.CID ? contest.CID : problemList.LID }}
                </span>
                <span class="font-bold">
                  {{ contest.Title ? contest.Title : problemList.Title }}
                </span>
              </div>
              <div>
                <progress class="progress w-full"
                  :value="ConvertTools.Percentage(Math.min(contest.Duration, contest.TimeNow - contest.BeginTime), contest.Duration)"
                  max="100" v-if="contest.CID">
                </progress>
              </div>
              <div class="flex gap-2 pt-2 flex-wrap">
                <div class="group/dropdown" v-for="(item, index) in problems" :key="item.PID">
                  <button tabindex="0" role="button" class="btn w-40 justify-start flex-nowrap group-hover/dropdown"
                    :class="{ 'btn-active': item.PID == problem.PID }" @click="$router.replace({
                      name: 'Problem',
                      params: {
                        PID: item.PID,
                        BindID: contest.CID ? 'C' + contest.CID : 'L' + problemList.LID,
                      },
                    })">
                    <span>
                      {{ ConvertTools.Number2Alpha(index + 1) }}
                    </span>
                    <span class="truncate font-medium">
                      {{ item.Title }}
                    </span>
                    <div class="ml-auto">
                      <check theme="outline" size="16" fill="#00A96F" :stroke-width="8" v-if="item.Status == 'AC'" />
                      <loading-one theme="outline" size="16" fill="#EBC656" :stroke-width="8"
                        v-else-if="['JUDGING', 'REJUDGING', 'PENDING', 'FAILED'].includes(item.Status)" />
                      <close theme="outline" size="16" fill="#FA0409" :stroke-width="8"
                        v-else-if="item.Status != '' && item.Status != undefined" />
                    </div>
                  </button>
                  <div tabindex="0"
                    class="z-[1] card card-compact w-64 shadow bg-white Border group-hover/dropdown:block hidden absolute mt-3 right-1 backdrop-blur-md bg-opacity-60">
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
                <button class="btn" :disabled="!userDataStore.isLogin" @click="refreshProblemStatus()">
                  <refresh theme="outline" size="16" />
                  刷新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card shadow-lg bg-white Border p-4 h-fit flex space-y-2">
        <div class="flex justify-between">
          <div class="text-lg space-x-2">
            <span>
              {{ problem.PID }}
            </span>
            <span class="font-bold">
              {{ problem.Title }}
            </span>
          </div>
        </div>
        <div class="flex flex-row gap-2 [&_div]:gap-1 flex-wrap" v-auto-animate>
          <div class="flex badge badge-neutral badge-lg rounded-lg h-8 whitespace-nowrap">
            <stopwatch-start theme="outline" size="17" />
            <span>{{ problem.LimitTime }} ms</span>
          </div>
          <div class="flex badge badge-neutral badge-lg rounded-lg h-8 whitespace-nowrap">
            <disk theme="outline" size="16" />
            <span>{{ problem.LimitMemory }} MB</span>
          </div>
          <div class="flex badge badge-neutral badge-lg rounded-lg h-8 whitespace-nowrap cursor-pointer"
            @click="showLabels = !showLabels" v-if="problem.Label">
            <tag-one theme="outline" size="17" />
            <span class="select-none">题目标签</span>
            <left theme="outline" size="18" v-if="showLabels" />
            <right theme="outline" size="18" v-else />
          </div>
          <template v-if="showLabels">
            <span class="badge badge-neutral badge-md rounded-lg h-8 whitespace-nowrap"
              v-for="(label, index) in problem.Label.split(/;| /)" :key="index" v-if="problem.Label != ''">
              {{ label }}
            </span>
          </template>
        </div>
      </div>
      <div class="space-y-6 w-full" v-auto-animate>
        <div class="flex justify-between space-x-6">
          <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit">
            <li>
              <a @click="$router.replace({ name: 'ProblemDescription' })"
                :class="{ 'btn-active': route.name == 'ProblemDescription' }">
                <word theme="outline" size="18" />
                题面
              </a>
            </li>
            <li>
              <a @click="$router.replace({ name: 'ProblemRecords' })"
                :class="{ 'btn-active': route.name == 'ProblemRecords' }">
                <history theme="outline" size="18" />
                记录
                <div class="badge badge-neutral badge-md">{{ problem.RecordNumber }}</div>
              </a>
            </li>
            <li>
              <a @click="$router.replace({ name: 'ProblemDiscussions' })"
                :class="{ 'btn-active': route.name == 'ProblemDiscussions' }">
                <topic theme="outline" size="18" />
                讨论
                <div class="badge badge-neutral badge-md">{{ problem.SolutionNumber }}</div>
              </a>
            </li>
          </ul>
          <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit"
            v-if="userDataStore.PermissionMap & constValStore.ContestAdminBit">
            <li>
              <a @click="$router.push({
                name: 'ProblemData',
                params: {
                  PID: problem.PID,
                },
              })" class="whitespace-nowrap">
                <ICONdata theme="outline" size="18" />
                数据编辑
              </a>
            </li>
            <li>
              <a @click="$router.push({
                name: 'EditProblem',
                params: {
                  PID: problem.PID,
                },
              })" class="whitespace-nowrap">
                <editor theme="outline" size="18" />
                题目编辑
              </a>
            </li>
          </ul>
        </div>
        <RouterView :problem="problem"></RouterView>
      </div>
    </div>
    <div class="bg-base-200 hover:bg-gray-300 duration-300 w-2 flex items-center justify-center cursor-col-resize"
      @mousedown="startDragging">
      <div class="">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 3v.01M12 12v.01M12 21v.01" />
        </svg>
      </div>
    </div>
    <div class="flex bg-gray-200 overflow-hidden w-full" :style="{ width: `${rightWidth}px` }">
      <component :is="MonocoEditor" :problem="problem" :CID="contest.CID" :LID="problemList.LID" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Problem">
import { onMounted, reactive, ref, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Check, Disk, Editor, History, Data as ICONdata, StopwatchStart, Topic, Word, TagOne, Left, Right, Close, LoadingOne, Refresh } from '@icon-park/vue-next';
import { push } from 'notivue';
import MonocoEditor from '@/components/Main/Editor.vue';

import { _getProblemListUserInfo } from '@/apis/problemList';
import { _getContest } from '@/apis/contest';
import { _getProblem, _submitCode } from '@/apis/problem';
import { _getProblemList } from '@/apis/problemList';
import { _getRecords } from '@/apis/record';
import { submitLanguageOptions } from '@/config';
import { type ContestType } from '@/interfaces/contest';
import { type ProblemType } from '@/interfaces/problem';
import { ProblemListType } from '@/interfaces/problemList';
import { type SubmitCodeType } from '@/interfaces/record';
import { useConstValStore } from '@/stores/ConstVal';
import { useUserDataStore } from '@/stores/UserData';
import { ConvertTools, getServerTime } from '@/utils/globalFunctions';

const userDataStore = useUserDataStore();
const constValStore = useConstValStore();
const router = useRouter();
const route = useRoute();

let showLabels = ref(false);

interface problemType {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
  Status: string,
}

let problems = reactive<Array<problemType>>([]);

const clientWidth = ref(document.documentElement.clientWidth || document.body.clientWidth);
const leftWidth = ref(document.documentElement.clientWidth / 2);
const rightWidth = ref(document.documentElement.clientWidth / 2);

let isDragging = false;

const startDragging = () => {
  isDragging = true;
};

const stopDragging = () => {
  isDragging = false;
};

let intervalId: any = null;

const onMouseMove = (event: { clientX: number; }) => {
  if (!isDragging) return;
  const newWidth = event.clientX;
  leftWidth.value = Math.min(Math.max(newWidth, 382));
  rightWidth.value = clientWidth.value - leftWidth.value;
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', stopDragging);
  intervalId = setInterval(() => {
    let newVal = document.documentElement.clientWidth;
    if (newVal != clientWidth.value) {
      leftWidth.value = Math.floor(leftWidth.value * newVal / clientWidth.value);
      rightWidth.value = newVal - leftWidth.value;
      clientWidth.value = newVal;
    }
  }, 300);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopDragging);
  clearInterval(intervalId);
});

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

  get(showInfo: boolean = true) {
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
        if (showInfo) {
          push.success({
            title: '同步成功',
            message: `已同步竞赛 #${this.CID}`,
          })
        }
      })
  },

  goToProblem(PID: string) {
    router.replace(`/problem/${PID}/C${this.CID}`);
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

  RecordNumber: 0,

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

  getRecordNumber() {
    let params = {
      PID: this.PID,
      Limit: 1,
    }
    _getRecords(params)
      .then((data: any) => {
        this.RecordNumber = data.Count;
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
        router.push({
          name: 'Record',
          params: {
            SID: data.SID,
          },
        });
      })
  },

  convertToMarkdown(): string {
    let res = "";
    if (problem.Description) {
      res += "## 题目描述\n\n" + problem.Description;
    }
    if (problem.Input) {
      res += "\n\n## 输入格式\n\n" + problem.Input;
    }
    if (problem.Output) {
      res += "\n\n## 输出格式\n\n" + problem.Output;
    }
    if (problem.SampleInput) {
      res += "\n\n## 样例输入\n\n```\n\n" + problem.SampleInput + "\n\n```";
    }
    if (problem.SampleOutput) {
      res += "\n\n## 样例输出\n\n```\n\n" + problem.SampleOutput + "\n\n```";
    }
    return res;
  }
})

function syncUrl() {
  problem.PID = route.params.PID as string;
  if (route.params.BindID) {
    let bindID = route.params.BindID as string;
    if (bindID.startsWith("C")) {
      contest.CID = +bindID.substring(1);
      contest.get();
      getServerTime()
        .then((res: any) => {
          contest.TimeNow = res;
        })
    } else if (bindID.startsWith("L")) {
      problemList.LID = +bindID.substring(1);
      problemList.get();
    }
  }
}

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
        if (userDataStore.isLogin) {
          this.getProblemListUserInfo();
        }
        push.success({
          title: '同步成功',
          message: `已同步题单 #${this.LID}`,
        })
      })
  },

  getProblemListUserInfo() {
    let params = {
      LID: problemList.LID,
      UID: userDataStore.UID,
    };
    _getProblemListUserInfo(params)
      .then((data: any) => {
        data.SolvedPID.forEach((PID: string) => {
          problems.forEach((item, index) => {
            if (item.PID == PID) {
              problems[index].Status = 'AC';
            }
          });
        })
      })
  }
})

function refreshProblemStatus() {
  if (contest.CID && contest.CID != undefined) contest.get(false);
  if (problemList.LID && problemList.LID != undefined) problemList.getProblemListUserInfo();
  push.success({
    title: '已刷新题目状态',
  })
}

onMounted(() => {
  syncUrl();
  problem.get();
  problem.getRecordNumber();
  if (problemList.LID && userDataStore.isLogin) problemList.getProblemListUserInfo();
})

watch(() => route.params.PID, () => {
  problem.PID = route.params.PID as string;
  problem.get();
  problem.getRecordNumber();
  if (contest.CID && contest.CID != undefined) contest.get();
  if (problemList.LID && problemList.CID != undefined && userDataStore.isLogin) problemList.getProblemListUserInfo();
})

</script>