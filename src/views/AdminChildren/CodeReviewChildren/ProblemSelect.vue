<template>
  <div class="flex flex-col gap-6 pt-6">
    <div class="flex justify-center space-x-2">
      <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
        <li>
          <div class="font-bold text-base btn-active">
            <DocumentFolder theme="outline" size="18" />
            题目列表
          </div>
        </li>
      </ul>
    </div>

    <div class="mx-auto">
      <PageHeader :Title="contest.Title" :IconName="Trophy" Infomation="">
        <div class="flex flex-col gap-3">
          <div class="flex flex-row gap-2 justify-center text-sm font-bold text-gray-600">
            <div class="[&_span]:badge [&_span]:mr-1 [&_span]:font-bold [&_span]:text-white">
              <span :style="contest.Type == 1 ? 'background-color: #8F43AC;' : 'background-color: #E37E27;'">
                {{ contest.Type == 1 ? 'ICPC' : 'OI' }}
              </span>
              <span :style="contest.IsPublic == 1 ? 'background-color: #21700E;' : 'background-color: #E44D3D;'">
                {{ contest.IsPublic == 1 ? '公开' : '加密' }}
              </span>
            </div>
          </div>
        </div>
      </PageHeader>
    </div>

    <div class="card bg-white shadow-lg Border max-w-5xl mx-auto overflow-hidden">
      <table class="table table-zebra text-center">
        <thead>
          <tr>
            <th>序号</th>
            <th>题号</th>
            <th>题目名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="sort-target">
          <tr v-for="(item, index) in list" :key="item.PID" class="cursor-pointer" v-auto-animate>
            <th class="w-32">
              {{ ConvertTools.Number2Alpha(index + 1) }}
            </th>
            <th class="w-48">
              {{ item.PID }}
            </th>
            <td class="w-96">
              {{ item.Title }}
            </td>
            <td class="w-32">
              <button class="btn btn-sm btn-neutral" @click.stop="$router.push({
                name: 'AdminCodeReviewRecordList',
                params: {
                  CID: route.params.CID,
                  PID: item.PID,
                }
              })">
                <Audit theme="outline" size="18" class="-mx-0.5" />
                审阅
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup name="addcontest">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { EditOne, Trophy, GoOn, Audit, History, DocumentFolder } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _editContest, _getContest } from "@/apis/contest";
import { _getProblem } from "@/apis/problem";
import { useUserDataStore } from '@/stores/UserData';
import { type ContestType } from '@/interfaces/contest';
import { ConvertTools } from '@/utils/globalFunctions';
import PageHeader from '@/components/Main/PageHeader.vue';

const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();

let beginTime = ref<string>();
let endTime = ref<string>();

interface ProblemType {
  PID: string,
  Title: string,
  [item: string]: any,
};

let list = ref<Array<ProblemType>>([]);

let contest = reactive<ContestType>({
  Problems: '',
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 1,
  Size: 0,
  Title: '',
  Duration: 0,
  Description: '',
  contests: '',
  UID: '',
  Type: 1,
  Pass: '',
  Status: 0,

  get() {
    _getContest({}, contest.CID)
      .then((data: any) => {
        contest.BeginTime = data.BeginTime;
        contest.EndTime = data.EndTime;
        contest.IsPublic = data.IsPublic;
        contest.Title = data.Title;
        contest.Description = data.Description;
        contest.CID = data.CID;
        contest.UID = data.UID;
        contest.Type = data.Type;
        contest.Pass = data.Pass;

        beginTime.value = new Date(data.BeginTime + 8 * 60 * 60 * 1000).toISOString().substring(0, 16);
        endTime.value = new Date(data.EndTime + 8 * 60 * 60 * 1000).toISOString().substring(0, 16);

        for (let i = 0; i < data.Data.length; i++) {
          list.value.push({
            PID: data.Data[i].PID,
            Title: data.Data[i].Title,
          });
        }
      })
  },
})

onMounted(() => {
  contest.CID = +route.params.CID;
  contest.get();
})

</script>