<template>
  <div class="py-6 flex justify-center space-x-2">
    <NavBar class="" />
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base">
          <afferent-three theme="outline" size="18" />
          导入题目
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { AfferentThree } from '@icon-park/vue-next';
</script>

<style scoped></style>