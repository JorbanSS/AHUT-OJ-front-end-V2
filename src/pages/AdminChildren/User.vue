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
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="showAddUserModal()">
          <add theme="outline" size="18" />
          新增用户
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="showEditPermissionModal()">
          <permissions theme="outline" size="18" />
          修改权限
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
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th v-for="(item, index) in ['用户 ID', '用户名称', '超管', '题单', '资源', '比赛', '题目', '操作']" :key="index">
            {{ item }}
          </th>
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
          <td>
            <input type="checkbox" class="checkbox" v-model="item.super" disabled>
          </td>
          <td>
            <input type="checkbox" class="checkbox" v-model="item.problemList" disabled />
          </td>
          <td>
            <input type="checkbox" class="checkbox" v-model="item.resource" disabled />
          </td>
          <td>
            <input type="checkbox" class="checkbox" v-model="item.contest" disabled />
          </td>
          <td>
            <input type="checkbox" class="checkbox" v-model="item.problem" disabled />
          </td>
          <td class="space-x-2">
            <button class="btn btn-sm btn-neutral" @click.stop="showChangePasswordModal(item.UID)">编辑用户</button>
            <button class="btn btn-sm btn-neutral" @click.stop="showEditPermissionModal(item.UID)">修改权限</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="users.page" :maxPage="maxPage" :changePage="users.changePage" />
    </div>
  </div>
  <dialog id="changePasswordModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg">修改密码</h3>
      <label class="input input-bordered flex items-center gap-2">
        UID
        <input type="text" class="grow" placeholder="" v-model="user.UID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="user.Password" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="user.changePassword()">确认修改</button>
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
        <input type="text" class="grow" placeholder="" v-model="user.UserName" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="user.Password" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消新增</button>
          <button class="btn btn-neutral" @click="user.addUser()">确认新增</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="editPermissionModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg">修改权限</h3>
      <div class="join">
        <label class="input input-bordered flex items-center gap-2 join-item">
          UID
          <input type="text" class="grow" placeholder="" v-model="user.UID" />
        </label>
        <button class="btn join-item btn-neutral w-20" @click="user.getPermission(true)">查询</button>
      </div>
      <div>
        <table class="table table-zebra">
          <thead>
            <tr>
              <th v-for="(item, index) in ['超管', '题单', '资源', '比赛', '题目']" :key="index">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="checkbox" class="checkbox" v-model="permission.super" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" v-model="permission.problemList" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" v-model="permission.resource" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" v-model="permission.contest" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" v-model="permission.problem" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="user.changePermission()">确认修改</button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="p-3 bg-base-200"></div>
</template>

<script lang="ts" setup name="AdminUser">
import { DeleteOne, EditOne, AfferentThree, Permissions, Add, Peoples, AddUser, Youtobe } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { push } from 'notivue';
import { useRouter } from 'vue-router';
import { type UserSimplifiedType, type PermissionType, type UserType } from '@/type/user';
import { list } from 'postcss';
import { useConstValStore } from '@/store/ConstVal';

import { _deleteUsers, _getAdmins, _changePassword, _getUserPermission, _addUser, _editUserPermission } from "@/api/user";
import Pagination from "@/components/Main/Pagination.vue";

const router = useRouter();
const constValStore = useConstValStore();

let toPage = ref<number>();
let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  users.users[index].Selected = !users.users[index].Selected;
}

let permission = reactive<PermissionType>({
  map: 0,
  super: false,
  resource: false,
  contest: false,
  problem: false,
  problemList: false,

  set(permissionMap: number) {
    this.map = permissionMap;
    this.super = (this.map & constValStore.SuperAdminBit) != 0;
    this.resource = (this.map & constValStore.SourceBorwserBit) != 0;
    this.contest = (this.map & constValStore.ContestAdminBit) != 0;
    this.problemList = (this.map & constValStore.ProblemListAdminBit) != 0;
    this.problem = (this.map & constValStore.ProblemAdminBit) != 0;
    this.admin = (this.map & constValStore.AdminBit) != 0;
  },
});

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
  for (let i = 0; i < users.users.length; i++) {
    if (users.users[i].Selected == true) {
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
      message: '尚未选择任何用户，无法删除',
    })
    return;
  }
  let params = {
    UIDs: list,
  };
  _deleteUsers(params)
    .then(() => {
      users.getAdministrators();
      switchAllSelectedStatus(false);
      push.success({
        title: '删除成功',
        message: `一共删除了 ${list.length} 个用户`,
      });
    })
};

interface UserListType extends UserType {
  Selected: boolean,
  super: boolean,
  resource: boolean,
  contest: boolean,
  problem: boolean,
  problemList: boolean,
};

