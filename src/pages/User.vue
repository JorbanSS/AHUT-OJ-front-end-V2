<template>
  <div class="max-w-6xl">
    <div class="hero bg-base-200">
      <div class="hero-content flex-col lg:flex-row">
        <div class="avatar">
          <div class="w-36 rounded-xl">
            <img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="Boder bg-white max-w-6xl p-4 flex rounded-2xl shadow-lg">
    <div class="avatar">
      <div class="w-36 rounded-xl">
        <img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" />
      </div>
    </div>
  </div> -->
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white Border w-fit lg:menu-horizontal ">
      <li>
        <div class="font-bold text-base" onclick="bindCodeforcesModal.showModal()">
          <ranking theme="outline" size="18" />
          绑定 Codeforces
        </div>
      </li>
      <li>
        <div class="font-bold text-base">
          <cattle theme="outline" size="18" />
          绑定 Nowcoder
        </div>
      </li>
      <li>
        <div class="font-bold text-base">
          <horse-zodiac theme="outline" size="18" />
          绑定 Atcoder
        </div>
      </li>
      <li>
        <div class="font-bold text-base">
          <emotion-happy theme="outline" size="18" />
          绑定 Virtual Judge
        </div>
      </li>
    </ul>
    <!-- <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="">
          <add theme="outline" size="18" />
          确认新增
        </div>
      </li>
    </ul> -->
  </div>
  <dialog id="bindCodeforcesModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">绑定 Codeforces</h3>
      <label class="input input-bordered flex items-center gap-2">
        账号
        <input type="text" class="grow" v-model="codeforces.ID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="codeforces.Pass" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="codeforces.bind()">绑定</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="User">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { type UserType, type BindType } from '@/type/user';
import { push } from 'notivue';
import { Ranking, Cattle, HorseZodiac, EmotionHappy } from "@icon-park/vue-next";

import { useConstValStore } from '@/store/ConstVal';
import { _getUserInfo } from '@/api/user';

const router = useRouter();
const route = useRoute();
const constValStore = useConstValStore();

let codeforces = reactive<BindType>({
  ID: '',
  Pass: '',

  bind() {
    if (this.ID == '' || this.Pass == '') {
      push.warning({
        title: "信息错误",
        message: "请输入账号和密码",
      })
      this.ID = this.Pass = '';
      return;
    }
    let params = {
      CodeForceUser: this.ID,
      CodeForcePass: this.Pass,
    };
    this.ID = this.Pass = '';
    
  }
});

let nowcoder = reactive({
  ID: '',
  Pass: '',

  bind() {
    if (this.ID == '' || this.Pass == '') {
      push.warning({
        title: "信息错误",
        message: "请输入账号和密码",
      })
      this.ID = this.Pass = '';
      return;
    }
    let params = {
      CodeForceUser: this.ID,
      CodeForcePass: this.Pass,
    };
    this.ID = this.Pass = '';
  }
});

let atcoder = reactive({
  ID: '',
  Pass: '',

  bind() {
    if (this.ID == '' || this.Pass == '') {
      push.warning({
        title: "信息错误",
        message: "请输入账号和密码",
      })
      this.ID = this.Pass = '';
      return;
    }
    let params = {
      CodeForceUser: this.ID,
      CodeForcePass: this.Pass,
    };
    this.ID = this.Pass = '';
  }
});

let virtualJudge = reactive({
  ID: '',
  Pass: '',

  bind() {
    if (this.ID == '' || this.Pass == '') {
      push.warning({
        title: "信息错误",
        message: "请输入账号和密码",
      })
      this.ID = this.Pass = '';
      return;
    }
    let params = {
      CodeForceUser: this.ID,
      CodeForcePass: this.Pass,
    };
    this.ID = this.Pass = '';
  }
});

let user = reactive<UserType>({
  UID: '',
  UserName: '',
  Email: '',
  School: '',
  QQ: '',
  RegisterTime: 0,
  HeadURL: '',

  Rating: 0,
  Submited: 0,
  Solved: 0,

  CodeForceUser: '',
  CodeforceScore: 0,
  AtcoderUser: '',
  AtcoderScore: 0,
  NowCoderUser: '',
  NowCoderScore: 0,

  PermissionMap: 0,

  get() {
    let params = {
      UID: user.UID,
    };
    _getUserInfo(params)
      .then((data: any) => {
        user.UID = data.UID;
        user.UserName = data.UserName;
        user.Email = data.Email;
        user.School = data.School;
        user.QQ = data.QQ;
        user.RegisterTime = data.RegisterTime;
        user.HeadURL = data.HeadURL;

        user.Rating = data.Rating;
        user.Submited = data.Submited;
        user.Solved = data.Solved;

        user.CodeForceUser = data.CodeForceUser;
        user.CodeforceScore = data.CodeforceScore;
        user.AtcoderUser = data.AtcoderUser;
        user.AtcoderScore = data.AtcoderScore;
        user.NowCoderUser = data.NowCoderUser;
        user.NowCoderScore = data.NowCoderScore;

        user.PermissionMap = data.PermissionMap;
      })
  },
  // getUserHead(){
  //   Post('oss/get',{
  //     GetObjectType:constValStore.OSS_OBJECT_BASE64,
  //     BucketName:"ahutoj",
  //     ObjectName:"UID_"+user.UID+"_head.jpg"
  //   }
  //   )
  // }
});

onMounted(() => {
  if (typeof route.params.UID == 'string') user.UID = route.params.UID;
  user.get();
})

</script>

<style scoped></style>