<template>
  <div class="flex flex-col lg:flex-row h-screen w-full">
    <NavBar />
    <div class="overflow-y-auto w-full" v-auto-animate>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="Admin">
import NavBar from '@/components/Admin/NavBar.vue';

</script>