<template>
  <div class="flex space-x-6">
    <div class="shadow-lg bg-white p-6 Border card h-fit w-80">
      <div>
        <img :src="BaseURL + '/resource' + user.HeadURL.slice(6)" class="" />
      </div>
    </div>
    <div class="shadow-lg bg-white p-6 Border card h-fit">

    </div>
  </div>
</template>

<script lang="ts" setup name="User">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { type UserType } from '@/type';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { BaseURL } from '@/config';

const router = useRouter();
const route = useRoute();

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

  init() {
    this.getUserInfo();
  },

  getUserInfo() {
    Get('api/user/info', {
      UID: user.UID,
    })
      .then((res: any) => {
        let data = res.data;
        if (data.Code == 0) {
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

        } else {
          push.error({
            title: `Error: ${data.Code}`,
            message: `${data.Msg}`,
          })
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
  },
});

function syncUrl() {
  if (typeof route.params.UID == 'string') {
    user.UID = route.params.UID;
  }
}

onMounted(() => {
  syncUrl();
  user.init();
})

</script>

<style scoped></style>