<template>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'AdminList' })">
          <people-safe theme="outline" size="18" />
          管理员列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'UserList' })">
          <peoples theme="outline" size="18" />
          用户列表
        </div>
      </li>
    </ul>
  </div>
  
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <div class="p-6">
      <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th>
            <input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()" />
          </th>
          <th v-for="(item, index) in [
            '用户 ID',
            '用户名称',
            '超管',
            '题单',
            '资源',
            '比赛',
            '题目',
            '操作',
          ]" :key="index">
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
          <td class="space-x-2">
            <button class="btn btn-sm btn-neutral" @click="">
              <edit-two theme="outline" size="18" />
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

import {
  AfferentThree,
  Peoples,
  PeopleSafe,
} from "@icon-park/vue-next";

import { UserSimplifiedType } from "@/interfaces/user";

let users = reactive({
  users: new Array<UserSimplifiedType>(),
  
});

function parseFromExcel() {

}

onMounted(() => {
})

</script>