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
        <div class="font-bold text-base" @click="confirmImport">
          <afferent-three theme="outline" size="18" />
          确认导入
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="clearList">
          <delete theme="outline" size="18" />
          清空列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="autoImportFile">
          <refresh theme="outline" size="18" />
          重新选择文件
        </div>
      </li>
    </ul>
  </div>

  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th
            v-for="(item, index) in ['用户 ID', '用户名称', '密码', '操作']"
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
          class="cursor-pointer"
        >
          <td>
            <div class="font-bold talbe-lg">{{ item.UID }}</div>
          </td>
          <td>
            <div class="font-bold talbe-lg">{{ item.UserName }}</div>
          </td>
          <td>
            <div class="font-bold talbe-lg">{{ item.Pass }}</div>
          </td>
          <td>
            <div class="flex space-x-2">
              <button
                class="btn btn-neutral btn-sm"
                @click="deleteUser(item.UID)"
              >
                <delete-one theme="outline" size="16" />
                删除
              </button>
              <button
                class="btn btn-neutral btn-sm"
                @click="editUser(item, index)"
              >
                <edit-one theme="outline" size="18" />
                编辑
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex items-center justify-center">
    <p class="text-center text-gray-500 text-opacity-70">
      Excel 导入请按照UID,UserName,Password的格式
      <p></p>
      后续会加上可编辑的选择性导入
    </p>
  </div>

  <div>
    <dialog id="editUserInfoModal" class="modal">
      <div class="modal-box space-y-2 w-96">
        <h3 class="font-bold text-lg">修改用户信息</h3>
        <label class="input input-bordered flex items-center gap-2">
          UID
          <input
            type="text"
            class="grow"
            placeholder=""
            v-model="currentUser.UID"
          />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          用户名
          <input
            type="text"
            class="grow"
            placeholder=""
            v-model="currentUser.UserName"
          />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          密码
          <input
            type="text"
            class="grow"
            placeholder=""
            v-model="currentUser.Pass"
          />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2">取消修改</button>
            <button class="btn btn-neutral" @click="confirmEditUser">
              确认修改
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>

  <!-- <div class="p-3 bg-base-200"></div> -->
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { push } from "notivue";
import { _addUser, _getUsers } from "@/apis/user";
import { AddUserType } from "@/interfaces/user";
import { FileUtils } from "@/utils/fileUtils";

let list = ref<Array<AddUserType>>([]);

function autoImportFile() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".xlsx, .xls";

  fileInput.addEventListener("change", (event) => {
    onImportExcel(event);
  });
  fileInput.click();
}

onMounted(() => {
  autoImportFile();
});

let onImportExcel = (event) => {
  const importConfig = { UID: "UID", UserName: "UserName", Password: "Pass" };
  FileUtils.importExcel(event, importConfig)
    .then((data) => {
      push.success({
        title: "提示",
        message: "上传文件成功",
      });
      for (let i = 0; i < data.length; i++) {
        let flag = true;
        for (let item in list.value) {
          if (list.value[item].UID == data[i].id + "") {
            flag = false;
            break;
          }
        }
        if (flag) {
          list.value.push({
            UID: data[i].UID + "",
            UserName: data[i].UserName,
            Pass: data[i].Pass + "",
          });
        }
      }
    })
    .catch(() => {
      push.warning({
        title: "提示",
        message: "文件信息不正确",
      });
    });
};

const confirmImport = () => {
  _addUser(list.value)
    .then(() => {
      push.success({
        title: "提示",
        message: "用户数据已保存",
      });
    })
    .catch(() => {
      push.error({
        title: "错误",
        message: "保存用户数据失败",
      });
    });
};

let users = reactive({
  users: list.value,
});

let Index = 0;

let currentUser = reactive<AddUserType>({
  UID: "",
  UserName: "",
  Pass: "",
});

function clearList() {
  list.value = [];
  users.users = [];
  push.success({
    title: "提示",
    message: "列表已清空",
  });
}

function deleteUser(uid: string) {
  list.value = list.value.filter((user) => user.UID !== uid);
  users.users = list.value;
  push.success({
    title: "提示",
    message: "用户已删除",
  });
}

function editUser(user: AddUserType, index: number) {
  currentUser = user;
  // @ts-ignore
  editUserInfoModal.showModal();
  Index = index;
}
function confirmEditUser() {
  users.users[Index] = currentUser;
}
</script>
