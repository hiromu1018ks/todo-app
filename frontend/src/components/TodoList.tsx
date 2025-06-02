import TodoItem from "./TodoItem.tsx";
import React from "react";

/**
 * TO-DOアイテムの型定義
 * id: TO-DOの一意の識別子
 * title: TO-DOのタイトル（内容）
 * completed: 完了状態（true: 完了済み、false: 未完了）
 */
interface Todo {
  id : number;
  title : string;
  completed : boolean;
}

/**
 * TodoListコンポーネントのプロパティの型定義
 * todos: 表示するTO-DOアイテムの配列
 * onToggleComplete: TO-DOの完了状態を切り替える関数（ID、現在の完了状態を引数に取る）
 * onDeleteTodo: TO-DOを削除する関数（IDを引数に取る）
 */
interface TodoListProps {
  todos : Todo[];
  onToggleComplete : (id : number, currentCompletedStatus : boolean) => Promise<void>;
  onDeleteTodo : (id : number) => Promise<void>;
}

/**
 * TO-DOリストを表示するコンポーネント
 * 受け取ったtodos配列の各アイテムをTodoItemコンポーネントとして表示します
 * TO-DOがない場合は完了メッセージを表示します
 */
const TodoList : React.FC<TodoListProps> = ({ todos, onToggleComplete, onDeleteTodo }) => {
  if ( todos.length === 0 ) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-10 shadow-lg text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">素晴らしい！</p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">TODOは全て完了しています。</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg">
      <ul className="space-y-5">
        { todos.map(todo => (
          <TodoItem
            key={ todo.id }
            todo={ todo }
            onToggleComplete={ onToggleComplete }
            onDeleteTodo={ onDeleteTodo }
          />
        )) }
      </ul>
    </div>
  )
}

export default TodoList;
