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
        <div class="font-bold text-base" @click="showChangePasswordModal()">
          <edit-one theme="outline" size="18" />
          编辑用户
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="showEditPermissionModal()">
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
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th v-for="(item, index) in ['用户 ID', '用户名称']" :key="index">
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
        <input type="text" class="grow" placeholder="" v-model="UID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="password" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="changePassword()">确认修改</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="addUserModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg">新增用户</h3>
      <label class="input input-bordered flex items-center gap-2">
        UID
        <input type="text" class="grow" placeholder="" v-model="UID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        用户名
        <input type="text" class="grow" placeholder="" v-model="userName" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="password" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消新增</button>
          <button class="btn btn-neutral" @click="addUser()">确认新增</button>
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
          <input type="text" class="grow" placeholder="" v-model="UID" />
        </label>
        <button class="btn join-item btn-neutral w-20" @click="getPermission(true)">查询</button>
      </div>
      <div>
        <table class="table table-zebra">
          <thead>
            <tr>
              <th v-for="(item, index) in ['超管', '资源', '比赛', '题单', '题目', '管理员']" :key="index">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="checkbox" class="checkbox" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" />
              </td>
              <td>
                <input type="checkbox" class="checkbox" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="changePermission()">确认修改</button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="p-3 bg-base-200"></div>
</template>

<script lang="ts" setup name="AdminUser">
import { DeleteOne, EditOne, AfferentThree, Permissions, Add, Peoples, AddUser } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { type UserType, type PermissionType } from '@/type/user';
import { list } from 'postcss';

import { _deleteUsers, _getAdmins, _changePassword } from "@/api/user";
import Pagination from "@/components/Main/Pagination.vue";
const router = useRouter();


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
  admin: false,
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
      message: '尚未选择任何题目，无法删除',
    })
    return;
  }
  let params = {
    UIDs: list,
  };
  _deleteUsers(params)
    .then(() => {
      getAdministrators();
      switchAllSelectedStatus(false);
      push.success({
        title: '删除成功',
        message: `一共删除了 ${list.length} 个用户`,
      });
    })
};

interface UserListType extends UserType {
  Selected: boolean,
};

let users = reactive({
  users: Array<UserListType>(),
  page: 1,
  limit: 20,
  count: 0,

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) users.page = page;
  },
})

let UID = ref<string>('');
let password = ref<string>('');
let userName = ref<string>('');

function getAdministrators(showInfo: boolean = false) {
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
      }
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${users.count} 位管理员`,
        })
      }
    })
}

function changePassword() {
  let params = {
    UID: UID.value,
    Password: password.value,
  };

  _changePassword(params)
    .then(() => {
      push.success({
        title: '修改成功',
        message: `成功修改了 ${UID.value} 的密码`,
      });
    })
  switchAllSelectedStatus(false);
}

function editPermission() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '不选择或仅选择一位用户进行编辑',
    })
    return;
  }
  UID.value = list[0];
  // @ts-ignore
  changePermission.showModal();
  switchAllSelectedStatus(false);
}

function showEditPermissionModal() {
  UID.value = '';
  let list = getSelectedList();
  if (list.length > 1) {
    push.warning({
      title: '操作不合法',
      message: '不选择或仅选择一位用户进行编辑',
    })
    return;
  }
  else if (list.length == 1) {
    UID.value = list[0];
  }
  getPermission();
  // @ts-ignore
  editPermissionModal.showModal();
}

function showAddUserModal() {
  UID.value = userName.value = password.value = '';
  // @ts-ignore
  addUserModal.showModal();
}

function showChangePasswordModal() {
  UID.value = userName.value = password.value = '';
  let list = getSelectedList();
  UID.value = list[0];
  if (list.length > 1) {
    push.warning({
      title: '操作不合法',
      message: '不选择或仅选择一位用户进行编辑',
    })
    return;
  }
  else if (list.length == 1) {
    UID.value = list[0];
  }
  // @ts-ignore
  changePasswordModal.showModal();
}

function addUser() {
  if (UID.value == '' || password.value == '' || userName.value == '') {
    push.warning({
      title: '操作不合法',
      message: '请填写完整信息',
    })
    return;
  }

  Post('/api/auth/register/', {
    UID: UID.value,
    UserName: userName.value,
    Pass: password.value,
  })
    .then((res: any) => {
      let data = res.data;
      console.log(data);

      if (data.Code == 0) {
        push.success({
          title: '新增成功',
          message: `成功新增用户 ${UID.value}`,
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
}

function getPermission(showInfo = false) {
  if (UID.value == '') {
    if (showInfo == true) {
      push.warning({
        title: '操作不合法',
        message: `输入的用户 UID 为空`,
      });
    }
    return;
  }
  Get('api/admin/permission/' + UID.value, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '查询成功',
          message: `查询到了用户 UID 为 ${UID.value} 的权限列表`,
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
}

function changePermission() {
  push.error({
    title: '操作失败',
    message: '该功能尚未完成',
  });
  return;
  Post('api/admin/permission/edit/', {
    UID: UID.value,
    Password: password.value,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '修改成功',
          message: `成功修改了 ${UID} 的密码`,
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
  getAdministrators();
  switchAllSelectedStatus(false);
}

onMounted(() => {
  getAdministrators(true);
})

watch(() => users.page, () => {
  getAdministrators();
  allSelected.value = false;
})

const maxPage = computed(() => Math.floor(users.count / users.limit) + 1);

</script>