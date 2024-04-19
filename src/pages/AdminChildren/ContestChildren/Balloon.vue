<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/contest')">
          <trophy theme="outline" size="18" />
          比赛列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/contest/add')">
          <add theme="outline" size="18" />
          新增比赛
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/contest/edit/' + contest.CID)">
          <edit-one theme="outline" size="18" />
          编辑比赛
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <party-balloon theme="outline" size="18" />
          编辑气球颜色
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="submit()">
          <edit-one theme="outline" size="18" />
          提交编辑
        </div>
      </li>
    </ul>
  </div>
  <div class="card bg-white shadow-lg Border max-w-5xl mx-auto pb-4">
    <div class="px-6 pt-6 text-lg font-bold">{{ contest.Title }}</div>
    <div class="mb-4"></div>
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th>序号</th>
          <th>题号</th>
          <th>题目名称</th>
          <th>气球颜色</th>
        </tr>
      </thead>
      <tbody class="sort-target">
        <tr v-for="(item, index) in contest.Problems" :key="item.PID">
          <th class="w-32">
            {{ ConvertTools.Number2Alpha(index + 1) }}
          </th>
          <th class="w-48">
            {{ item.PID }}
          </th>
          <td class="w-96">
            {{ item.Title }}
          </td>
          <td class="w-96">
            <input type="color" v-model="item.BalloonColor" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="EditBalloon">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Add, EditOne, PartyBalloon, Trophy } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _editBalloonColor, _getContest } from "@/api/contest";
import { useUserDataStore } from '@/stores/UserData';
import { ConvertTools } from '@/utils/globalFunctions';

const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();

interface ProblemsWithBalloonType {
  PID: string,
  Title: string,
  BalloonColor: string,

  [item: string]: any,
};

let contest = reactive({
  Problems: new Array<ProblemsWithBalloonType>,
  CID: 0,
  Title: '',

  get() {
    _getContest({}, contest.CID)
      .then((data: any) => {
        contest.Title = data.Title;
        contest.CID = data.CID;
        contest.Problems = data.Data;
      })
  },

  edit(PID: string, color: string) {
    let params = {
      CID: contest.CID,
      PID: PID,
      Color: color,
    };
    _editBalloonColor(params);
  }
})

function submit() {
  contest.Problems.forEach((item) => {
    contest.edit(item.PID, item.BalloonColor);
  })
  push.success({
    title: '编辑成功',
  });
}

onMounted(() => {
  contest.CID = +route.params.CID;
  contest.get();
})

</script>