<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <memory-one theme="outline" size="18" />
          OSS 对象存储
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li v-if="browserMode == constValStore.OSS_BROWSER_MODE_FOLDER">
        <div class="font-bold text-base" onclick="addBucketModal.showModal()">
          <folder-plus theme="outline" size="18" />
          新建文件夹
        </div>
      </li>
      <li v-else>
        <div class="font-bold text-base" @click="uploadObjectsInput.upload()">
          <file-addition theme="outline" size="18" />
          上传文件
        </div>
      </li>
    </ul>
  </div>
  <div v-if="browserMode == constValStore.OSS_BROWSER_MODE_FILE" class="max-w-5xl mx-auto">
    <div class="card bg-white shadow-lg Border p-6">
      <div class="join">
        <label class="input input-bordered flex items-center gap-2 join-item">
          <span class="whitespace-nowrap">前缀</span>
          <input type="text" class="grow w-72" v-model="objects.prefix" />
        </label>
        <select class="select select-bordered join-item w-fit" v-model="objects.prefix">
          <option v-for="item in objectTypeOptions" :value="item.value" :key="item.value">
            {{ item.label }}
          </option>
        </select>
        <button class="btn join-item btn-neutral" @click="objects.get(objects.bucket, objects.prefix, true)">搜索</button>
      </div>
      <div class="m-3"></div>
      <input type="file" class="file-input file-input-bordered w-full max-w-xs" multiple ref="ObjectInput"
        @change="ObjectInputChangeHandle" />
    </div>
    <div class="mt-6"></div>
  </div>
  <div class="card bg-white Border shadow-lg max-w-5xl mx-auto" style="max-height: calc(100vh - 124px - 108px)">
    <div class="overflow-x-auto rounded-2xl">
      <table class="table table-zebra table-fixed table-pin-rows text-center"
        v-if="browserMode == constValStore.OSS_BROWSER_MODE_FOLDER">
        <thead>
          <tr>
            <th>
              名称
            </th>
            <th class="w-60">
              修改日期
            </th>
            <th class="w-32">
              类型
            </th>
            <th class="w-28">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in buckets.buckets" :key="index" @click="enterFolder(item.name)"
            class="cursor-pointer">
            <th class="flex space-x-2" style="align-items: center;">
              <folder-open theme="outline" size="18" class="pt-1" />
              <span class="pt-1">{{ item.name }}</span>
            </th>
            <td>{{ item.creationDate }}</td>
            <td>
              文件夹
            </td>
            <td>
              <button class="btn btn-sm btn-neutral" @click.stop="buckets.delete(item.name)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table table-zebra table-fixed table-pin-rows text-center" v-else>
        <thead>
          <tr>
            <th>
              名称
            </th>
            <th class="w-60">
              修改日期
            </th>
            <th class="w-32">
              类型
            </th>
            <th class="w-28">
              大小
            </th>
            <th class="w-28">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          <tr @click="backToFolder()" class="cursor-pointer text-left">
            <td v-for="(item, index) in ['返回上一级目录', '', '', '', '']" :key="index">
              {{ item }}
            </td>
          </tr>
          <tr v-for="(item, index) in objects.objects" :key="index">
            <th class="flex space-x-2 align-middle">
              <picture-one theme="outline" size="18" v-if="objects.isImage(item.name)" class="pt-1" />
              <file-question theme="outline" size="18" v-else class="pt-1" />
              <span class="Nowarp pt-1">{{ item.name }}</span>
            </th>
            <td>{{ item.lastModified }}</td>
            <td>
              <span v-if="objects.isImage(item.name)">
                图片
              </span>
              <span v-else>
                未知文件
              </span>
            </td>
            <td>
              <div v-if="Math.round(item.size / 1024 / 1024) > 1">
                {{ (item.size / 1024 / 1024).toFixed(2) }} MB
              </div>
              <div v-else>
                {{ (item.size / 1024).toFixed(2) }} KB
              </div>
            </td>
            <td>
              <button class="btn btn-sm btn-neutral" @click.stop="objects.delete(objects.bucket, item.name)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="p-3 bg-base-200"></div>
  <dialog id="addBucketModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">新建文件夹</h3>
      <label class="input input-bordered flex items-center gap-2">
        文件夹名
        <input type="text" class="grow" v-model="BucketName" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2" @click="clearBucketName()">取消</button>
          <button class="btn btn-neutral" @click="buckets.add(BucketName)">确认新增</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="AdminUser">
import { FolderOpen, MemoryOne, FolderPlus, FileAddition, FileQuestion, PictureOne } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch } from 'vue';
import { push } from 'notivue';
import { useRoute, useRouter } from 'vue-router';
import { useConstValStore } from '@/store/ConstVal';
import { objectTypeOptions } from "@/config";

import { type ObjectsType, type BucketsType, type uploadObjectType } from '@/type/oss';
import { _getBuckets, _getObjects, _addBuckets, _deleteBucket, _deleteObject } from '@/api/oss';
import { OssUtils } from '@/utils/ossUtils';

const constValStore = useConstValStore();
const router = useRouter();
const route = useRoute();