let users = reactive({
  users: Array<UserListType>(),
  page: 1,
  limit: 20,
  count: 0,

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) users.page = page;
  },

  getAdministrators(showInfo: boolean = false) {
    let params = {
      Page: users.page - 1,
      Limit: users.limit,
    }
    _getAdmins(params)
      .then((data: any) => {

        users.count = data.Count;
        users.users = data.Data;
        for (let index = 0; index < users.users.length; index++) {
          users.users[index].Selected = false;
          users.users[index].UserName = data.Data[index].Uname;
          users.users[index].PermissionMap = data.Data[index].PermissionMap;
          users.users[index].super = (users.users[index].PermissionMap & constValStore.SuperAdminBit) != 0;
          users.users[index].problemList = (users.users[index].PermissionMap & constValStore.ProblemListAdminBit) != 0;
          users.users[index].resource = (users.users[index].PermissionMap & constValStore.SourceBorwserBit) != 0;
          users.users[index].contest = (users.users[index].PermissionMap & constValStore.ContestAdminBit) != 0;
          users.users[index].problem = (users.users[index].PermissionMap & constValStore.ProblemAdminBit) != 0;
        }
        users.users.forEach(user => {
          user.super = (user.PermissionMap & constValStore.SuperAdminBit) != 0;
          user.problemList = (user.PermissionMap & constValStore.ProblemListAdminBit) != 0;
        });
        console.log(maxPage.value);
        console.log(this.count);
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${users.count} 位管理员`,
          })
        }
      })
  },
})

let user = reactive<UserSimplifiedType>({
  UID: '',
  UserName: '',
  PermissionMap: 0,
  Password: '',
  super: false,
  resource: false,
  contest: false,
  problem: false,
  problemList: false,

  changePassword() {
    let params = {
      UID: user.UID,
      Password: user.Password,
    };
    _changePassword(params)
      .then(() => {
        push.success({
          title: '修改成功',
          message: `成功修改了 ${user.UID} 的密码`,
        });
      })
    switchAllSelectedStatus(false);
  },

  editPermission() {
    let list = getSelectedList();
    if (list.length != 1) {
      push.warning({
        title: '操作不合法',
        message: '不选择或仅选择一位用户进行编辑',
      })
      return;
    }
    user.UID = list[0];
    // @ts-ignore
    changePermission.showModal();
    switchAllSelectedStatus(false);
  },

  addUser() {
    if (user.UID == '' || user.UserName == '' || user.Password == 0) {
      push.warning({
        title: '操作不合法',
        message: '请填写完整信息',
      })
      return;
    }
    let params = {
      UID: user.UID,
      UserName: user.UserName,
      Pass: user.Password,
    };
    _addUser(params)
      .then(() => {
        push.success({
          title: '新增成功',
          message: `成功新增用户 ${user.UID}`,
        });
      })
  },

  getPermission(showInfo = false) {
    if (user.UID == '') {
      if (showInfo == true) {
        push.warning({
          title: '操作不合法',
          message: `输入的用户 UID 为空`,
        });
      }
      return;
    }

    _getUserPermission({}, user.UID)
      .then((data: any) => {
        user.PermissionMap = data.PermissionMap;
        permission.set(user.PermissionMap);
        push.success({
          title: '查询成功',
          message: `查询到了用户 UID 为 ${user.UID} 的权限列表`,
        });
      })
  },

  changePermission() {
    if (user.UID == '') {
      push.warning({
        title: '操作不合法',
        message: `输入的用户 UID 为空`,
      });
      return;
    }
    let params = {
      ContestAdmin: permission.contest,
      ListAdmin: permission.problemList,
      ProbelmAdmin: permission.problem,
      SourceAdmin: permission.resource,
      SuperAdmin: permission.super,
      UID: user.UID,
    };
    _editUserPermission(params)
      .then(() => {
        push.success({
          title: '修改成功',
          message: `成功修改了 ${user.UID} 的权限`,
        });
      })
    users.getAdministrators();
    switchAllSelectedStatus(false);
  },

});

function showEditPermissionModal(UID: string = '') {
  user.UID = UID;
  if (UID == '') {
    let list = getSelectedList();
    if (list.length > 1) {
      push.warning({
        title: '操作不合法',
        message: '不选择或仅选择一位用户进行编辑',
      })
      return;
    }
    else if (list.length == 1) {
      user.UID = list[0];
    }
  }
  user.getPermission();
  // @ts-ignore
  editPermissionModal.showModal();
}

function showAddUserModal() {
  user.UID = user.UserName = user.Password = '';
  // @ts-ignore
  addUserModal.showModal();
}

function showChangePasswordModal(UID: string = '') {
  user.UID = UID;
  user.UserName = user.Password = '';
  if (UID == '') {
    let list = getSelectedList();
    if (list.length > 1) {
      push.warning({
        title: '操作不合法',
        message: '不选择或仅选择一位用户进行编辑',
      })
      return;
    }
    else if (list.length == 1) {
      user.UID = list[0];
    }
  }
  // @ts-ignore
  changePasswordModal.showModal();
}

onMounted(() => {
  users.getAdministrators(true);
})

watch(() => users.page, () => {
  users.getAdministrators();
  allSelected.value = false;
})


watch(() => permission.super, () => {
  if (permission.super == true) {
    permission.set(185);
    permission.resource = permission.contest = permission.problem = permission.problemList = true;
  }
})

const maxPage = computed(() => Math.floor(users.count / users.limit) + 1);

</script>