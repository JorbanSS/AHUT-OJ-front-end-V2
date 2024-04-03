<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active" @click="router.push('/admin/problem')">
          <memory-one theme="outline" size="18" />
          OSS
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base">
          <folder-plus theme="outline" size="18" />
          新建文件夹
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="">
          <folder-minus theme="outline" size="18" />
          删除文件夹
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="">
          <file-addition theme="outline" size="18" />
          上传文件
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="">
          <file-failed theme="outline" size="18" />
          删除文件
        </div>
      </li>
    </ul>
  </div>
  <div class="p-3 bg-base-200"></div>
</template>

<script lang="ts" setup name="AdminUser">
import { DeleteOne, EditOne, Add, MemoryOne, FolderMinus, FolderPlus, FileAddition, FileFailed } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { } from '@/type';
import { list } from 'postcss';

const router = useRouter();

</script>

<style scoped></style>