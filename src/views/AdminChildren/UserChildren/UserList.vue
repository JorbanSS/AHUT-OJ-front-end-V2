<template>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <peoples theme="outline" size="18" />
          用户列表
        </div>
      </li>
      <li>
        <div
          class="font-bold text-base"
          @click="$router.push({ name: 'AdminList' })"
        >
          <people-safe theme="outline" size="18" />
          管理员列表
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="showAddUserModal()">
          <add theme="outline" size="18" />
          新增用户
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="showEditUserInfoModal()">
          <edit-one theme="outline" size="18" />
          用户编辑
        </div>
      </li>
      <li>
        <div
          class="font-bold text-base hover:text-red-500"
          @click="deleteUsers()"
        >
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除用户
        </div>
      </li>
      <li>
        <div
          class="font-bold text-base"
          @click="$router.push({ name: 'ImportUsers' })"
        >
          <afferent-three theme="outline" size="18" />
          导入
        </div>
      </li>
    </ul>
  </div>
  <div class="card mx-auto max-w-5xl">
    <div class="flex justify-center gap-30 flex-col md:flex-row">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">用户ID/用户名</span>
        <input type="text" class="grow" v-model="users.userInfo" />
      </label>
      <button
        class="btn md:join-item md:w-24 w-full"
        @click="users.userSearch()"
      >
        <search theme="outline" size="18" />
        <span>搜索</span>
      </button>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              :checked="allSelected"
              class="checkbox"
              @click="switchAllSelectedStatus()"
            />
          </th>
          <th
            v-for="(item, index) in ['用户 ID', '用户名称', '班级', '入学年份']"
            :key="index"
          >
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in users.users"
          :key="item.UID"
          @click="switchSelectedStatus(index)"
          class="cursor-pointer"
        >
          <td>
            <input
              type="checkbox"
              :checked="item.Selected == true"
              class="checkbox"
            />
          </td>
          <th>{{ item.UID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.UserName }}</div>
          </td>
          <td>
            <div class="font-bold talbe-lg">{{ item.Classes }}</div>
          </td>
          <td>
            <div class="font-bold talbe-lg">{{ item.Year }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :page="users.page"
      :maxPage="maxPage"
      :changePage="users.changePage"
    />
  </div>
  <div>
    <dialog id="editUserInfoModal" class="modal">
      <div class="modal-box space-y-2 w-96">
        <h3 class="font-bold text-lg">修改用户信息</h3>
        <label class="input input-bordered flex items-center gap-2">
          UID
          <input type="text" class="grow" placeholder="" v-model="user.UID" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          邮箱
          <input type="text" class="grow" placeholder="" v-model="user.Email" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          密码
          <input
            type="text"
            class="grow"
            placeholder=""
            v-model="user.Password"
          />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2">取消修改</button>
            <button class="btn btn-neutral" @click="user.edit()">
              确认修改
            </button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog id="addUserModal" class="modal">
      <div class="modal-box space-y-2 w-96">
        <h3 class="font-bold text-lg">新增用户</h3>
        <label class="input input-bordered flex items-center gap-2">
          UID
          <input type="text" class="grow" placeholder="" v-model="user.UID" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          用户名
          <input
            type="text"
            class="grow"
            placeholder=""
            v-model="user.UserName"
          />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          密码
          <input
            type="text"
            class="grow"
            placeholder=""
            v-model="user.Password"
          />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2">取消新增</button>
            <button class="btn btn-neutral" @click="user.addUser()">
              确认新增
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
  <!-- <div class="p-3 bg-base-200"></div> -->
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  Add,
  AfferentThree,
  DeleteOne,
  Peoples,
  EditOne,
} from "@icon-park/vue-next";
import Pagination from "@/components/Main/Pagination.vue";
import {
  _deleteUsers,
  _getAdmins,
  _adminEditUserInfo,
  _addUser,
  _getUserPermission,
  _editUserPermission,
  _getUsers,
} from "@/apis/user";
import { UserType, UserSimplifiedType } from "@/interfaces/user";
import router from "@/routers";
import { push } from "notivue";
import { useConstValStore } from "@/stores/ConstVal";
import { debounce } from "lodash";

