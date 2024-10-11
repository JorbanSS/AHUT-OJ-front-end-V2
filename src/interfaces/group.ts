export interface Group {
  GID: number;
  UID: number;
  CreateTime: number;
  GroupName: string;
  GroupTask: string;
  InviteCode: string;

  [item: string]: any;
};

export interface GroupList {
  groups: Array<Group>;
  count: number;

  [item: string]: any;
};

export interface GroupTask {
  type: number;
  ID: number;
};

export interface taskType {
  type:number,
  ID:string,
  GID:number,
  GroupName:string
  typestr:["题目","比赛","题单"],
  Name: string,
  [item: string]: any,
};

export interface GroupTasksList {
  groupTasksList: Array<taskType>;
  count: number;

  [item: string]: any;
}