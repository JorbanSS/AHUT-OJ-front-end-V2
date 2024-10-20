<template>
  <MainContainer>
    <PageHeader :Title="notice.Title" :IconName="Remind" :Infomation="notice.Content">
      <span class="text-xs text-center" v-if="notice.UpdatedTime">
        {{ ConvertTools.PrintTime(notice.UpdatedTime, 1) }}
      </span>
    </PageHeader>

    <!-- 组任务 -->
    <Card class="p-6" v-if="groupTasksList.groupTasksList.length==0" style="text-align: center;">
        <Strong>暂无组任务</Strong>
    </Card>
    
    <Card class="p-6 overflow-auto h-[330px]" v-else style="text-align: center;">
      <Strong>小组任务</Strong>
      <VueDraggable ref="el" v-model="groupTasksList.groupTasksList" target=".sort-target" :animation="200" class="select-none">
        <table class="table table-zebra text-center">
          <thead>
            <tr>
              <th>序号</th>
              <th>名称</th>
              <th>组名称</th>
              <th>任务类型</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="sort-target">
            <tr v-for="(item, index) in groupTasksList.groupTasksList" :key="item.ID" class="cursor-pointer" v-auto-animate>
              <th class="w-32">
                {{ index + 1 }}
              </th>
              <td class="w-48">
                {{ item.Name }}
              </td>
              <td class="w-48">
                {{ item.GroupName }}
              </td>
              <td class="w-48" >
                {{ item.typestr[item.type-1]}}
              </td>
              <td class="flex justify-center space-x-2">
                <check v-if="isFinished(item.ID)&&isQuestion(item.type)" theme="multi-color" size="24" fill="#7ed321"/>
                <close v-else-if="!isFinished(item.ID)&&isQuestion(item.type)" theme="outline" size="24" fill="#d0021b"/>  
                <p v-else>请在详情页查看</p>  
              </td>
              <td class=" justify-center space-x-2">
                <button class="btn btn-neutral btn-sm" @click="task.gotoano(item.type,item.ID)">
                  <edit theme="outline" size="24"/>
                 详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </VueDraggable> 
    </Card>

    <Row direction="row" class="h-[440px]">
      <!-- 轮播图 -->
      <Card class="p-0 overflow-hidden w-3/5">
        <div class="carousel w-full h-full">
          <div class="carousel-item relative w-full" v-for="(item, index) in banners.banners" :key="index"
            :id="`slide${index}`">
            <img :src="'data:image/*;base64,' + item.ObjectData" class="w-full" alt="首页横幅" />
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a :href="`#slide${(index - 1 + banners.Count) % banners.Count}`" class="btn btn-circle">❮</a>
              <a :href="`#slide${(index + 1) % banners.Count}`" class="btn btn-circle">❯</a>
            </div>
          </div>
        </div>
      </Card>
      <!-- 轮播图 -->

      <!-- 更新日志 -->
      <Card class="w-2/5 overflow-auto p-6">
        <Col direction="column">
        <span class="text-xl font-bold">
          版本更新日志
        </span>
        <div>
          <div v-for="item in updateLogs.updateLogs" :key="item.ID">
            <div class="pb-4">
              <div class="flex items-center space-x-2">
                <span class="font-bold">
                  {{ item.Title.split(" Version=")[0] }}
                </span>
                <span v-if="item.Title.split('Version=').length > 1" class="text-white rounded-full px-2"
                  style="background-color: #19be6b">
                  {{ item.Title.split("Version=")[1] }}
                </span>
              </div>
              <div class="-mx-4 overflow-hidden">
                <MdPreview :editorId="'updateLogs' + item.ID.toString()" :modelValue="item.Content" preview-only />
              </div>
            </div>
          </div>
        </div>
        </Col>
      </Card>
      <!-- 更新日志 -->
    </Row>

  </MainContainer>

</template>

