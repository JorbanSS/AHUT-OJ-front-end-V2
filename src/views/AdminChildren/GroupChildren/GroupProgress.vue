<template>
    <div class="py-6 flex justify-center space-x-2">
      <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
        <li>
          <div class="font-bold text-base btn-active">
            小组进度
          </div>
        </li>
      </ul>
      <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
        <li>
          <div class="font-bold text-base" @click="$router.push({
            name: 'GroupList',
          })">
            <go-on theme="outline" size="18" />
            跳转小组列表
          </div>
        </li>
      </ul>
    </div>
    <!-- <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl"> -->
      <!-- <label class="input input-bordered flex items-center gap-2 w-[584px]">
        小组名称
        <input type="text" class="grow" placeholder="" v-model="group.GroupName">
      </label> -->
      <!-- <div class="form-control w-72" @change="changePublic()">
        <label class="label cursor-pointer">
          <span class="label-text text-base">可见性</span>
          <input type="checkbox" :checked="problemList.IsPublic == 1" class="checkbox" />
        </label>
      </div> -->
    <!-- </div> -->
    <div v-if="showAll" class="card bg-white shadow-lg Border max-w-5xl mx-auto overflow-hidden">
     <div class="join join-vertical w-full" v-for="(item,userindex) in list" :key="item.UID">
   <div class="collapse collapse-arrow join-item border-base-300 border">
    <input type="radio" name="my-accordion-4" checked="checked" />
    <div class="collapse-title text-xl font-medium">{{item.UserName}}
        <progress class="progress progress-success w-20"
                  :value="ConvertTools.Percentage(item.count,countall)" max="100"></progress>
    </div>
    <div class="collapse-content">
  <ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
  <li @click="showProblemsFunc()"><a>单题</a></li>
  <li @click="showProblemListsFunc()"><a>题单</a></li>
  <li @click="showContestsFunc()"><a>比赛</a></li>
  </ul>
    <!-- 单题 --> 
     <VueDraggable ref="el" v-model="taskProblemLists" target=".sort-target" :animation="200" class="select-none overflow-auto h-[330px]" v-if="showProblems">
        <table class="table table-zebra text-center">
          <thead>
            <tr>
              <th>序号</th>
              <th>ID</th>
              <th>名称</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="sort-target">
            <tr v-for="(item2, index2) in taskProblemLists" :key="item2.ID" class="cursor-pointer" v-auto-animate>
              <th class="w-32">
                {{ index2 + 1 }}
              </th>
              <th class="w-48">
                {{ item2.ID}}
              </th>
              <td class="w-48">
                {{ item2.Name }}
              </td>
              <td class="flex justify-center space-x-2">
                <check v-if="finishPro(item2.ID,userindex)" theme="multi-color" size="24" fill="#7ed321"/>
                <close v-else theme="outline" size="24" fill="#d0021b"/>
              </td>
              <td class=" justify-center space-x-2">
                <button class="btn btn-neutral btn-sm" @click="showFinishedDetailInProblem(item2.ID,userindex)" :disabled="!finishPro(item2.ID,userindex)">
                  <view-grid-detail theme="outline" size="24" fill="#ffffff"/>
                  查看代码
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </VueDraggable> 
      <!-- 题单 -->
      <div class="join join-vertical  w-full" v-if="showProblemLists">
  <div class="collapse collapse-arrow join-item border-base-300 border" v-for="item2 in taskProblemListLists" :key="item2.ID">
    <input type="radio" name="my-accordion-5" checked="checked" />
    <div class="collapse-title text-xl font-medium">{{item2.Name}}</div>
    <div class="collapse-content">
        <VueDraggable ref="el" v-model="taskProblemListLists" target=".sort-target" :animation="200" class="select-none overflow-auto h-[330px]">
        <table class="table table-zebra text-center">
          <thead>
            <tr>
              <th>序号</th>
              <th>ID</th>
              <th>名称</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="sort-target">
            <tr v-for="(item3, index) in item2.problemList" :key="item3.PID" class="cursor-pointer" v-auto-animate>
              <th class="w-32">
                {{ index + 1 }}
              </th>
              <th class="w-48">
                {{ item3.PID}}
              </th>
              <td class="w-48">
                {{ item3.Title }}
              </td>
              <td class="flex justify-center space-x-2">
                <!-- <button class="btn btn-neutral btn-sm" @click="user.delete(index)" v-if="item.UID!=group.UID" :disabled="IsTrace">
                  <delete-one theme="outline" size="16" />
                  删除
                </button> -->
                <check v-if="finishPro(item3.PID,userindex)" theme="multi-color" size="24" fill="#7ed321"/>
                <close v-else theme="outline" size="24" fill="#d0021b"/>    
              </td>
              <td class=" justify-center space-x-2">
                <button class="btn btn-neutral btn-sm" @click="showFinishedDetailInProblemList(+item2.ID,userindex,item3.PID)" :disabled="!finishPro(item3.PID,userindex)">
                  <view-grid-detail theme="outline" size="24" fill="#ffffff"/>
                  查看代码
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </VueDraggable> 
    </div>
  </div>
