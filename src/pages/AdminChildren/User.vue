<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <peoples theme="outline" size="18" />
          管理员列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="">
          <add theme="outline" size="18" />
          新增用户
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="editUser()">
          <edit-one theme="outline" size="18" />
          编辑用户
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="editPermission()">
          <permissions theme="outline" size="18" />
          编辑权限
        </div>
      </li>
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="deleteUsers()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除用户
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="">
          <afferent-three theme="outline" size="18" />
          导入
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
          <th>用户 ID</th>
          <th>用户名称</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in users.users" :key="item.UID" @click="switchSelectedStatus(index)"
          class="cursor-pointer">
          <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td>
          <th>{{ item.UID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.UserName }}</div>
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
          {{ users.page }} / {{ Math.floor(users.count / users.limit + 1) }}
        </button>
        <button class="join-item btn" @click="changePage(1)">
          <right theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePageTo(Math.floor(users.count / users.limit + 1))">
          <double-right theme="outline" size="20" />
        </button>
      </div>
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item w-20" placeholder="" v-model="toPage" type="number" min="1"
              :max="Math.floor(users.count / users.limit + 1)" />
          </div>
        </div>
        <button class="btn join-item" @click="toPage ? changePageTo(toPage) : 0">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="AdminUser">
import { DeleteOne, EditOne, Left, Right, DoubleLeft, DoubleRight, AfferentThree, Permissions, Add, Peoples } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { type UserType } from '@/type';

const router = useRouter();

let toPage = ref<number>();
let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  users.users[index].Selected = !users.users[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  }
  else {
    allSelected.value = status;
  }
  for (let i = 0; i < users.users.length; i++) {
    users.users[i].Selected = allSelected.value;
  }
}

function getSelectedList() {
  let list: Array<string> = [];
  for (let i = 0; i < users.problems.length; i++) {
    if (users.problems[i].Selected == true) {
      list.push(users.users[i].UID);
    }
  }
  return list;
}

function deleteUsers() {
  let list = getSelectedList();
  if (list.length == 0) {
    push.warning({
      title: '操作不合法',
      message: '尚未选择任何题目，无法删除',
    })
    return;
  }
  Post('api/user/delete/', {
    UIDs: list,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        getAdministrators();
        switchAllSelectedStatus(false);
        push.success({
          title: '删除成功',
          message: `一共删除了 ${list.length} 个题目`,
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

interface ProblemsListType extends ProblemSimplifiedType {
  Selected: boolean,
};

let users = reactive<UsersType>({
  
})


function getAdministrators(showInfo: boolean = false) {
  Get('api/admin/permission/list', {
    Page: users.page - 1,
    Limit: users.limit,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        users.count = data.Count;
        users.users = data.Data;
        for (let index = 0; index < users.users.length; index++) {
          users.users[index].Selected = false;
        }
      }
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${users.Count} 位管理员`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(users.count / users.limit) + 1) users.page = page;
  // syncUrl();
}

function changePage(page: number) {
  if (users.page + page >= 1 && users.page + page <= Math.floor(users.count / users.limit) + 1) users.page += page;
  // syncUrl();
}

function editUser() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '请选择且仅选择一道题目进行编辑',
    })
    return;
  }
  let PID = list[0];
  router.push('/admin/problem/edit/' + PID);
}

function editPermission() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '请选择且仅选择一道题目进行编辑',
    })
    return;
  }
  let PID = list[0];
  router.push('/admin/problem/data/' + PID);
}

onMounted(() => {
  getAdministrators(true);
})

watch(() => users.page, () => {
  getAdministrators();
  allSelected.value = false;
})


</script>

<style scoped></style>