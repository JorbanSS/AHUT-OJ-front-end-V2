<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <edit-one theme="outline" size="18" />
          编辑小组
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="group.edit()">
          <edit-one theme="outline" size="18" />
          提交编辑
        </div>
      </li>
      <li>
        <div
          class="font-bold text-base"
          @click="
            $router.push({
              name: 'GroupList',
            })
          "
        >
          <go-on theme="outline" size="18" />
          跳转小组列表
        </div>
      </li>
    </ul>
  </div>
  <div
    class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl"
  >
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      小组名称
      <input
        type="text"
        class="grow"
        placeholder=""
        v-model="group.GroupName"
      />
    </label>
    <!-- <div class="form-control w-72" @change="changePublic()">
        <label class="label cursor-pointer">
          <span class="label-text text-base">可见性</span>
          <input type="checkbox" :checked="problemList.IsPublic == 1" class="checkbox" />
        </label>
      </div> -->
  </div>
  <div class="m-6"></div>
  <div class="card bg-white shadow-lg Border max-w-5xl mx-auto overflow-hidden">
    <div class="text-2xl px-6 pt-6">
      <div class="join flex" style="justify-content: space-evenly">
        <button
          class="btn btn-neutral"
          @click.stop="
            $router.push({
              name: 'ProblemListAddTask',
              params: {
                GID: group.GID,
              },
            })
          "
        >
          添加题单
        </button>
        <button
          class="btn btn-neutral"
          @click.stop="
            $router.push({
              name: 'ProblemAddTask',
              params: {
                GID: group.GID,
              },
            })
          "
        >
          添加题目
        </button>
        <button
          class="btn btn-neutral"
          @click.stop="
            $router.push({
              name: 'ContestAddTask',
              params: {
                GID: group.GID,
                LID: 0,
              },
            })
          "
        >
          添加比赛
        </button>
      </div>
    </div>
    <VueDraggable
      ref="el"
      v-model="taskList"
      target=".sort-target"
      :animation="200"
      class="select-none"
    >
      <table class="table table-zebra text-center">
        <thead>
          <tr>
            <th>序号</th>
            <th>ID</th>
            <th>名称</th>
            <th>任务类型</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="sort-target">
          <tr
            v-for="(item, index) in taskList"
            :key="item.ID"
            class="cursor-pointer"
            v-auto-animate
          >
            <th class="w-32">
              {{ index + 1 }}
            </th>
            <th class="w-48">
              {{ item.ID }}
            </th>
            <td class="w-48">
              {{ item.Name }}
            </td>
            <td class="w-48">
              {{ item.typestr[item.type - 1] }}
            </td>
            <td class="flex justify-center space-x-2">
              <!-- <button class="btn btn-neutral btn-sm" @click="user.delete(index)" v-if="item.UID!=group.UID" :disabled="IsTrace">
                  <delete-one theme="outline" size="16" />
                  删除
                </button> -->
              <button
                class="btn btn-neutral btn-sm"
                @click="task.gotoano(item.type, item.ID)"
                v-if="item.UID != group.UID"
                :disabled="item.type == 1"
              >
                <setting theme="outline" size="24" />
                编辑
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </VueDraggable>
  </div>
  <div class="m-6"></div>
  <div class="card bg-white shadow-lg Border max-w-5xl mx-auto overflow-hidden">
    <div class="text-2xl px-6 pt-6">
      <div class="join">
        <input
          class="input input-bordered join-item"
          placeholder="学生ID"
          v-model="user.UID"
        />
        <button class="btn join-item btn-neutral" @click="user.add()">
          添加成员
        </button>
        <!-- <button class="btn join-item btn-neutral"  style="border-radius: 0px;margin-left: 10px;">Excel文档导入 -->
        <!-- <input  type='file' accept='.xlsx, .xls' @onChange="onImportExcel()" /> -->
        <input
          type="file"
          @change="onImportExcel"
          style="margin-left: 10px"
          class="file-input file-input-bordered w-full max-w-xs"
          accept=".xlsx, .xls"
        />
        <!-- </button> -->
      </div>
    </div>
    <VueDraggable
      ref="el"
      v-model="list"
      target=".sort-target"
      :animation="200"
      class="select-none"
    >
      <table class="table table-zebra text-center">
        <thead>
          <tr>
            <th>序号</th>
            <th>ID</th>
            <th>学生名称</th>
            <th>身份</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="sort-target">
          <tr
            v-for="(item, index) in list"
            :key="item.UID"
            class="cursor-pointer"
            v-auto-animate
          >
            <th class="w-32">
              {{ index + 1 }}
            </th>
            <th class="w-48">
              {{ item.UID }}
            </th>
            <td class="w-48">
              {{ item.UserName }}
            </td>
            <td class="w-48">
              {{ item.UID == group.UID ? "组长" : "成员" }}
            </td>
            <td class="flex justify-center space-x-2">
              <button
                class="btn btn-neutral btn-sm"
                @click="user.delete(index)"
                v-if="item.UID != group.UID"
                :disabled="IsTrace"
              >
                <delete-one theme="outline" size="16" />
                删除
              </button>
              <button
                class="btn btn-neutral btn-sm"
                @click="group.trace(item.UID)"
                v-if="item.UID != group.UID"
                :disabled="IsTrace"
              >
                <delete-one theme="outline" size="16" />
                转让
              </button>
              <button
                class="btn btn-neutral btn-sm"
                v-if="item.UID == group.UID"
                disabled
              >
                <delete-one theme="outline" size="16" />
                不可操作
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </VueDraggable>
  </div>
  <div class="mt-6"></div>