</div>
      <!-- 比赛 -->
      <div class="join join-vertical  w-full" v-if="showContests">
  <div class="collapse collapse-arrow join-item border-base-300 border" v-for="item4 in taskContestLists" :key="item4.ID">
    <input type="radio" name="my-accordion-6" checked="checked" />
    <div class="collapse-title text-xl font-medium">{{item4.Name}}</div>
    <div class="collapse-content">
        <VueDraggable ref="el" v-model="item4.problemList" target=".sort-target" :animation="200" class="select-none overflow-auto h-[330px]">
        <table class="table table-zebra text-center">
          <thead>
            <tr>
              <th>序号</th>
              <th>ID</th>
              <th>名称</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="sort-target">
            <tr v-for="(item5, index) in item4.problemList" :key="item5.PID" class="cursor-pointer" v-auto-animate>
              <th class="w-32">
                {{ index + 1 }}
              </th>
              <th class="w-48">
                {{ item5.PID}}
              </th>
              <td class="w-48">
                {{ item5.Title }}
              </td>
              <td class="flex justify-center space-x-2">
                <!-- <button class="btn btn-neutral btn-sm" @click="user.delete(index)" v-if="item.UID!=group.UID" :disabled="IsTrace">
                  <delete-one theme="outline" size="16" />
                  删除
                </button> -->
                <check v-if="finishProInContest(item5.PID,+item4.ID,userindex)" theme="multi-color" size="24" fill="#7ed321"/>
                <close v-else theme="outline" size="24" fill="#d0021b"/>    
                
              </td>
              <td class=" justify-center space-x-2">
                <button class="btn btn-neutral btn-sm" @click="showFinishedDetailInContest(+item4.ID,userindex,item5.PID)" :disabled="!finishProInContest(item5.PID,+item4.ID,userindex)">
                  <view-grid-detail theme="outline" size="24" fill="#ffffff"/>
                  查看代码
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </VueDraggable> 
    </div>
  </div>
</div>
    </div>
  </div>
