<template>
  <MainContainer>
    <PageHeader :Title="contest.Title" :IconName="Trophy" Infomation="">
      <div class="flex flex-col gap-3">
        <div
          class="flex flex-row gap-2 justify-between text-sm font-bold text-gray-600"
        >
          <span>
            {{ ConvertTools.PrintTime(contest.BeginTime, 1, 1) }}
          </span>
          <div
            class="[&_span]:badge [&_span]:mr-1 [&_span]:font-bold [&_span]:text-white"
          >
            <span
              :style="
                contest.Type == 1
                  ? 'background-color: #8F43AC;'
                  : 'background-color: #E37E27;'
              "
            >
              {{ contest.Type == 1 ? "ICPC" : "OI" }}
            </span>
            <span
              :style="
                contest.IsPublic == 1
                  ? 'background-color: #21700E;'
                  : 'background-color: #E44D3D;'
              "
            >
              {{ contest.IsPublic == 1 ? "公开" : "加密" }}
            </span>
          </div>
          <span>
            {{
              contest.EndTime > contest.TimeNow
                ? "还剩 " +
                  ConvertTools.PrintTimeInterval(
                    ConvertTools.TimeInterval(contest.TimeNow, contest.EndTime),
                    1
                  )
                : ConvertTools.PrintTime(contest.EndTime, 1, 1)
            }}
          </span>
        </div>
        <progress
          class="progress w-full"
          :value="
            ConvertTools.Percentage(
              Math.min(contest.Duration, TimeNow - contest.BeginTime),
              contest.Duration
            )
          "
          max="100"
        ></progress>
      </div>
    </PageHeader>

    <div v-if="contest.passwordVerified">
      <ul
        class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold justify-between w-full rounded-b-none"
      >
        <div class="flex flex-col sm:flex-row">
          <li v-for="item in contestNavItems" :key="item.title">
            <RouterLink
              :to="item.to"
              v-if="typeof item.to != 'undefined'"
              :class="{
                'btn-active':
                  route.path.split('/')[3].toLowerCase() ==
                  item.to.name.substring(7).toLowerCase(),
              }"
            >
              <component :is="item.icon" theme="outline" size="18" />
              {{ item.title }}
              <div class="badge badge-neutral" v-if="item.title == '记录'">
                {{ contest.RecordNumber }}
              </div>
            </RouterLink>
          </li>
        </div>
        <div
          class="flex flex-col sm:flex-row"
          v-if="userDataStore.PermissionMap & constValStore.ContestAdminBit"
        >
          <li>
            <a @click="contest.cloneToProblemList()">
              <bill theme="outline" size="18" />
              克隆为题单
            </a>
          </li>
          <li>
            <a>
              <party-balloon theme="outline" size="18" />
              气球提示
            </a>
          </li>
          <li>
            <a
              @click="
                $router.push({
                  name: 'EditContest',
                  params: {
                    CID: contest.CID,
                  },
                })
              "
            >
              <editor theme="outline" size="18" />
              比赛编辑
            </a>
          </li>
          <li>
            <a
              @click="
                $router.push({
                  name: 'MontorContest',
                  params: {
                    CID: contest.CID,
                  },
                })
              "
            >
              <camera-four theme="outline" size="18" />
              比赛监考
            </a>
          </li>
        </div>
      </ul>

      <RouterView :contest="contest" :problems="problems"></RouterView>
    </div>

    <PageHeader
      Title="验证密码"
      :IconName="Key"
      Infomation="当前比赛受密码保护，请输入密码"
      v-else
    >
      <div class="join flex justify-center">
        <input
          class="input input-bordered join-item"
          placeholder="比赛密码"
          v-model="contest.Pass"
        />
        <button class="btn join-item" @click="contest.verifyPassword()">
          提交
        </button>
      </div>
    </PageHeader>
  </MainContainer>
</template>

<script lang="ts" setup name="Contest">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  Bill,
  Editor,
  Key,
  PartyBalloon,
  Trophy,
  CameraFour,
} from "@icon-park/vue-next";
import { push } from "notivue";

import {
  _cloneToProblemList,
  _getContest,
  _getBaseContest,
} from "@/apis/contest";
import { _getRecords } from "@/apis/record";
import PageHeader from "@/components/Main/PageHeader.vue";
import { contestNavItems } from "@/config";
import { type ContestType } from "@/interfaces/contest";
import { useConstValStore } from "@/stores/ConstVal";
import { useUserDataStore } from "@/stores/UserData";
import { ConvertTools, getServerTime } from "@/utils/globalFunctions";

const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();

let TimeNow = ref(0);

let contest = reactive<ContestType>({
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: "",
  Duration: 0,
  Description: "",
  Problems: "",
  UID: "",
  Type: 0,
  Pass: "",
  Status: 0,

  RecordNumber: 0,
  passwordVerified: false,

  get(password: string = "") {
    let param: any = {};
    if (password != "") {
      param.Pass = password;
      this.Pass = password;
    }

    _getContest(param, this.CID).then((data: any) => {
      if (data.Code) return;

      this.Title = data.Title;
      this.BeginTime = data.BeginTime;
      this.EndTime = data.EndTime;
      this.Duration = ConvertTools.TimeInterval(this.BeginTime, this.EndTime);
      this.CID = data.CID;
      this.IsPublic = data.IsPublic;
      this.Description = data.Description;
      this.Problems = data.Data;
      this.Type = data.Type;
      problems.value = data.Data;

      this.passwordVerified = true;
    });
  },

  getRecordNumber() {
    let params = {
      CID: this.CID,
      Limit: 1,
    };
    _getRecords(params).then((data: any) => {
      this.RecordNumber = data.Count;
    });
  },

  cloneToProblemList() {
    let params = {
      CID: contest.CID,
      UID: userDataStore.UID,
    };
    _cloneToProblemList(params).then((data: any) => {
      let LID = data.LID;
      push.success({
        title: "克隆成功",
        message: `已克隆比赛 ${contest.CID}`,
      });
      router.push({
        name: "ProblemList",
        params: {
          LID: LID,
        },
      });
    });
  },

  verifyPassword() {
    if (this.Pass == "" || this.Pass == null) {
      push.warning({
        title: "密码不能为空",
      });
      return;
    }

    this.get(this.Pass);
  },
});

interface problemsType {
  PID: string;
  Title: string;
  SubmitNum: number;
  ACNum: number;
  Status: string;
  BalloonColor: string;
}

let problems = ref<Array<problemsType>>([]);

onMounted(() => {
  contest.CID = +route.params.CID;
  getServerTime().then((res: any) => {
    TimeNow.value = res;
  });
  // if (route.query.IsPublic == '1') {
  //   contest.get();
  // } else {
  //   contest.Title = route.query.Title as string;
  //   contest.Type = parseInt(route.query.Type as string);
  //   contest.BeginTime = parseInt(route.query.BeginTime as string);
  //   contest.EndTime = parseInt(route.query.EndTime as string);
  // }
  _getBaseContest(contest.CID).then((data: any) => {
    contest.IsPublic = data.IsPublic;
    if (data.IsPublic == 1 || userDataStore.PermissionMap > 3) {
      contest.passwordVerified = true; //TODO: 潜在的安全漏洞
      contest.get();
      contest.getRecordNumber();
    } else {
      contest.Title = data.Title;
      contest.Type = data.Type;
      contest.BeginTime = data.BeginTime;
      contest.EndTime = data.EndTime;
    }
    if (data.IsPublic != 1 && userDataStore.PermissionMap > 3) {
      push.success({
        title: "获取成功",
        message: "管理员免密码查看",
      });
    }
  });
});
</script>