</template>

<script lang="ts" setup name="AddProblemList">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { _getUserInfo } from "@/apis/user";
import {
  Add,
  Bill,
  DeleteOne,
  EditTwo,
  GoOn,
  SettingThree,
  Setting,
} from "@icon-park/vue-next";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
// import * as XLSX from "xlsx";
import { push } from "notivue";
import { _editContest, _getContest } from "@/apis/contest";
import { VueDraggable } from "vue-draggable-plus";
import {
  _GetGroup,
  _EditGroup,
  _AddUserToGroup,
  _DelUserFromGroup,
  _TraceGroup,
} from "@/apis/group";
import { _getProblem } from "@/apis/problem";
import { _editProblemList, _getProblemList } from "@/apis/problemList";
import { type ProblemListType } from "@/interfaces/problemList";
import { useUserDataStore } from "@/stores/UserData";
import { FileUtils } from "@/utils/fileUtils";
import { ConvertTools } from "@/utils/globalFunctions";
const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();

interface UserType {
  UID: string;
  UserName: string;
  [item: string]: any;
}
interface taskType {
  type: number;
  ID: string;
  typestr: ["题目", "比赛", "题单"];
  Name: string;
  [item: string]: any;
}

let user = reactive<UserType>({
  UID: "",
  UserName: "",

  add() {
    if (this.UID == "") {
      push.warning({
        title: "信息错误",
        message: "未输入用户ID",
      });
      return;
    }
    for (let item in list.value) {
      if (list.value[item].UID == this.UID) {
        push.warning({
          title: "信息错误",
          message: "该学生已添加，不可重复添加",
        });
        this.UID = "";
        return;
      }
    }
    let params = {
      UID: this.UID,
    };
    _getUserInfo(params).then((data: any) => {
      this.UserName = data.UserName;
      list.value.push({
        UID: this.UID,
        UserName: this.UserName,
      });
      listadd.value.push({
        UID: this.UID,
        UserName: this.UserName,
      });
      for (let i = 0; i < listdel.value.length; i++) {
        if (listdel.value[i].UID == this.UID) {
          listdel.value.splice(i, 1);
        }
      }
      this.UID = "";
    });
  },

  delete(index: number) {
    push.success({
      title: "删除成功",
      message: `已成功删除用户 ${list.value[index].UID}`,
    });
    listdel.value.push({
      UID: list.value[index].UID,
      UserName: list.value[index].UserName,
    });
    list.value.splice(index, 1);
    for (let i = 0; i < listadd.value.length; i++) {
      if (listadd.value[i].UID == listdel.value[index].UID) {
        listadd.value.splice(i, 1);
      }
    }
  },
});

