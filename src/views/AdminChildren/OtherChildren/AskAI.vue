<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'AdminOss' })">
          <memory-one theme="outline" size="18" />
          OSS
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'AdminUpdateLog' })">
          <notepad theme="outline" size="18" />
          更新日志
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <smart-optimization theme="outline" size="18" />
          AskAI
        </div>
      </li>
    </ul>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th v-for="(item, index) in ['模型名称', '开放状态', '操作']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in availableModels.Models" :key="item.PID">
          <td>
            <div class="font-bold talbe-lg">{{ item.ModelType }}</div>
          </td>
          <td>
            <div class="text-sm font-bold" :class="{'text-green-600': item.Available, 'text-gray-600': !item.Available}">{{ item.Available ? '开放' : '关闭' }}</div>
          </td>
          <td class="space-x-2">
            <button class="btn btn-sm btn-neutral" @click="availableModels.edit(index)">
              <icon-switch theme="outline" size="18" />
              切换状态
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { onMounted, reactive } from 'vue';

import { Switch as IconSwitch, MemoryOne, Notepad, SmartOptimization } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _addUpdateLog, _deleteUpdateLog, _getNoticeList } from '@/apis/oj';
import { _getModelList, _switchModelAccess } from '@/apis/askai';
import { ModelList } from '@/interfaces/askai';

let availableModels = reactive<ModelList>({
  Count: 0,
  Models: [],
  ChoosenModel: 0,

  get() {
    _getModelList({})
      .then((data: any) => {
        this.Models = data.ChatList;
        this.Count = this.Models.length;
      })
  },

  edit(ID: number) {
    let params = {
      ModelType: this.Models[ID].ModelType,
      Available: !this.Models[ID].Available,
    };
    _switchModelAccess(params)
      .then(() => {
        this.get();
        push.success({
          title: '修改成功',
        })
      })
  },
});

onMounted(() => {
  availableModels.get();
})

</script>