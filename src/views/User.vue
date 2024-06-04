<template>
  <div class="m-6 space-y-6 max-w-6xl mx-auto">
    <div class="card Border shadow-lg bg-white relative max-w-2xl mx-auto">
      <img class="cursor-no-focus absolute top-0 w-full h-full object-cover blur-2xl opacity-25 select-none"
        :src="getHeadURL(user.HeadURL)" alt="" draggable="false" />
      <div class="relative flex items-end">
        <div id="userImg" class="relative ml-6 mt-6 h-24 w-24 rounded-lg overflow-hidden">
          <img :src="getHeadURL(user.HeadURL)" class="select-none" draggable="false" />
        </div>
        <div class="ml-4">
          <div class="text-xl font-bold">
            {{ user.UserName }}
          </div>
          <div class="text-md text-gray-500">UID：{{ user.UID }}</div>
        </div>
        <div class="absolute right-6 h-full flex flex-col items-end justify-end font-bold">
          <div class="">AC:&nbsp;&nbsp;&nbsp;<span class="text-green-500">{{ user.Solved }}</span></div>
          <div class="">Submited:&nbsp;&nbsp;&nbsp;<span class="text-blue-500">{{ user.Submited }}</span>
          </div>
          <!-- <div class="rating">Rating:&nbsp;&nbsp;&nbsp;<span :style="getRatingColor(userInfo.Rating ? user.Rating : 0)">{{ userInfo.Rating ? userInfo.Rating : 0 }}</span></div> -->
        </div>
      </div>
      <div class="w-full py-6 pl-6 flex flex-col">
        <div>学校:&nbsp;{{ user.School }}</div>
        <div>专业:&nbsp;{{ user.Major }}</div>
        <div>班级:&nbsp;{{ user.Class }}</div>
        <div>邮箱:&nbsp;{{ user.Email }}</div>
      </div>
    </div>
    <div class="flex justify-center space-x-2" v-if="userDataStore.UID == user.UID">
      <ul class="menu rounded-box bg-white Border w-fit">
        <!-- <ul class="menu rounded-box bg-white Border w-fit lg:menu-horizontal "> -->
        <li>
          <div class="font-bold text-base" onclick="bindCodeforcesModal.showModal()">
            <ranking theme="outline" size="18" />
            绑定 Codeforces
          </div>
        </li>
        <li>
          <div class="font-bold text-base" onclick="bindNowcoderModal.showModal()">
            <cattle theme="outline" size="18" />
            绑定 Nowcoder
          </div>
        </li>
        <li>
          <div class="font-bold text-base" onclick="bindAtcoderModal.showModal()">
            <horse-zodiac theme="outline" size="18" />
            绑定 Atcoder
          </div>
        </li>
        <li>
          <div class="font-bold text-base" onclick="bindVirtualJudgeModal.showModal()">
            <emotion-happy theme="outline" size="18" />
            绑定 Virtual Judge
          </div>
        </li>
      </ul>
      <ul class="menu rounded-box bg-white Border">
        <!-- <ul class="menu rounded-box bg-white lg:menu-horizontal Border"> -->
        <li>
          <div class="font-bold text-base" onclick="editUserInfoModal.showModal()">
            <info theme="outline" size="18" />
            修改信息
          </div>
        </li>
        <li>
          <div class="font-bold text-base" onclick="editHeadImageModal.showModal()">
            <avatar theme="outline" size="18" />
            修改头像
          </div>
        </li>
        <li>
          <div class="font-bold text-base" onclick="editPasswordModal.showModal()">
            <key theme="outline" size="18" />
            修改密码
          </div>
        </li>
      </ul>
    </div>

  </div>
  <dialog id="bindCodeforcesModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">绑定 Codeforces</h3>
      <label class="input input-bordered flex items-center gap-2">
        用户名
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
  <dialog id="bindAtcoderModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">绑定 Atcoder</h3>
      <label class="input input-bordered flex items-center gap-2">
        用户名
        <input type="text" class="grow" v-model="atcoder.ID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="atcoder.Pass" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="atcoder.bind()">绑定</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="bindNowcoderModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">绑定 Nowcoder</h3>
      <label class="input input-bordered flex items-center gap-2">
        用户名
        <input type="text" class="grow" v-model="nowcoder.ID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="nowcoder.Pass" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="nowcoder.bind()">绑定</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="bindVirtualJudgeModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">绑定 Virtual Judge</h3>
      <label class="input input-bordered flex items-center gap-2">
        用户名
        <input type="text" class="grow" v-model="virtualJudge.ID" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="text" class="grow" placeholder="" v-model="virtualJudge.Pass" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="virtualJudge.bind()">绑定</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="editPasswordModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">修改密码</h3>
      <label class="input input-bordered flex items-center gap-2">
        旧密码
        <input type="text" class="grow" v-model="editPass.oldPass" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        新密码
        <input type="text" class="grow" placeholder="" v-model="editPass.newPass" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="editPass.bind()">修改</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="editHeadImageModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">修改头像</h3>
      <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept=".jpg,.jpeg,.png"
        @change="headImageChangeHandle" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="headImage.uploadHeadImage()">修改</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="editUserInfoModal" class="modal">
    <div class="modal-box space-y-2 w-96">
      <h3 class="font-bold text-lg mb-4">修改用户信息</h3>
      <label class="input input-bordered flex items-center gap-2">
        用户名
        <input type="text" class="grow" v-model="editUserInfo.userName" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        QQ
        <input type="text" class="grow" v-model="editUserInfo.QQ" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        学校
        <input type="text" class="grow" v-model="editUserInfo.School" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        专业
        <input type="text" class="grow" v-model="editUserInfo.Major" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        班级
        <input type="text" class="grow" v-model="editUserInfo.Class" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        入学年份
        <input type="text" class="grow" v-model="editUserInfo.Year" />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="editUserInfo.edit()">修改</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="User">
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Avatar, Cattle, EmotionHappy, HorseZodiac, Info, Key, Ranking } from "@icon-park/vue-next";
import { push } from 'notivue';