//小组任务
let taskPID = ref<string>("");
let taskCID = ref<string>("");
let taskLID = ref<string>("");
let taskPIDList = ref([]);
let taskCIDList = ref([]);
let taskLIDList = ref([]);
let list = ref<Array<UserType>>([]);
let listadd = ref<Array<UserType>>([]);
let listdel = ref<Array<UserType>>([]);
//小组任务列表
let taskList = ref<Array<taskType>>([]);

let task = ref<taskType>({
  type: 4,
  ID: "",
  typestr: ["题目", "比赛", "题单"],
  Name: "暂无组任务",

  getAllTasks() {
    //查询小组任务中的所有题目
    for (let i = 0; i < taskPIDList.value.length; i++) {
      _getProblem({}, taskPIDList.value[i]).then((data: any) => {
        taskList.value.push({
          type: 1,
          ID: taskPIDList.value[i] + "",
          typestr: ["题目", "比赛", "题单"],
          Name: data.Title,
        });
      });
    }
    //查询小组任务中的所有题单
    for (let i = 0; i < taskLIDList.value.length; i++) {
      _getProblemList({}, taskLIDList.value[i]).then((data: any) => {
        taskList.value.push({
          type: 3,
          ID: taskLIDList.value[i] + "",
          typestr: ["题目", "比赛", "题单"],
          Name: data.Title,
        });
      });
    }

    //查询小组任务中的所有比赛
    for (let i = 0; i < taskCIDList.value.length; i++) {
      _getContest({}, taskCIDList.value[i]).then((data: any) => {
        taskList.value.push({
          type: 2,
          ID: taskCIDList.value[i] + "",
          typestr: ["题目", "比赛", "题单"],
          Name: data.Title,
        });
      });
    }
  },

  gotoano(type: number, id: any) {
    if (type == 2) {
      router.push({
        name: "ContestTaskEdit",
        params: {
          GID: group.value.GID,
          CID: id,
        },
      });
    } else {
      router.push({
        name: "ProblemListTaskEdit",
        params: {
          GID: group.value.GID,
          LID: id,
        },
      });
    }
  },
});

//是否进行了转让操作
let IsTrace = ref(false);

