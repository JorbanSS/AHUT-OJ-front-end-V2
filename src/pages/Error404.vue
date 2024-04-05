<template>
  <div style="height: calc(100vh - 172px);">
    <div class="hero h-full bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">404 Not Found</h1>
          <p class="py-6">Oops, 你请求的路径不存在或已迁移</p>
          <button class="btn btn-primary" @click="router.push('/')" >返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Error404">
import { useRouter } from "vue-router";
const router = useRouter();
</script>