let BucketName = ref<string>('');
let ObjectName = ref<string>('');
let ObjectInput = ref<File | null>(null);

function clearBucketName() {
  BucketName.value = '';
}

function clearObjectName() {
  ObjectName.value = '';
}

interface UploadFilesInputType {
  files: FileList | null,
  [item: string]: any,
}

let uploadObjectsInput = reactive<UploadFilesInputType>({
  files: null,

  select(files: FileList) {
    Array.from(files).forEach((file: any) => {
      if (objects.objects) {
        objects.objects.forEach((file2: any) => {
          if (file.name == file2.FileName) {
            push.warning({
              title: '文件名重复',
              message: `${file.name} 已存在，上传将会覆盖原文件`,
            })
          }
        })
      }
    })
    uploadObjectsInput.files = files;
    push.success({
      title: '选择成功',
    })
  },

  upload() {
    if (uploadObjectsInput.files == null || uploadObjectsInput.files.length == 0) {
      push.warning({
        title: '未选择文件',
      })
      return;
    }
    Array.from(uploadObjectsInput.files).forEach((file: any) => {
      OssUtils.uploadObject(file, objects.bucket, file.name)
        .then(() => {
          push.success({
            title: '上传成功',
            message: `${file.name}`,
          })
        })
        .then(() => {
          if (uploadObjectsInput.files && file.name == uploadObjectsInput.files[uploadObjectsInput.files.length - 1].name) {
            objects.get(objects.bucket);
          }
        })
    })
    push.success({
      title: '上传成功',
      message: `上传了 ${uploadObjectsInput.files.length} 个文件`,
    });
  },
});

const ObjectInputChangeHandle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadObjectsInput.select(target.files);
  }
};

// const ObjectInputChangeHandle = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   if (target.files && target.files.length > 0) {
//     ObjectInput.value = target.files[0];
//     uploadObject.select(target.files[0]);
//   }
// };

let browserMode = ref<number>(constValStore.OSS_BROWSER_MODE_FOLDER);

function backToFolder() {
  buckets.get();
  browserMode.value = constValStore.OSS_BROWSER_MODE_FOLDER;
}

function simplifyTime(time: string) {
  time = time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
  return time;
}

let buckets = reactive<BucketsType>({
  buckets: [],

  get(showInfo = false) {
    _getBuckets({})
      .then((data: any) => {
        this.buckets = data.Buckets;
        for (let i = 0; i < this.buckets.length; i++) {
          this.buckets[i].creationDate = simplifyTime(this.buckets[i].creationDate);
        }
        if (showInfo) {
          push.success({
            title: "获取成功",
            message: `一共获取了 ${this.buckets.length} 个文件夹`,
          });
        }
        browserMode.value = constValStore.OSS_BROWSER_MODE_FOLDER;
      })
  },

  add(bucketName: string) {
    if (bucketName == "") {
      push.warning({
        title: "数据错误",
        message: "文件夹名不能为空",
      });
      return;
    }
    let params = {
      BucketName: bucketName,
    };
    clearBucketName();
    _addBuckets(params)
      .then(() => {
        push.success({
          title: "新建成功",
          message: `已新建文件夹 ${bucketName}`,
        })
        this.get();
      })
  },

  delete(bucketName: string) {
    let params = {
      BucketName: bucketName,
    };
    _deleteBucket(params)
      .then(() => {
        push.success({
          title: "删除成功",
          message: `${bucketName}`,
        })
        this.get();
      })
  },
});

let objects = reactive<ObjectsType>({
  bucket: '',
  prefix: '',
  objects: [],

  get(bucket: string, prefix: string, showInfo = false) {
    let params = {
      Prefix: prefix,
    };
    _getObjects(params, bucket)
      .then((data: any) => {
        this.objects = data.ObjectInfo;
        if (data.ObjectInfo == null) {
          push.success({
            title: "获取成功",
            message: `文件夹下为空`,
          });
          browserMode.value = constValStore.OSS_BROWSER_MODE_FILE;
          return;
        }
        for (let i = 0; i < this.objects.length; i++) {
          this.objects[i].lastModified = simplifyTime(this.objects[i].lastModified);
        }
        if (showInfo) {
          push.success({
            title: "获取成功",
            message: `一共获取了 ${this.objects.length} 个文件`,
          });
        }
        browserMode.value = constValStore.OSS_BROWSER_MODE_FILE;
      })
  },

  isImage(fileName: string): boolean {
    return fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
  },

  delete(bucketName: string, objectName: string) {
    let params = {
      BucketName: bucketName,
      ObjectName: objectName,
    };
    _deleteObject(params)
      .then(() => {
        push.success({
          title: "删除成功",
          message: `${objectName}`,
        })
        this.get(this.bucket);
      })
  },

  add() {

  },
});

function enterFolder(bucketName: string) {
  objects.get(bucketName, '', true);
  objects.bucket = bucketName;
}

onMounted(() => {
  buckets.get(true);
  browserMode.value = constValStore.OSS_BROWSER_MODE_FOLDER;
})

</script>

<style scoped></style>