import { _bindAtcoder, _bindCodeforces, _bindNowcoder, _bindVirtualJudge, _editHeadUrl, _editPassword, _editUserInfo, _getUserInfo } from "@/apis/user";
import { ImageUploadType } from '@/interfaces/common';
import { type BindType, type UserType } from '@/interfaces/user';
import { useConstValStore } from '@/stores/ConstVal';
import { useUserDataStore } from '@/stores/UserData';
import { ImageUtils } from '@/utils/fileUtils';
import { getHeadURL } from '@/utils/globalFunctions';
import { OssUtils } from '@/utils/ossUtils';

const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();
const constValStore = useConstValStore();

let editPass = reactive({
  oldPass: '',
  newPass: '',

  bind() {
    if (this.oldPass == '' || this.newPass == '') {
      push.warning({
        title: "信息错误",
        message: "信息不完整",
      })
      this.oldPass = this.newPass = '';
      return;
    }
    let params = {
      OldPwd: this.oldPass,
      Pwd: this.newPass,
    };
    this.oldPass = this.newPass = '';
    _editPassword(params)
      .then(() => {
        push.success({
          title: "修改成功",
        })
      })
  },
});

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
    _bindCodeforces(params)
      .then(() => {
        push.success({
          title: "绑定成功",
        })
      })
  },
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
      NowcoderUser: this.ID,
      NowcoderPass: this.Pass,
    };
    this.ID = this.Pass = '';
    _bindNowcoder(params)
      .then(() => {
        push.success({
          title: "绑定成功",
        })
      })
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
      AtcoderUser: this.ID,
      AtcoderPass: this.Pass,
    };
    this.ID = this.Pass = '';
    _bindAtcoder(params)
      .then(() => {
        push.success({
          title: "绑定成功",
        })
      })
  },
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
    _bindVirtualJudge(params)
      .then(() => {
        push.success({
          title: "绑定成功",
        })
      })
  }
});

let user = reactive<UserType>({
  UID: '',
  UserName: '',
  Email: '',
  School: '',
  Major: '',
  Class: '',
  Year: '',
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
        user.Major = data.Major;
        user.Class = data.Classes;
        user.Year = data.Year;
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
      .then(() => {
        editUserInfo.QQ = this.QQ;
        editUserInfo.userName = this.UserName;
        editUserInfo.School = this.School;
        editUserInfo.Major = this.Major;
        editUserInfo.Class = this.Class;
        editUserInfo.Year = this.Year;
      })
  },
});

let headImage = reactive<ImageUploadType>({
  image: null,
  blob: new Blob,
  selectImage(image: File) {
    const allowedBannerTypes = ["image/jpg", "image/jpeg", "image/png"];
    this.image = image;
    if (allowedBannerTypes.includes(image.type) == false) {
      push.error({
        title: '图片格式错误',
        message: '请选择 jpg 或 png 格式的图片',
      })
      return;
    }
    push.success({
      title: '选择成功',
      message: '已选择',
    })
  },

  uploadHeadImage() {
    if (headImage.image == null) {
      push.warning({
        title: '请选择图片',
      })
      return;
    }
    if (ImageUtils.check(headImage.image) == false) return;
    ImageUtils.compress(headImage.image).
      then((res: any) => {
        headImage.blob = res;
        // @ts-ignore
        OssUtils.uploadHeadImage(res, user.UID)
          .then((res: any) => {
            let headUrl = res;
            let params = {
              HeadPath: headUrl,
            }
            _editHeadUrl(params)
              .then(() => {
                user.get();
                push.success({
                  title: '上传成功',
                  message: '头像已上传',
                })
              })
          })
      })
  }
})

const headImageChangeHandle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // bannerImageInput.value = target.files[0];
    headImage.selectImage(target.files[0]);
  }
};

let editUserInfo = reactive({
  userName: '',
  QQ: '',
  School: '',
  Major: '',
  Class: '',
  Year: '',

  edit() {
    let params: any = {};
    if (this.userName != '') params.userName = this.userName;
    if (this.QQ != '') params.QQ = this.QQ;
    if (this.School != '') params.School = this.School;
    if (this.Major != '') params.Major = this.Major;
    if (this.Class != '') params.Class = this.Class;
    if (this.Year != '') params.Year = this.Year;
    _editUserInfo(params)
      .then(() => {
        push.success({
          title: "修改成功",
        })
        user.get();
      })
  },
})

onMounted(() => {
  if (typeof route.params.UID == 'string') user.UID = route.params.UID;
  user.get();
})

watch(() => route.params.UID, () => {
  user.UID = route.params.UID as string;
  user.get();
})

</script>

<style scoped></style>