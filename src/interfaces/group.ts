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

export interface GroupTasks {
  GID: number;
  count: number;
  tasks: Array<GroupTask>;

  [item: string]: any;
};