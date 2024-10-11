<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <bill theme="outline" size="18" />
          小组列表
        </div>
      </li>

    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
    
      <li>
        <div class="font-bold text-base" @click="showAddUserModal()">
          <add theme="outline" size="18" />
          新增小组
        </div>
      </li>
    </ul>
  </div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th>小组ID</th>
          <th>小组名称</th>
          <th>邀请码</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in group.groupList" :key="item.GID" 
          class="cursor-pointer">
          <!-- <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td> -->
          <th>{{ item.GID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.GroupName }}</div>
          </td>
          <td>{{item.InviteCode}}</td>
          <td class="flex justify-center space-x-2">
            <button class="btn btn-sm btn-neutral" @click.stop="$router.push({
              name: 'EditGroup',
              params: {
                GID: item.GID,
                PID:0,
                CID:0,
                LID:0,
              }
            })">
              <edit-two theme="outline" size="18" />
              编辑
            </button>
            <button class="btn btn-neutral btn-sm" @click.stop="group.delete(item.GID)">
              <delete-one theme="outline" size="16" />
              删除
            </button>
            <button class="btn btn-neutral btn-sm" @click.stop="$router.push({
              name: 'GroupTaskList',
              params: {
                GID: item.GID,
              }
            })">
              <bill theme="outline" size="24"/>
              任务列表
            </button>
            <button class="btn btn-neutral btn-sm" @click.stop="$router.push({
              name: 'GroupProgress',
              params: {
                GID: item.GID,
              }
            })">
              <pie-three theme="outline" size="24"/>
              小组进度
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <dialog id="addUserModal" class="modal">
      <div class="modal-box space-y-2 w-96">
        <h3 class="font-bold text-lg">新增小组</h3>
        <label class="input input-bordered flex items-center gap-2">
          小组名称
          <input type="text" class="grow" placeholder="" v-model="groupadd.GroupName" />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2">取消新增</button>
            <button class="btn btn-neutral" @click="groupadd.add()">
              确认新增
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <Pagination :page="group.page" :maxPage="maxPage" :changePage="group.changePage" />
  </div>
</template>

<script lang="ts" setup name="ProblemListsList">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { _AddGroup } from '@/apis/group';
import { Add, Bill, DeleteOne, EditTwo,PieThree } from '@icon-park/vue-next';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { _deleteProblemLists, _getProblemLists } from '@/apis/problemList';
import Pagination from "@/components/Main/Pagination.vue";
import { type ProblemListSimplifiedType, type ProblemListsType } from '@/interfaces/problemList';
import { _GetGroupList ,_DelGroup } from '@/apis/group';
let allSelected = ref<boolean>(false);

// function switchSelectedStatus(index: number) {
//   problemLists.problemLists[index].Selected = !problemLists.problemLists[index].Selected;
// }

// function switchAllSelectedStatus(status?: boolean) {
//   if (status == undefined) {
//     allSelected.value = !allSelected.value;
//   }
//   else {
//     allSelected.value = status;
//   }
//   for (let i = 0; i < problemLists.problemLists.length; i++) {
//     problemLists.problemLists[i].Selected = allSelected.value;
//   }
// }

// function getSelectedList() {
//   let list: Array<number> = [];
//   for (let i = 0; i < group.value.groupList.length; i++) {
//     if (group.value.groupList[i].Selected == true) {
//       list.push(group.value.groupList[i].LID);
//     }
//   }
//   return list;
// }

// interface ProblemListsListType extends ProblemListSimplifiedType {
//   Selected: boolean,
// };

let group = ref({
  groupList: [{
  GID:1,
  GroupName: '测试',
  GroupTask: '',
  UID: 1,
  CreatTime: 1111,
  InviteCode: '123456',
  },{
  GID:2,
  GroupName: '测试',
  GroupTask: '',
  UID: 1,
  CreatTime: 0,
  InviteCode: '1234567',
  },{
  GID:3,
  GroupName: '测试',
  GroupTask: '',
  UID: 1,
  CreatTime: 0,
  InviteCode: '12345678',
  }],
  count: 3,
  page: 1,
  limit: 20,
  UID: '',

  get(showInfo = false) {
    let params = {
      Page: group.value.page - 1,
      Limit: group.value.limit,
    };
    _GetGroupList(params)
      .then((data: any) => {
        // console.log(data)
        group.value.groupList = data.Groups;
        group.value.count = data.Groups.length||0;
        // for (let index = 0; index < problemLists.value.problemLists.length; index++) {
        //   problemLists.value.problemLists[index].Selected = false;
        // }
        // showInfo=true
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${group.value.count} 个小组`,
          })
        }
      })
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) group.value.page = page;
  },

  delete(GID:number) {
    // console.log(GID)
    let params = {
      GID:GID ,
    };
    // if (GID == undefined) {
    //   let list = getSelectedList();
    //   params.LIDs = list;
    //   if (list.length == 0) {
    //     push.warning({
    //       title: '操作不合法',
    //       message: '尚未选择任何题目，无法删除',
    //     })
    //     return;
    //   }
    // } else {
    //   params.LIDs.push(LID);
    // }
    _DelGroup(params)
      .then(() => {
        group.value.get();
        // switchAllSelectedStatus(false);
        push.success({
          title: '提示',
          message: `删除成功`,
        });
      })
  }

})

let groupadd = ref({
  GID: 1,
  GroupName: '',
  GroupTask: '',
  UID: 1,
  CreatTime: 0,
  InviteCode: '',

  add() {
    // console.log(this.GroupName)
    if (group.value.GroupName == '') {
      push.error({
        title: '信息错误',
        message: '请填写完整信息',
      })
      return;
    }
    let params: any = {
      GroupName: this.GroupName,
    }

    _AddGroup(params)
      .then((data: any) => {
        // console.log(data)
        this.GID = data.GID;
        push.success({
          title: '新增成功',
          message: `小组 ID 为 ${data.GID}`,
        });
        group.value.get(true);
      })
  }
});
function showAddUserModal() {
 groupadd.value.GroupName="";
  // @ts-ignore
  addUserModal.showModal();
}

onMounted(() => {
  group.value.get(true);
})

watch(() => group.value.page, () => {
  group.value.get();
  allSelected.value = false;
})

const maxPage = computed(() => Math.ceil(group.value.count / group.value.limit));

</script>