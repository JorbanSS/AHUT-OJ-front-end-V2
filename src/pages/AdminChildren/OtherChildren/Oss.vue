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
        <thead>
          <tr>
            <th v-for="(item, index) in ['名称', '修改日期', '类型', '大小']">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in buckets.buckets" :key="index" >
            <th>{{ item.name }}</th>
            <td>{{ item.creationData }}</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
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
import { type BucketType, type BucketsType } from '@/type/oss';

const router = useRouter();
const route = useRoute();

const buckets = reactive<BucketsType>({
  buckets: [],

  getBuckets() {
    Get('oss/bucket', {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        console.log(data);
        buckets.buckets = data.Buckets;
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
  }
})

onMounted(() => {
  buckets.getBuckets();
})

</script>

<style scoped></style>