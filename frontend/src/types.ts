// frontend/src/types.ts
export interface Todo {
  id : number;
  title : string;
  completed : boolean;
}

// 必要であればユーザーの型定義もここに
export interface User {
  id : number;
  username : string;
  // roles?: string[];
}