<script lang="ts" setup name="Home">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { _editProblemList, _getProblemList } from "@/apis/problemList";
import { Remind, Xigua ,Edit,Check,Close} from "@icon-park/vue-next";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { _getProblem } from '@/apis/problem';
import { _editContest, _getContest } from "@/apis/contest";
import { _GetGroupList ,_DelGroup,_GetGroup ,_GetTraceGroup } from '@/apis/group';
import { _getBanners, _getUpdateLogs } from "@/apis/oj";
import { useRoute, useRouter } from 'vue-router';
import {
  type BannersType,
  type HomeNoticeType,
  type UpdateLogsType,
} from "@/interfaces/oj";
import { ConvertTools } from "@/utils/globalFunctions";
import { useUserDataStore } from "@/stores/UserData";
import { useConstValStore } from "@/stores/ConstVal";
import PageHeader from "@/components/Main/PageHeader.vue";
import { push } from 'notivue';
import { _JoinGroup } from "@/apis/group";
import { GroupList, GroupTasksList } from "@/interfaces/group";
import { _getProblemLists } from "@/apis/problemList";

const userDataStore = useUserDataStore();
const constValStore = useConstValStore();
const router = useRouter();
  const route = useRoute();
  
let updateLogs = reactive<UpdateLogsType>({
  updateLogs: [],
  count: 0,
});

let notice = ref<HomeNoticeType>({
  Title: "公告",
  Content: "暂无",
  UpdatedTime: 0,
  CreatedTime: 0,
  UID: "",
});

let banners = reactive<BannersType>({
  banners: [],
  Count: 0,

  get() {
    _getBanners({})
      .then((data: any) => {
        banners.banners = data.Data;
        banners.Count = data.Count;
      });
  },
});

function getUpdateLogs() {
  _getUpdateLogs({})
    .then((data: any) => {
      updateLogs.updateLogs = data.Data;
      updateLogs.count = data.Count;
      if (updateLogs.updateLogs.filter((item) => item.ID == 0).length) {
        notice.value = updateLogs.updateLogs.filter((item) => item.ID == 0)[0];
      }
      updateLogs.updateLogs = updateLogs.updateLogs.filter(
        (item) => item.ID != 0
      );
    });
}


//小组
let NotHavingTask = ref(true)

let group = ref({
  groupList: [{
  GID:1,
  GroupName: '测试',
  GroupTask: '',
  UID: 1,
  CreatTime: 1111,
  InviteCode: '123456',
  }],
  count: 3,
  page: 1,
  limit: 20,
  UID: '',

  get() {
    let params = {
      Page: 0,
      Limit: -1,
    };
    _GetGroupList(params)
      .then((data: any) => {
        group.value.groupList = data.Groups;
        group.value.count = data.Groups.length||0;
        // for (let index = 0; index < problemLists.value.problemLists.length; index++) {
        //   problemLists.value.problemLists[index].Selected = false;
        // }
        // showInfo=true
        for(let x = 0;x<group.value.groupList.length;x++){
          _GetGroup({},group.value.groupList[x].GID)
        .then((data: any) => {
          // console.log(data)
          group.value.groupList[x].GroupName = data.GroupName
          group.value.groupList[x].GroupTask = data.GroupTask
          if(group.value.groupList[x].GroupTask!=""){
          let arr = group.value.groupList[x].GroupTask.split(";")
        if(arr.length > 0){
          let taskPIDList = ref([])
          let taskCIDList = ref([])
          let taskLIDList = ref([])
            arr.forEach((element:any) => {
              if(element.charAt(0)=='C')taskCIDList.value.push(+element.slice(1));
          else if(element.charAt(0)=='P'&&element.charAt(1)!='P')taskPIDList.value.push(element.slice(1));
          else if(element.charAt(0)=='L')taskLIDList.value.push(+element.slice(1));
          else taskPIDList.value.push(element.slice(1));
        });
        for(let i = 0;i<taskPIDList.value.length;i++){
        _getProblem({}, taskPIDList.value[i])
        .then((data: any) => {
          groupTasksList.value.groupTasksList.push(
          {
          type:1,
          ID:taskPIDList.value[i]+"",
          typestr:["题目","比赛","题单"],
          GID:group.value.groupList[x].GID,
          GroupName:group.value.groupList[x].GroupName,
          Name: data.Title,
          }
        )
      })
      }
      //查询小组任务中的所有题单
      for(let i =0;i<taskLIDList.value.length;i++){
        _getProblemList({}, taskLIDList.value[i])
      .then((data: any) => {
        groupTasksList.value.groupTasksList.push(
          {
          type:3,
          ID:taskLIDList.value[i]+"",
          typestr:["题目","比赛","题单"],
          GID:group.value.groupList[x].GID,
          GroupName:group.value.groupList[x].GroupName,
          Name: data.Title,
          }
        )
      })
      }

      //查询小组任务中的所有比赛
      for(let i =0;i<taskCIDList.value.length;i++){
        _getContest({}, taskCIDList.value[i])
      .then((data: any) => {
        console.log(data)
        groupTasksList.value.groupTasksList.push(
          {
          type:2,
          ID:taskCIDList.value[i]+"",
          typestr:["题目","比赛","题单"],
          GID:group.value.groupList[x].GID,
          GroupName:group.value.groupList[x].GroupName,
          Name: data.Title,
          }
        )
      })
      }



        }
          
        }
        }).then(()=>{
          getTrace()
        })
      }
           
        // console.log(group.value.groupList)       
        // task.value.getAllTasks();
        //是否有任务
        if(groupTasksList.value.length==0)NotHavingTask.value=true
        else NotHavingTask.value=false
      })
  },
})

