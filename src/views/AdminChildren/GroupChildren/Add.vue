<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'GroupList' })">
          <document-folder theme="outline" size="18" />
          小组列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <add theme="outline" size="18" />
          新增小组
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="group.add()">
          <add theme="outline" size="18" />
          确认新增
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      小组名称
      <input type="text" class="grow" placeholder="" v-model="group.GroupName">
    </label>
  </div>

</template>

<script lang="ts" setup name="AddProblem">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Add, Disk, DocumentFolder, StopwatchStart } from '@icon-park/vue-next';
import 'md-editor-v3/lib/style.css';
import { push } from 'notivue';
import { _AddGroup } from '@/apis/group';
import { useUserDataStore } from '@/stores/UserData'
const router = useRouter();
const userDataStore = useUserDataStore();
let group = ref({
  GID: '',
  GroupName: '',
  GroupTask: '',
  UID: userDataStore.UID,
  CreatTime: 0,
  InviteCode: 0,

  add() {
    if (group.value.GroupName == '') {
      push.error({
        title: '信息错误',
        message: '请填写完整信息',
      })
      return;
    }
    let params: any = {
      GroupName: this.GroupName,
      UID: this.UID
    }

    _AddGroup(params)
      .then((data: any) => {
        this.GID = data.PID;
        push.success({
          title: '新增成功',
          message: `小组 ID 为 ${data.PID}`,
        });
      })
  }
});

</script>