<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="card Border bg-white shadow-lg p-6 h-fit">
      <div class="space-y-4">
        <label class="input input-bordered flex items-center gap-2">
          UID
          <input type="text" class="grow" placeholder="" v-model="registerInfo.UID" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          姓名
          <input type="text" class="grow" placeholder="" v-model="registerInfo.UserName" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          入学年份
          <input type="text" class="grow" placeholder="" v-model="registerInfo.Year" />
        </label>
        <button class="btn btn-neutral w-full" @click="registerInfo.register">添加用户</button>
      </div>
    </div>
    <div class="card Border bg-white shadow-lg p-6 h-fit">
      <div class="space-y-4">
        <label class="input input-bordered flex items-center gap-2">
          UID
          <input type="text" class="grow" placeholder="" v-model="bindInfo.UID" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          Codeforces ID
          <input type="text" class="grow" placeholder="" v-model="bindInfo.CodeforcesID" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          Nowcoder ID
          <input type="text" class="grow" placeholder="" v-model="bindInfo.NowcoderID" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          Atcoder ID
          <input type="text" class="grow" placeholder="" v-model="bindInfo.AtcoderID" />
        </label>
        <button class="btn btn-neutral w-full" @click="bindInfo.bind">绑定账户</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { push } from 'notivue';

import { _addUser, _bindAccount } from '@/api/user';
import { Validator } from '@/utils/globalFunctions';

const route = useRoute();

let registerInfo = reactive({
  UID: '',
  UserName: '',
  Year: '',

  register() {
    if (this.UID == '' || this.UserName == '' || this.Year == '') {
      push.warning({
        title: '数据错误',
        message: '未填写完整信息',
      })
      return;
    }
    if (Validator.UID(this.UID) == false) {
      push.warning({
        title: '数据错误',
        message: '用户 UID 格式错误，正确格式为：学校首字母大写+学号，例：AHUT229074001',
      });
      return;
    }
    if (Validator.UserName(this.UserName) == false) {
      push.warning({
        title: '数据错误',
        message: '请填写真实姓名',
      });
      return;
    }
    if (Validator.Year(this.Year) == false) {
      push.warning({
        title: '数据错误',
        message: '入学年份格式错误，参考格式为：2022',
      });
      return;
    }

    let params = {
      UID: this.UID,
      UserName: this.UserName,
      Year: this.Year,
    };
    _addUser(params)
      .then(() => {
        push.success({
          title: '添加成功',
          message: `已添加用户 ${this.UserName}`,
        })
      })
  },
})

let bindInfo = reactive({
  UID: '',
  CodeforcesID: '',
  NowcoderID: '',
  AtcoderID: '',

  bind() {
    if (this.UID == '' || this.CodeforcesID == '' && this.NowcoderID == '' && this.AtcoderID == '') {
      push.warning({
        title: '数据错误',
        message: 'UID 必填，其他平台 ID 至少填一项',
      })
      return;
    }
    let params: any = {
      UID: this.UID,
    };
    if (this.CodeforcesID != '') params.CodeforcesID = this.CodeforcesID;
    if (this.NowcoderID != '') params.NowcoderID = this.NowcoderID;
    if (this.AtcoderID != '') params.AtcoderID = this.AtcoderID;
    _bindAccount(params)
      .then(() => {
        push.success({
          title: '绑定成功',
          message: `已绑定用户 ${this.UID} 的相关账户`,
        })
      })
  },
})

onMounted(() => {

});

</script>