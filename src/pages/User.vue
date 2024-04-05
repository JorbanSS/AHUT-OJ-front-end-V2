<template>
  <div class="flex space-x-6">
    <div class="shadow-lg bg-white p-6 Border card h-fit w-80">
      <div>
        <img :src="'/resource' + user.HeadURL.slice(6)" class="" />
      </div>
    </div>
    <div class="shadow-lg bg-white p-6 Border card h-fit">

    </div>
  </div>
</template>

<script lang="ts" setup name="User">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { type UserType } from '@/type/user';
import { push } from 'notivue';

import { useConstValStore } from '@/store/ConstVal';
import { _getUserInfo } from '@/api/user';

const router = useRouter();
const route = useRoute();
const constValStore = useConstValStore();

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