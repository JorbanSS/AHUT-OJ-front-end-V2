export interface Model {
  ModelType: string,         // 模型类型
  Available: boolean,        // 是否可用

  [item: string]: any        // 其他属性
}

export interface ModelList {
  Count: number,              // 模型数量
  Models: Array<Model>,       // 模型列表

  [item: string]: any         // 其他属性
}

export interface ModelMessage {
  ModelType: string,          // 模型类型
  Message: string,            // 信息
  SendByAI: boolean,          // 是否由AI发送

  [item: string]: any         // 其他属性
}

export interface ModelMessageList {
  Count: number,                   // 消息数量
  Messages: Array<ModelMessage>,   // 消息列表

  [item: string]: any              // 其他属性
}

export interface Message {
  choices: Choice[],
  created: number,
  id: string,
  model: string,
  object: string,
  system_fingerprint: string,
  usage: Usage,

  [property: string]: any,
}

export interface Choice {
  finish_reason?: string,
  index?: number,
  logprobs?: null,
  message?: MessageObject,

  [property: string]: any,
}

export interface MessageObject {
  content: string,
  role: string,

  [property: string]: any,
}

export interface Usage {
  completion_tokens: number,
  prompt_tokens: number,
  total_tokens: number,

  [property: string]: any,
}