</div>
    </div>
    <div class="mt-6"></div>

  </template>
  
  <script lang="ts" setup name="AddProblemList">
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { _getUserInfo } from '@/apis/user';
  import { Add, Bill, DeleteOne, EditTwo, GoOn,SettingThree,Setting,Success,WorriedFace,Check,Close,ViewGridDetail} from '@icon-park/vue-next';
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { push } from 'notivue';
  import { _editContest, _getContest } from "@/apis/contest";
  import { VueDraggable } from 'vue-draggable-plus';
  import { _GetGroup ,_EditGroup,_AddUserToGroup,_DelUserFromGroup,_TraceGroup,_GetTraceGroup} from '@/apis/group'; 
  import { _getProblem } from '@/apis/problem';
  import { _editProblemList, _getProblemList } from "@/apis/problemList";
  import { type ProblemListType } from '@/interfaces/problemList';
  import { useUserDataStore } from '@/stores/UserData';
  import { ConvertTools } from '@/utils/globalFunctions';
  const userDataStore = useUserDataStore();
  const router = useRouter();
  const route = useRoute();
  const showAll = ref(false)
  interface UserType {
    UID: string,
    UserName: string,
    LIDTrace:[],
    PIDTrace:[],
    CIDTrace:[],
    count:number
    [item: string]: any,
  };
  interface taskType {
    type:number,
    ID:string,
    typestr:["题目","比赛","题单"],
    Name: string,
    problemList:[]
    [item: string]: any,
  };
  
  //用户
  let list = ref<Array<UserType>>([]);
  let listadd = ref<Array<UserType>>([]);
  let listdel = ref<Array<UserType>>([]);
  let user = reactive<UserType>({
    UID: '',
    UserName: '',
    LIDTrace:[],
    PIDTrace:[],
    CIDTrace:[],
    count:0
  })

   //小组任务
   let taskPID= ref<string>("")
  let taskCID= ref<string>("")
  let taskLID= ref<string>("")
  let taskPIDList = ref([])
  let taskCIDList = ref([])
  let taskLIDList = ref([])
  let countall = ref(2);
  //小组任务列表
  let taskProblemLists= ref<Array<taskType>>([]);
  let taskProblemListLists = ref<Array<taskType>>([]);
  let taskContestLists = ref<Array<taskType>>([]);
 
    let task = ref<taskType>({
    type:4,
    ID:"",
    typestr:["题目","比赛","题单"],
    Name: "暂无组任务",
    problemList:[],

    getAllTasks(){
      //查询小组任务中的所有题目
      for(let i = 0;i<taskPIDList.value.length;i++){
        countall.value++;
        _getProblem({}, taskPIDList.value[i])
      .then((data: any) => {
        taskProblemLists.value.push(
          {
          type:1,
          ID:taskPIDList.value[i]+"",
          typestr:["题目","比赛","题单"],
          Name: data.Title,
          problemList:[]
          }
        )

      })
      }
      //查询小组任务中的所有题单
      for(let i =0;i<taskLIDList.value.length;i++){
        countall.value++;
        _getProblemList({}, taskLIDList.value[i])
      .then((data: any) => {
        // console.log(data)
        taskProblemListLists.value.push(
          {
          type:3,
          ID:taskLIDList.value[i]+"",
          typestr:["题目","比赛","题单"],
          Name: data.Title,
          problemList:data.Data
          }

        )
    
      })
      }

      //查询小组任务中的所有比赛
      for(let i =0;i<taskCIDList.value.length;i++){
        countall.value++;
        _getContest({}, taskCIDList.value[i])
      .then((data: any) => {
        // console.log(data)
        taskContestLists.value.push(
          {
          type:2,
          ID:taskCIDList.value[i]+"",
          typestr:["题目","比赛","题单"],
          Name: data.Title,
          problemList:data.Data
          }
        )
    
      })
      }
    //  console.log(countall)
    },

    gotoano(type:number,id:any){
     if(type==2){
      router.push({ name: 'ContestTaskEdit',
      params: {
                GID:group.value.GID,
                CID:id,
              }
      })
     }
     else{
      router.push({ name: 'ProblemListTaskEdit',
      params: {
                GID:group.value.GID,
                LID:id,
              }
      })
     }
    }
  })

  //是否进行了转让操作
  let IsTrace = ref(false)

  let group = ref({
  GID:0,
  GroupName: '测试',
  GroupTask:"",
  UID: '',
  CreatTime: 0,
  InviteCode: '123456',
    get() {
      _GetGroup({}, this.GID)
        .then((data: any) => {
        //   console.log(data)
          group.value.GroupName = data.GroupName
          group.value.GroupTask = data.GroupTask
          //字符串切割
        let arr = data.GroupTask.split(";")
        if(arr!=""){
            arr.forEach((element:any) => {
          if(element.charAt(0)=='C')taskCIDList.value.push(+element.slice(1));
          else if(element.charAt(0)=='P'&&element.charAt(1)!='P')taskPIDList.value.push(element.slice(1));
          else if(element.charAt(0)=='L')taskLIDList.value.push(+element.slice(1));
          else taskPIDList.value.push(element.slice(1));
        });
        }
          group.value.GroupName = data.GroupName
          group.value.UID=data.UID
          for (let i = 0; i < data.MemberUIDs.length; i++) {
            let params = {
            UID:data.MemberUIDs[i]
            }
      _getUserInfo(params)
        .then((data: any) => {
          // console.log(data)
          list.value.push({
              UID: data.UID,
              UserName: data.UserName,
              LIDTrace:[],
              PIDTrace:[],
              CIDTrace:[],
              count:0
            });
        })
          }
        }).then(()=>{
          getTrace()
        }).then(()=>{
          task.value.getAllTasks() 
        }).
       then(()=>{
          showAll.value=true
        })
        
    },
  })
  //排序
