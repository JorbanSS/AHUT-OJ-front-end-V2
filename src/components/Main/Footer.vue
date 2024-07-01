<template>
  <div class="p-4 bg-white">
    <div class="flex justify-between max-w-6xl mx-auto">
      <p>AHUT OJ © 2022 - 2024 All rights reserved.</p>
      <div class="flex items-center">
        <p @click="$router.push({ name: 'About' })" class="relative cursor-pointer hover:text-blue-600">
          关于
        </p>
        <template v-if="userDataStore.isLogin">
          <span class="text-gray-500 mx-2">|</span>
          <p @click="$router.push({ name: 'User', params: { UID: userDataStore.UID } })"
            class="cursor-pointer hover:text-blue-400">
            个人中心
          </p>
        </template>
        <template v-if="userDataStore.isLogin && userDataStore.PermissionMap > 3">
          <span class="text-gray-500 mx-2">|</span>
          <p @click="$router.push({ name: 'Admin', params: { UID: userDataStore.UID } })"
            class="cursor-pointer hover:text-blue-400">
            管理平台
          </p>
        </template>
      </div>
    </div>
  </div>
  <!-- <footer class="footer p-10 bg-white text-base-content">
    <aside>
      <img src="@/assets/img/icon.png" class="rounded-full w-16 h-16" />
      <p>AHUT OJ V2<br>Providing reliable tech since 2019</p>
    </aside>
    <nav>
      <h6 class="footer-title">Services</h6>
      <a class="link link-hover">Branding</a>
      <a class="link link-hover">Design</a>
    </nav>
    <nav>
      <h6 class="footer-title">Company</h6>
      <a class="link link-hover">About us</a>
      <a class="link link-hover">Contact</a>
    </nav>
    <nav>
      <h6 class="footer-title">Legal</h6>
      <a class="link link-hover">Terms of use</a>
      <a class="link link-hover">Privacy policy</a>
      <a class="link link-hover">Cookie policy</a>
    </nav>
  </footer> -->
</template>

<script lang="ts" setup>
import { Info } from '@icon-park/vue-next';
import { useUserDataStore } from '@/stores/UserData';

const userDataStore = useUserDataStore();

</script>