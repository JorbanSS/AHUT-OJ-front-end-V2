<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <bill theme="outline" size="18" />
          题单列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problemlist/add')">
          <add theme="outline" size="18" />
          新增题单
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="goToEditProblemList()">
          <edit-one theme="outline" size="18" />
          编辑题单
        </div>
      </li>
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="deleteProblemList()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除题单
        </div>
      </li>
    </ul>
  </div>
  <div class="card bg-white shadow-lg Border mx-auto max-w-5xl">
    <div class="text-2xl p-6">
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item" placeholder="Search" />
          </div>
        </div>
        <select class="select select-bordered join-item">
          <option disabled selected>Filter</option>
          <option>Local</option>
          <option>CodeForces</option>
          <option>AtCoder</option>
        </select>
        <button class="btn join-item btn-neutral">搜索</button>
      </div>
    </div>
  </div>
  <div class="m-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th>题单号</th>
          <th>题单名称</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in problemLists.problemLists" :key="item.PID" @click="switchSelectedStatus(index)"
          class="cursor-pointer">
          <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td>
          <th>{{ item.LID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.Title }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mx-auto py-4 flex space-x-4">
      <div class="join">
        <button class="join-item btn" @click="changePageTo(1)">
          <double-left theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePage(-1)">
          <left theme="outline" size="20" />
        </button>
        <button class="join-item btn">
          {{ problemLists.page }} / {{ Math.floor(problemLists.count / problemLists.limit + 1) }}
        </button>
        <button class="join-item btn" @click="changePage(1)">
          <right theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePageTo(Math.floor(problemLists.count / problemLists.limit + 1))">
          <double-right theme="outline" size="20" />
        </button>
      </div>
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item w-20" placeholder="" v-model="toPage" type="number" min="1"
              :max="Math.floor(problemLists.count / problemLists.limit + 1)" />
          </div>
        </div>
        <button class="btn join-item" @click="toPage ? changePageTo(toPage) : 0">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ProblemListsList">
import { DeleteOne, EditOne, Left, Right, DoubleLeft, DoubleRight, Add, Bill } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { type ProblemListsType, type ProblemListSimplifiedType } from '@/type';

const router = useRouter();

let toPage = ref<number>();
let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  problemLists.problemLists[index].Selected = !problemLists.problemLists[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  }
  else {
    allSelected.value = status;
  }
  for (let i = 0; i < problemLists.problemLists.length; i++) {
    problemLists.problemLists[i].Selected = allSelected.value;
  }
}

function getSelectedList() {
  let list: Array<number> = [];
  for (let i = 0; i < problemLists.problemLists.length; i++) {
    if (problemLists.problemLists[i].Selected == true) {
      list.push(problemLists.problemLists[i].LID);
    }
  }
  return list;
}

function deleteProblemList() {
  let list = getSelectedList();
  if (list.length == 0) {
    push.warning({
      title: '操作不合法',
      message: '尚未选择任何题目，无法删除',
    })
    return;
  }
  Post('api/training/delete/', {
    LIDs: list,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        getProblemLists();
        switchAllSelectedStatus(false);
        push.success({
          title: '删除成功',
          message: `一共删除了 ${list.length} 个比赛`,
        });
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
};

interface ProblemListsListType extends ProblemListSimplifiedType {
  Selected: boolean,
};

let problemLists = reactive<ProblemListsType>({
  problemLists: new Array<ProblemListsListType>,
  count: 0,
  page: 1,
  limit: 20,
  UID: '',
  searchInfo: {},
  init() {
    problemLists.count = 0;
    problemLists.page = 1;
    problemLists.limit = 20;
    problemLists.searchInfo = {
      CID: undefined,
      Title: undefined,
      Source: undefined,
      Label: undefined,
    }
  }
})


function getProblemLists(showInfo: boolean = false) {
  Get('api/training/list', {
    Page: problemLists.page - 1,
    Limit: problemLists.limit,
    PType: '',
    Label: problemLists.searchInfo.Label,
  })
    .then((res: any) => {
      let data = res.data;

      if (data.Code == 0) {
        problemLists.count = data.Size;
        problemLists.problemLists = data.Data;
        for (let index = 0; index < problemLists.problemLists.length; index++) {
          problemLists.problemLists[index].Selected = false;
        }
        push.success({
          title: '获取成功',
          message: `一共获取了 ${problemLists.count} 个题单`,
        })
      }
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${problemLists.count} 道题目`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(problemLists.count / problemLists.limit) + 1) problemLists.page = page;
  // syncUrl();
}

function changePage(page: number) {
  if (problemLists.page + page >= 1 && problemLists.page + page <= Math.floor(problemLists.count / problemLists.limit) + 1) problemLists.page += page;
  // syncUrl();
}

function goToEditProblemList() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '请选择且仅选择一道比赛进行编辑',
    })
    return;
  }
  let LID = list[0];
  router.push('/admin/problemlist/edit/' + LID);
}

onMounted(() => {
  getProblemLists();
})

watch(() => problemLists.page, () => {
  getProblemLists();
  allSelected.value = false;
})


</script>

<style scoped></style>