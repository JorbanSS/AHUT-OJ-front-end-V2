<template>

  <MainContainer>

    <PageHeader Title="比赛" :IconName="Trophy"
      :Infomation="`收录了共 ${contests.count} 场比赛，以供 ACM 新生选拔赛、ACM 集训队选拔赛、程序设计赛竞赛公选课使用。`">
    </PageHeader>

    <Card class="p-0 overflow-hidden">

      <Col>

        <table class="table table-zebra table-pin-rows">
          <thead>
            <tr>
              <template v-for="[title, style] in [
                ['状态', 'hidden md:table-cell'],
                ['比赛号', 'hidden lg:table-cell'],
                ['比赛名称'],
                ['标签'],
                ['起止时间'],
                ['撰题人', 'hidden lg:table-cell']
              ]" :key="title">
                <th :class=style>{{ title }}</th>
              </template>
            </tr>
          </thead>
          <tbody v-auto-animate>
            <tr v-for="item in contests.contests" :key="item.CID" @click="item.Status && $router.push({
              name: 'Contest',
              params: {
                CID: item.CID,
              },
              query: {
                IsPublic: item.IsPublic,
                Title: item.Title,
                BeginTime: item.BeginTime,
                EndTime: item.EndTime,
                Type: item.Type,
              },
            })" :class="{ 'cursor-pointer': item.Status, 'cursor-not-allowed': !item.Status }">
              <td class="font-bold talbe-lg whitespace-nowrap hidden md:table-cell"
                :style="'color: ' + ContestStatus[item.Status].color">
                {{ ContestStatus[item.Status].title }}
              </td>
              <th class="hidden lg:table-cell">
                {{ item.CID }}
              </th>
              <td class="font-bold talbe-lg">
                <div>{{ item.Title }}</div>
              </td>
              <td class="space-y-0.5 [&_span]:badge [&_span]:mr-1 [&_span]:font-bold [&_span]:text-white">
                <span :style="item.Type == 1 ? 'background-color: #8F43AC;' : 'background-color: #E37E27;'">
                  {{ item.Type == 1 ? 'ICPC' : 'OI' }}
                </span>
                <span :style="item.IsPublic == 1 ? 'background-color: #21700E;' : 'background-color: #E44D3D;'">
                  {{ item.IsPublic == 1 ? '公开' : '加密' }}
                </span>
              </td>
              <td>
                {{ ConvertTools.PrintTime(item.BeginTime, 1) }}
                ~
                {{ ConvertTools.PrintTime(item.EndTime) }}
              </td>
              <td class="hidden lg:table-cell">
                <span class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="查看用户主页"
                  @click.stop="$router.push({
                    name: 'User',
                    params: {
                      UID: item.UID
                    }
                  })">
                  {{ item.UID }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <Pagination :page="contests.page" :maxPage="maxPage" :changePage="contests.changePage" class="pb-6" />

      </Col>

    </Card>

  </MainContainer>
  
</template>

<script lang="ts" setup name="Contests">
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { Trophy } from "@icon-park/vue-next";
import { push } from 'notivue';

import { _getContests } from '@/apis/contest';
import PageHeader from '@/components/Main/PageHeader.vue';
import Pagination from "@/components/Main/Pagination.vue";
import { type ContestSimplifiedType, type ContestsType } from '@/interfaces/contest';
import { ConvertTools, getServerTime } from '@/utils/globalFunctions';

let TimeNow = ref(0);

let ContestStatus: Array<{ title: string, color: string }> = [
  { title: '未开始', color: '#2C90D1' },
  { title: '进行中', color: 'green' },
  { title: '已结束', color: 'gray' },
];

let contests = reactive<ContestsType>({
  contests: Array<ContestSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 10,
  UID: '',
  searchInfo: {
    CID: '',
  },

  get(showInfo = false) {
    let params = {
      Page: contests.page - 1,
      Limit: contests.limit,
    };
    _getContests(params)
      .then((data: any) => {
        contests.count = data.Size;
        contests.contests = data.Data;
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${contests.count} 场比赛`,
          })
        }
        contests.setStatus();
      })
  },

  setStatus() {
    this.contests.forEach((item) => {
      if (item.EndTime < TimeNow.value) item.Status = 2;
      else if (item.BeginTime > TimeNow.value) item.Status = 0;
      else item.Status = 1;
    })
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) contests.page = page;
  },
})

function syncSeverTime() {
  getServerTime()
    .then((res: any) => {
      TimeNow.value = res;
      contests.get(true);
    })
}

onMounted(() => {
  syncSeverTime();
});

watch(() => contests.page, () => {
  syncSeverTime();
});

const maxPage = computed(() => Math.ceil(contests.count / contests.limit));

</script>