let group = ref({
  GID: 0,
  GroupName: "测试",
  GroupTask: "",
  UID: "",
  CreatTime: 0,
  InviteCode: "123456",

  edit() {
    if (group.value.GroupName == "") {
      push.error({
        title: "信息错误",
        message: "请填写完整信息",
      });
      return;
    }
    let params = {
      GID: this.GID,
      GroupName: this.GroupName,
      GroupTask: this.GroupTask,
    };
    console.log(params);
    for (let i = 0; i < listadd.value.length; i++) {
      let params2 = {
        GID: this.GID,
        UID: listadd.value[i].UID,
      };
      _AddUserToGroup(params2);
    }
    for (let i = 0; i < listdel.value.length; i++) {
      let params3 = {
        GID: this.GID,
        UID: listdel.value[i].UID,
      };
      _DelUserFromGroup(params3);
    }

    let params4 = {
      UID: this.UID,
      GID: this.GID,
    };
    if (IsTrace.value) {
      _TraceGroup(params4);
    }
    listadd.value = [];
    listdel.value = [];
    _EditGroup(params).then(() => {
      push.success({
        title: "编辑成功",
      });
    });
    //转让小组后跳到小组列表界面
    if (IsTrace.value) {
      router.push({
        name: "GroupList",
      });
    }
  },

  get() {
    _GetGroup({}, this.GID).then((data: any) => {
      console.log(data);
      group.value.GroupName = data.GroupName;
      group.value.GroupTask = data.GroupTask;
      //字符串切割
      let arr = data.GroupTask.split(";");
      if (arr != "") {
        arr.forEach((element: any) => {
          if (element.charAt(0) == "C")
            taskCIDList.value.push(+element.slice(1));
          else if (element.charAt(0) == "P" && element.charAt(1) != "P")
            taskPIDList.value.push(element.slice(1));
          else if (element.charAt(0) == "L")
            taskLIDList.value.push(+element.slice(1));
          else taskPIDList.value.push(element.slice(1));
        });
      }
      group.value.GroupName = data.GroupName;
      group.value.UID = data.UID;
      for (let i = 0; i < data.MemberUIDs.length; i++) {
        let params = {
          UID: data.MemberUIDs[i],
        };
        _getUserInfo(params).then((data: any) => {
          list.value.push({
            UID: data.UID,
            UserName: data.UserName,
          });
        });
      }
      //小组任务id处理
      if (
        route.params.PID != 0 &&
        taskPIDList.value.indexOf(route.params.PID) == -1
      ) {
        if (route.params.PID == parseInt(route.params.PID)) {
          // 使用parseFloat也可以
          taskPIDList.value.push(+route.params.PID);
          if (group.value.GroupTask == "")
            group.value.GroupTask += "PP" + route.params.PID;
          else group.value.GroupTask += ";PP" + route.params.PID;
        } else {
          // fasle
          taskPIDList.value.push(route.params.PID);
          if (group.value.GroupTask == "")
            group.value.GroupTask += "P" + route.params.PID;
          else group.value.GroupTask += ";P" + route.params.PID;
        }

        taskPID.value = route.params.PID + "";
        console.log(taskPID.value);
      }
      if (
        route.params.CID != 0 &&
        taskCIDList.value.indexOf(+route.params.CID) == -1
      ) {
        taskCIDList.value.push(+route.params.CID);
        taskCID.value = route.params.CID + "";
        if (group.value.GroupTask == "")
          group.value.GroupTask += "C" + route.params.CID;
        else group.value.GroupTask += ";C" + route.params.CID;
        console.log(taskCID.value);
      }
      if (
        route.params.LID != 0 &&
        taskLIDList.value.indexOf(+route.params.LID) == -1
      ) {
        taskLIDList.value.push(+route.params.LID);
        taskLID.value = route.params.LID + "";
        if (group.value.GroupTask == "")
          group.value.GroupTask += "L" + route.params.LID;
        else
          group.value.GroupTask =
            group.value.GroupTask + ";L" + route.params.LID;
        console.log(taskLID.value);
      }
      // console.log(group.value.GroupTask);
      // console.log(taskPIDList.value);
      // console.log(taskCIDList.value);
      // console.log(taskLIDList.value);
      task.value.getAllTasks();
    });
  },
  trace(UID: any) {
    this.UID = UID;
    IsTrace.value = true;
    push.success({
      title: "提示",
      message: "转让成功，提交编辑后生效",
    });
  },
});
const importConfig = {
  UID: "id",
  UserName: "name",
};
//excel导入
let onImportExcel = (event) => {
  const result = FileUtils.importExcel(event, importConfig)
    .then((data) => {
      push.success({
        title: "提示",
        message: "上传文件成功",
      }); //这里用了antd中的message组件
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
            UID: data[i].id + "",
            UserName: data[i].name,
          });
          listadd.value.push({
            UID: data[i].id + "",
            UserName: data[i].name,
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

onMounted(() => {
  // console.log(+route.params.GID)
  group.value.GID = +route.params.GID;
  group.value.get();
  console.log(route.params.GID);
});
</script>

<style>
.upload_wrap {
  display: inline-block;
  position: relative;
  width: 94px;
  padding: 3px 5px;
  overflow: hidden;
}

.file_uploader {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: none;
  opacity: 0;
  background-color: transparent;
}

.upload_text {
  display: inline-block;
  margin-left: 5px;
}

.upload_tip {
  display: inline-block;
  margin-left: 10px;
  color: #999;
}
</style>