const sfunc = (a:any,b:any)=>{
return a.count-b.count;
}
const  getTrace=()=>{
        //获取组进度
        _GetTraceGroup({ "UIDs":[]},group.value.GID+"").then((data:any)=>{
            // console.log(data)
            for(let i =0;i<list.value.length;i++){
                // console.log(i+""+data.Trace[list.value[i].UID].PIDTrace);
                // console.log(i+""+data.Trace[list.value[i].UID].CIDTrace);
                // console.log(i+""+data.Trace[list.value[i].UID].LIDTrace);
                // console.log(data.Trace[list.value[i].UID].PIDTrace);
                
                list.value[i].CIDTrace = data.Trace[list.value[i].UID].CIDTrace||[]
                list.value[i].PIDTrace = data.Trace[list.value[i].UID].PIDTrace||[]
                list.value[i].LIDTrace = data.Trace[list.value[i].UID].LIDTrace||[]
                list.value[i].count=list.value[i].CIDTrace.length
                list.value[i].count+=list.value[i].PIDTrace.length
                list.value[i].count+=list.value[i].LIDTrace.length
            }
            // console.log(list.value);
        }).then(()=>{
          for(let i=0;i<list.value.length;i++){
  for(let j=i+1;j<list.value.length;j++){
//如果第一个比第二个大，就交换他们两个位置
if(list.value[i].count<list.value[j].count){
let temp = list.value[i];
list.value[i] = list.value[j];
list.value[j] = temp;
}
}
    }
console.log(list.value)
        })
    }

   //模块展示相关
   let showProblems = ref(true)
   let showProblemLists = ref(false)
   let showContests = ref(false)
   const showProblemsFunc = ()=>{
    showProblems.value=true;
    showProblemLists.value=false;
    showContests.value=false;
   }
   const showProblemListsFunc = ()=>{
    showProblems.value=false;
    showProblemLists.value=true;
    showContests.value=false;
   }
   const showContestsFunc = ()=>{
    showProblems.value=false;
    showProblemLists.value=false;
    showContests.value=true;
   }

   //判断是否完成
 const finishPro=(PID:any,index:number)=>{
  let arr = list.value[index].PIDTrace.concat(list.value[index].CIDTrace).concat(list.value[index].LIDTrace)
  // console.log(arr)
   for(let i = 0;i<arr.length;i++){
    if(arr[i].PID==PID)return true;
   }
   return false;
 }
 const finishProInContest=(PID:any,CID:number,index:number)=>{
  // let arr = list.value[index].PIDTrace.concat(list.value[index].CIDTrace).concat(list.value[index].LIDTrace)
  // console.log(arr)
   for(let i = 0;i<list.value[index].CIDTrace.length;i++){
    if(list.value[index].CIDTrace[i].PID==PID&&list.value[index].CIDTrace[i].CID==CID)return true;
   }
   return false;
 }

 //查看代码
 const showFinishedDetailInProblem = (PID:string,index:number)=>{
   for(let i = 0;i<list.value[index].PIDTrace.length;i++){
    if(list.value[index].PIDTrace[i].PID==PID){
      router.push({
      name:"GroupTaskProblemRecord",
      params:{
        SID:list.value[index].PIDTrace[i].SID
      }
     })
     return 
    }
   }
     
 } 
 const showFinishedDetailInProblemList = (LID:number,index:number,PID:string)=>{
   for(let i = 0;i<list.value[index].LIDTrace.length;i++){
    if(list.value[index].LIDTrace[i].PID==PID&&list.value[index].LIDTrace[i].LID==LID){
      router.push({
      name:"GroupTaskProblemRecord",
      params:{
        SID:list.value[index].LIDTrace[i].SID
      }
     })
     return 
    }

   }
   
   for(let i = 0;i<list.value[index].PIDTrace.length;i++){
    if(list.value[index].PIDTrace[i].PID==PID){
      router.push({
      name:"GroupTaskProblemRecord",
      params:{
        SID:list.value[index].PIDTrace[i].SID
      }
     })
     return 
    }
   }    
 }

 const showFinishedDetailInContest = (CID:number,index:number,PID:string)=>{
  for(let i = 0;i<list.value[index].CIDTrace.length;i++){
    if(list.value[index].CIDTrace[i].PID==PID&&list.value[index].CIDTrace[i].CID==CID){
      router.push({
      name:"GroupTaskProblemRecord",
      params:{
        SID:list.value[index].CIDTrace[i].SID
      }
     })
     return 
    }
   }    
 }
  onMounted(() => {
    // console.log(+route.params.GID)
    group.value.GID = +route.params.GID;
    group.value.get();
    // console.log(route.params.GID)
   
  })
  
  
  </script>


