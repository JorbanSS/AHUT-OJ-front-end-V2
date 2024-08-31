<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <PageHeader :Title="problemList.Title" :IconName="Bill" Infomation="">
      <div class="flex justify-center">
        <template v-for="labelItem in problemListLabelOptions">
          <span class="badge badge-neutral whitespace-nowrap mr-1 font-bold"
            v-if="problemList.Title.split(' - ').length > 1 && problemList.Title.split(' - ')[0] == labelItem.value">
            {{ labelItem.value }}
          </span>
        </template>
        <span class="badge text-white whitespace-nowrap mr-1 font-bold" v-if="problemList.Title.endsWith('(By Clone)')"
          style="background-color: #4398DA;">Cloned</span>
      </div>
      <div class="flex justify-center">
        <span class="text-sm font-bold text-gray-600">创建于：{{ ConvertTools.PrintTime(problemList.StartTime, 1) }}</span>
      </div>
    </PageHeader>

    <div>
      <div class="flex space-x-2">
        <ul
          class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold justify-between w-full rounded-b-none">
          <div class="flex flex-col sm:flex-row">
            <li v-for="item in problemListNavItems" :key="item.title">
              <RouterLink :to="item.to" v-if="typeof item.to != 'undefined'"
                :class="{ 'btn-active': route.path.split('/')[3].toLowerCase() == item.to.name.substring(11).toLowerCase() }">
                <component :is="item.icon" theme="outline" size="18" />
                {{ item.title }}
                <div class="badge badge-neutral" v-if="item.title == '记录'">{{ problemList.RecordNumber }}</div>
              </RouterLink>
            </li>
          </div>
          <div class="flex flex-col sm:flex-row" v-if="userDataStore.PermissionMap & constValStore.ProblemListAdminBit">
            <li>
              <a @click="problemList.clone()">
                <bill theme="outline" size="18" />
                克隆
              </a>
            </li>
            <li>
              <a @click="$router.push({
                name: 'EditProblemList',
                params: {
                  LID: problemList.LID,
                },
              })">
                <editor theme="outline" size="18" />
                题单编辑
              </a>
            </li>
          </div>
        </ul>
      </div>
      <RouterView :problemList="problemList" :problems="problems">
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="problemList">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Bill, Editor } from "@icon-park/vue-next";
import { push } from 'notivue';

import { _cloneProblemList, _getProblemList, _getProblemListUserInfo, _joinProblemList } from '@/apis/problemList';
import { _getRecords } from '@/apis/record';
import { problemListLabelOptions, problemListNavItems } from "@/config";
import { type ProblemListType } from '@/interfaces/problemList';
import { useConstValStore } from '@/stores/ConstVal';
import { useUserDataStore } from '@/stores/UserData';
import { ConvertTools } from '@/utils/globalFunctions';
import PageHeader from '@/components/Main/PageHeader.vue';

const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
const route = useRoute();
const router = useRouter();

let problemList = reactive<ProblemListType>({
  LID: 0,
  StartTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  Duration: 0,
  Description: '',
  Problems: '',
  UID: '',
  Type: 0,

  RecordNumber: 0,

  get(showInfo: boolean = false) {
    _getProblemList({}, problemList.LID)
      .then((data: any) => {
        problemList.Title = data.Title;
        problemList.StartTime = data.StartTime;
        problemList.LID = data.LID;
        problemList.Description = data.Description;
        problems.value = data.Data;
        if (showInfo) {
          push.success({
            title: '',
            message: ``,
          })
        }
      })
  },

  getRecordNumber() {
    let params = {
      LID: this.LID,
      Limit: 1,
    }
    _getRecords(params)
      .then((data: any) => {
        this.RecordNumber = data.Count;
      })
  },

  clone() {
    let params = {
      LID: problemList.LID,
      UID: userDataStore.UID,
    };
    _cloneProblemList(params)
      .then((data: any) => {
        let LID = data.LID;
        push.success({
          title: '克隆成功',
          message: `已克隆题单 ${problemList.LID}`,
        })
        router.push({
          name: 'ProblemList',
          params: {
            LID: LID,
          },
        });
      })
  },
})

type problemsType = {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
  Status: string,
};

let problems = ref<Array<problemsType>>([]);

function getProblemListUsersInfo(showInfo: boolean = false) {
  let params = {
    LID: problemList.LID,
  }
  _getProblemListUserInfo(params)
    .then((data: any) => {
      if (data.Msg == 'false') {
        let params = {
          LID: problemList.LID,
          UID: userDataStore.UID,
        };
        _joinProblemList(params)
          .then(() => {
            getProblemListUsersInfo(showInfo);
            push.success({
              title: '加入成功',
              message: '已自动加入题单',
            })
          })
        return;
      }
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: ``,
        })
      }
      for (let i = 0; i < data.SolvedPID.length; i++) {
        if (problems.value && Array.isArray(problems.value)) {
          problems.value.forEach((item: any) => {
            if (item.PID == data.SolvedPID[i]) {
              item.Status = 'AC';
            }
          })
        }
      }
    })
}

onMounted(() => {
  problemList.LID = +route.params.LID;
  problemList.get();
  problemList.getRecordNumber();
  getProblemListUsersInfo();
})

</script>