//小组任务
  let taskPID= ref<string>("")
  let taskCID= ref<string>("")
  let taskLID= ref<string>("")
  //小组任务列表
  interface taskType {
    type:number,
    ID:string,
    GID:number,
    GroupName:string
    typestr:["题目","比赛","题单"],
    Name: string,
    [item: string]: any,
  };
  let groupTasksList = ref<GroupTasksList>({
  groupTasksList: [],
  count: 0,
});
 
    let task = ref<taskType>({
    type:4,
    ID:"",
    GID:0,
    GroupName:"暂无组任务",
    typestr:["题目","比赛","题单"],
    Name: "暂无组任务",

    gotoano(type:number,id:any){
     if(type==2){
     _getContest({}, id)
     .then((data: any) => {
       router.push({
              name: 'Contest',
              params: {
                CID:+id,
              },
              query:{
                IsPublic:data.IsPublic ,
                Title: data.Title,
                BeginTime: data.BeginTime,
                EndTime:data.EndTime,
                Type:data.Type,
              }
            })
     } )     
     }
     else if(type==1){
      router.push({
              name: 'Problem',
              params: {
                PID:id,
              },
            })
     }
     else{
      // console.log(id)
      // console.log(type)
      router.push({
              name: 'ProblemList',
              params: {
                LID: +id,
              }
            })
     }
    }
  })

//做题状态
interface UserType {
    UID: string,
    UserName: string,
    LIDTrace:[],
    PIDTrace:[],
    CIDTrace:[],
    count:number
    [item: string]: any,
  };

  let user = ref<UserType>({
    UID:userDataStore.UID ,
    UserName: userDataStore.UserName,
    LIDTrace:[],
    PIDTrace:[],
    CIDTrace:[],
    count:0,


  })

  //个人进度追踪
  const  getTrace=()=>{
        //获取组进度
        for(let i = 0;i<group.value.groupList.length;i++){
          _GetTraceGroup({ "UIDs":[]},group.value.groupList[i].GID+"").then((data:any)=>{
                // console.log(data)
                // console.log(i+""+data.Trace[list.value[i].UID].PIDTrace);
                // console.log(i+""+data.Trace[list.value[i].UID].CIDTrace);
                // console.log(i+""+data.Trace[list.value[i].UID].LIDTrace);
                // console.log(data.Trace[list.value[i].UID].PIDTrace);                
                user.value.CIDTrace = user.value.CIDTrace.concat(data.Trace[user.value.UID].CIDTrace||[])||[]
                user.value.PIDTrace = user.value.PIDTrace.concat(data.Trace[user.value.UID].PIDTrace||[])||[]
                user.value.LIDTrace = user.value.LIDTrace.concat(data.Trace[user.value.UID].LIDTrace||[])||[]
                user.value.count+=data.Trace[user.value.UID].CIDTrace.length||0
                user.value.count+=data.Trace[user.value.UID].PIDTrace.length||0
                user.value.count+=data.Trace[user.value.UID].LIDTrace.length||0           
            // console.log(list.value);
        })
        }
    }

    const isFinished=(PID:any)=>{
       for(let i = 0;i<user.value.PIDTrace.length;i++){
        if(user.value.PIDTrace[i].PID==PID)return true;
       }
       return false;
    }
    const isQuestion=(type:number)=>{
      if(type!=1)return false
      return true
    }
onMounted(() => {
  getUpdateLogs();
  banners.get();
  group.value.get();
});



</script>
