<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <label class="font-bold text-base" @click="router.push('/admin/problem')">
          <document-folder theme="outline" size="18" />
          题目列表
        </label>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problem/add')">
          <add theme="outline" size="18" />
          新增题目
        </div>
      </li>
      <li>
        <label class="font-bold text-base btn-active">
          <edit-one theme="outline" size="18" />
          编辑题目
        </label>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="problem.editProblem()">
          <edit-one theme="outline" size="18" />
          提交编辑
        </div>
      </li>
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="problem.deleteProblem()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除题目
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <label class="input input-bordered flex items-center gap-2 w-72">
      题号
      <input type="text" class="grow" placeholder="" v-model="problem.PID" disabled>
    </label>
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标题
      <input type="text" class="grow" placeholder="" v-model="problem.Title">
    </label>
    <div class="flex space-x-2">
      <label class="input input-bordered flex items-center gap-2 w-72">
        <stopwatch-start theme="outline" size="22" />
        <input type="number" class="grow" placeholder="1000" v-model="problem.limitTime" min="500" max="10000"
          step="500" />
        <span>ms</span>
      </label>
      <label class="input input-bordered flex items-center gap-2 w-72">
        <disk theme="outline" size="19" class="ml-0.5 :mr-1.5" />
        <input type="number" class="grow" placeholder="128" v-model="problem.limitMemory" min="64" max="1024"
          step="64" />
        <span>MB</span>
      </label>
    </div>
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标签
      <input type="text" class="grow" placeholder="用英文;来分隔" v-model="problem.Label" />
    </label>
    <div class="flex space-x-2">
      <select class="select select-bordered w-72 max-w-xs text-base" v-model="problem.Origin">
        <option disabled selecte value="0">题目来源</option>
        <option value="-1">Local</option>
        <option value="1">Codeforces</option>
        <!-- <option value="2">AtCoder</option>
        <option value="3">Virtual Judge</option> -->
      </select>
      <label class="input input-bordered flex items-center gap-2 w-72" v-if="problem.Origin != -1">
        题号
        <input type="text" class="grow" placeholder="例：1069A" v-model="problem.OriginPID" />
      </label>
    </div>
    <div class="form-control w-72" @change="changeVisible()">
      <label class="label cursor-pointer">
        <span class="label-text text-base">可见性</span>
        <input type="checkbox" :checked="problem.Visible == 1" class="checkbox" />
      </label>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <select class="select select-bordered w-72 max-w-xs text-base" v-model="problem.ContentType">
      <option disabled selecte value="0">题面类型</option>
      <option value="-1">PlainText</option>
      <option value="1">MarkDown</option>
    </select>
    <div v-if="problem.ContentType == 1">
      <MdEditor v-model="problem.description" :height="500" :toolbars="markdownToolbars" />
    </div>
    <div v-else>
      <label class="form-control">
        <div class="label">题目描述</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.description"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输入格式</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.input"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输出格式</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.description"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输入样例</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.description"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输出样例</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.description"></textarea>
      </label>
      <label class="form-control">
        <div class="label">提示</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.description"></textarea>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { DeleteOne, EditOne, DocumentFolder, StopwatchStart, Disk, Add } from '@icon-park/vue-next';
import { type ProblemType, type ProblemsType, type ProblemSimplifiedType } from '@/type/problem';
import { ref, reactive, onMounted } from 'vue';
import { push } from 'notivue';
import { MdEditor } from 'md-editor-v3';
import { Get, Post } from '@/utils/axios/request';
import { useRouter, useRoute } from 'vue-router';
import { markdownToolbars } from '@/config';

const router = useRouter();
const route = useRoute();
import 'md-editor-v3/lib/style.css';
import { _getProblem, _editProblem, _deleteProblems } from '@/api/problem';

let problem = reactive<ProblemType>({
  PID: '',
  Title: '',
  Label: '',
  Visible: 1,
  Submit: 0,
  Accepted: 0,
  Description: '',
  Origin: -1,
  OriginPID: '',
  LimitMemory: 128,
  LimitTime: 1000,
  SolutionNumber: 0,
  ContentType: 1,
  Input: '',
  Output: '',
  SampleInput: '',
  SampleOutput: '',
  Hit: '',

  get() {
    _getProblem({}, problem.PID)
      .then((data: any) => {
        problem.Accepted = data.Accepted;
        problem.ContestType = data.ContestType;
        problem.description = data.Description;
        problem.Title = data.Title;
        problem.Label = data.Label;
        problem.limitMemory = data.LimitMemory;
        problem.limitTime = data.LimitTime;
        problem.ContentType = data.ContentType;
        problem.SolutionNumber = data.SolutionNumber;
      })
  },

  edit() {
    if (problem.Title == '' || problem.Description == '') {
      push.error({
        title: '信息错误',
        message: '请填写完整信息',
      })
      return;
    }
    let params = {
      ContentType: problem.ContentType,
      Description: problem.Description,
      Hit: problem.Hit,
      Label: problem.Label,
      LimitMemory: problem.LimitMemory,
      LimitTime: problem.LimitTime,
      Origin: problem.Origin,
      PID: problem.PID,
      OriginPID: problem.OriginPID,
      Output: problem.Output,
      SampleInput: problem.Input,
      SampleOutput: problem.SampleOutput,
      Title: problem.Title,
      Visible: problem.Visible,
    };
    _editProblem(params, problem.PID)
      .then(() => {
        push.success({
          title: '编辑成功',
          message: `题目 ID 为 ${problem.PID}`,
        });
      })
  },

  delete() {
    let params = {
      PIDs: [problem.PID],
    };
    _deleteProblems(params)
      .then(() => {
        router.push('/admin/problem');
        push.success({
          title: '删除成功',
          message: `一共删除了 1 个题目`,
        });
      })
  },
});

function changeVisible() {
  problem.Visible = 1 - problem.Visible;
}

onMounted(() => {
  problem.PID = route.params.PID as string;
  problem.get();
})

</script>

<style scoped></style>