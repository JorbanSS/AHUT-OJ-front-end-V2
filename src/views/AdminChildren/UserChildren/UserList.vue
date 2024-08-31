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
        <div class="font-bold text-base btn-active">
          <peoples theme="outline" size="18" />
          用户列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'ImportUsers' })">
          <afferent-three theme="outline" size="18" />
          导入
        </div>
      </li>
    </ul>
    <!-- <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
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
    </ul> -->

  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import {
  AfferentThree,
  Peoples,
  PeopleSafe,
} from "@icon-park/vue-next";
</script>