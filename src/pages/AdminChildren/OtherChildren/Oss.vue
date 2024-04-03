<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <memory-one theme="outline" size="18" />
          OSS
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="">
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
  <div class="card bg-white Border shadow-lg max-w-5xl mx-auto pb-4">
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr>
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <th>2</th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <th>3</th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="p-3 bg-base-200"></div>
</template>

<script lang="ts" setup name="AdminUser">
import { DeleteOne, EditOne, Add, MemoryOne, FolderMinus, FolderPlus, FileAddition, FileFailed } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRoute, useRouter } from 'vue-router';
import { } from '@/type';
import { list } from 'postcss';

const router = useRouter();
const route = useRoute();

</script>

<style scoped></style>