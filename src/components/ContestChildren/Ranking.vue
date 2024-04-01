<template>
  <div class="card bg-white Border shadow-lg overflow-x-auto"  style="height: calc(100vh - 124px - 48px)">
    <table class="table table-zebra table-pin-rows table-pin-cols table-fixed text-center">
      <thead>
        <tr>
          <th class="w-14" >place</th>
          <th class="w-32">Name</th>
          <th class="w-32">UID</th>
          <th class="w-14">Solved</th>
          <th v-for="(item, index1) in props.contest.problems" :key="index1">
            {{ ConvertTools.Number2Alpha(index1 + 1) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item1, index) in ranking.ranking" :key="index" >
          <th>{{ index + 1 }}</th>
          <td>{{ item1.Uname }}</td>
          <td>{{ item1.UserID }}</td>
          <td>{{ item1.ACNumber }}</td>
          <td v-for="(item2, index2) in item1.Problems" :key="index2" :class="{ 'bg-green-200': item2.Status == 'AC' }" >
            {{ item2.Status == "JUDGING" ? "" : item2.Status }}
            <div v-if="item2.SubmitNumber > 1">
              ({{ item2.SubmitNumber }})
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="ContestRank">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ContestType, type ContestRankingType } from '@/type';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/assets/ts/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { } from '@icon-park/vue-next';

const route = useRoute();
const router = useRouter();

interface propsType {
  contest?: ContestType;
};

let props = withDefaults(defineProps<propsType>(), {
  contest: () => ({
    CID: 0,
    BeginTime: 0,
    EndTime: 0,
    IsPublic: 0,
    Size: 0,
    Title: '',
    duration: 0,
    description: '',
    problems: '',
    UID: '',
    Type: 0,
    Pass: '',
  }),
});

let ranking = reactive<ContestRankingType>({
  count: 0,
  ranking: [],
})

function getContestRanking() {
  Get('api/contest/' + props.contest.CID + '/rank', {
    // Pass='',
    UseWs: false,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        ranking.count = data.Size;
        ranking.ranking = data.Data;
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

onMounted(() => {
  if (props.contest.CID == 0) {
    props.contest.CID = route.params.CID as unknown as number;
  }
  getContestRanking();
})

</script>

<style scoped></style>