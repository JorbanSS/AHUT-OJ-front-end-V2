<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
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
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="goToEditContest()">
          <edit-one theme="outline" size="18" />
          编辑比赛
        </div>
      </li>
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="contests.delete()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除比赛
        </div>
      </li>
    </ul>
  </div>
  <div class="m-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th>比赛号</th>
          <th>比赛名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in contests.contests" :key="item.PID" @click="switchSelectedStatus(index)"
          class="cursor-pointer">
          <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td>
          <th>{{ item.CID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.Title }}</div>
          </td>
          <td>
            <button class="btn btn-sm btn-neutral" @click.stop="router.push('/admin/contest/balloon/' + item.CID)">编辑气球颜色</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="contests.page" :maxPage="maxPage" :changePage="contests.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="ContestsList">
import { DeleteOne, EditOne, Add, Trophy } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';

import Pagination from "@/components/Main/Pagination.vue";
import { type ContestsType, type ContestSimplifiedType } from '@/type/contest';
import { _getContests, _deleteContests } from '@/api/contest';

const router = useRouter();

let toPage = ref<number>();
let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  contests.contests[index].Selected = !contests.contests[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  }
  else {
    allSelected.value = status;
  }
  for (let i = 0; i < contests.contests.length; i++) {
    contests.contests[i].Selected = allSelected.value;
  }
}

function getSelectedList() {
  let list: Array<number> = [];
  for (let i = 0; i < contests.contests.length; i++) {
    if (contests.contests[i].Selected == true) {
      list.push(contests.contests[i].CID);
    }
  }
  return list;
}


interface ContestListType extends ContestSimplifiedType {
  Selected: boolean,
};

let contests = reactive<ContestsType>({
  contests: new Array<ContestListType>,
  count: 0,
  page: 1,
  limit: 20,
  UID: '',
  searchInfo: {},

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) contests.page = page;
  },

  get(showInfo = false) {
    let params = {
      Page: contests.page - 1,
      Limit: contests.limit,
    };
    _getContests(params)
      .then((data: any) => {
        contests.count = data.Size;
        contests.contests = data.Data;
        if (showInfo == true) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${contests.count} 场比赛`,
          })
        }
      })
  },

  delete() {
    let list = getSelectedList();
    if (list.length == 0) {
      push.warning({
        title: '操作不合法',
        message: '尚未选择任何题目，无法删除',
      })
      return;
    }
    let params = {
      CIDs: list,
    };
    _deleteContests(params)
      .then(() => {
        contests.get();
        switchAllSelectedStatus(false);
        push.success({
          title: '删除成功',
          message: `一共删除了 ${list.length} 个比赛`,
        });
      })
  }
})

function goToEditContest() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '请选择且仅选择一道比赛进行编辑',
    })
    return;
  }
  let CID = list[0];
  router.push('/admin/contest/edit/' + CID);
}

onMounted(() => {
  contests.get(true);
})

watch(() => contests.page, () => {
  contests.get();
  allSelected.value = false;
})

const maxPage = computed(() => Math.floor(contests.count / contests.limit) + 1);

</script>