const constValStore = useConstValStore();
let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  users.users[index].Selected = !users.users[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  } else {
    allSelected.value = status;
  }
  for (let i = 0; i < users.users.length; i++) {
    users.users[i].Selected = allSelected.value;
  }
}

function getSelectedList() {
  let list: Array<string> = [];
  for (let i = 0; i < users.users.length; i++) {
    if (users.users[i].Selected == true) {
      list.push(users.users[i].UID);
    }
  }
  return list;
}

function deleteUsers() {
  push.info({
    title: "尚未实现的操作",
    message: "尚未实现的操作",
  });
  // let list = getSelectedList();
  // if (list.length == 0) {
  //   push.warning({
  //     title: "操作不合法",
  //     message: "尚未选择任何用户，无法删除",
  //   });
  //   return;
  // }
  // let params = {
  //   UIDs: list,
  // };
  // _deleteUsers(params).then(() => {
  //   users.getUserList();
  //   switchAllSelectedStatus(false);
  //   push.success({
  //     title: "删除成功",
  //     message: `一共删除了 ${list.length} 个用户`,
  //   });
  // });
}

interface UserListType extends UserType {
  Selected: boolean;
  UserName: string;
  Classes: string;
  Year: string;
}

let users = reactive({
  users: Array<UserListType>(),
  page: 1,
  limit: 20,
  count: 0,
  userInfo: "",

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) users.page = page;
  },

  getUserList(showInfo: boolean = false) {
    let params = {
      Page: users.page - 1,
      Limit: users.limit,
      Token: users.userInfo,
    };
    _getUsers(params).then((data: any) => {
      users.count = data.Count;
      users.users = data.Data;
      for (let index = 0; index < users.users.length; index++) {
        users.users[index].Selected = false;
        users.users[index].UserName = data.Data[index].UserName;
        users.users[index].Classes = data.Data[index].Classes;
        users.users[index].Year = data.Data[index].Year;
      }
      if (showInfo) {
        push.success({
          title: "获取成功",
          message: `一共获取了 ${users.count} 位用户`,
        });
      }
    });
  },
  userSearch: debounce(() => {
    users.getUserList(true);
    users.userInfo = "";
  }, 500),
});

let user = reactive<UserSimplifiedType>({
  UID: "",
  Email: "",
  UserName: "",
  PermissionMap: 0,
  Password: "",
  super: false,
  resource: false,
  contest: false,
  problem: false,
  problemList: false,

  edit() {
    let params = {
      UID: this.UID,
      Password: this.Password,
      Email: this.Email,
    };
    if (this.UID == "" || (this.Password == "" && this.Email == "")) {
      push.warning({
        title: "信息不完整",
      });
      return;
    }
    if (this.Password == "") params.Password = this.Password;
    if (this.Email == "") params.Email = this.Email;
    _adminEditUserInfo(params).then(() => {
      push.success({
        title: "修改成功",
        message: `成功修改了 ${this.UID} 的信息`,
      });
    });
    switchAllSelectedStatus(false);
  },

  addUser() {
    if (user.UID == "" || user.UserName == "" || user.Password == 0) {
      push.warning({
        title: "操作不合法",
        message: "请填写完整信息",
      });
      return;
    }
    let params = {
      UID: user.UID,
      UserName: user.UserName,
      Pass: user.Password,
    };
    _addUser(params).then(() => {
      push.success({
        title: "新增成功",
        message: `成功新增用户 ${user.UID}`,
      });
    });
  },
});

function showAddUserModal() {
  user.UID = user.UserName = user.Password = "";
  // @ts-ignore
  addUserModal.showModal();
}

function showEditUserInfoModal(UID: string = "") {
  user.UID = UID;
  user.UserName = user.Password = "";
  if (UID == "") {
    let list = getSelectedList();
    if (list.length > 1) {
      push.warning({
        title: "操作不合法",
        message: "不选择或仅选择一位用户进行编辑",
      });
      return;
    } else if (list.length == 1) {
      user.UID = list[0];
    }
  }
  // @ts-ignore
  editUserInfoModal.showModal();
}

onMounted(() => {
  users.getUserList(true);
});

watch(
  () => users.page,
  () => {
    users.getUserList();
    allSelected.value = false;
  }
);

// watch();

const maxPage = computed(() => Math.ceil(users.count / users.limit));
</script>
