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
      <div className="text-center py-10">
        <p className="text-lg text-gray-500 dark:text-gray-400">素晴らしい！TODOは全て完了しています。</p>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      { todos.map(todo => (
        <TodoItem
          todo={ todo }
          onToggleComplete={ onToggleComplete }
          onDeleteTodo={ onDeleteTodo }
        />
      )) }
    </ul>
  )
}

export default TodoList;
