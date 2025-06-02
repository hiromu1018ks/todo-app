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
 * TodoItemコンポーネントのプロパティの型定義
 * to.do: 表示するTO-DOアイテム
 * onToggleComplete: TO-DOの完了状態を切り替える関数（ID、現在の完了状態を引数に取る）
 * onDeleteTodo: TO-DOを削除する関数（IDを引数に取る）
 */
interface TodoItemProps {
  todo : Todo;
  onToggleComplete : (id : number, currentCompletedStatus : boolean) => Promise<void>;
  onDeleteTodo : (id : number) => Promise<void>;
}

/**
 * 個々のTO-DOアイテムを表示するコンポーネント
 * チェックボックス、TO-DOのタイトル、ステータスバッジ、削除ボタンを表示します
 * TO-DOの完了状態に応じて見た目が変わります（完了時は緑色、未完了時は青色のアクセント）
 */
const TodoItem : React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDeleteTodo }) => {
  return (
    // TO-DOアイテムのコンテナ - 完了状態に応じて背景色と左ボーダーの色が変わります
    <li
      className={ `p-5 rounded-xl shadow-xl flex justify-between items-center transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl group mb-2 ${
        todo.completed
          ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/40 border-l-4 border-green-500 dark:border-green-600' // 完了時のスタイル（緑色）
          : 'bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-l-4 border-blue-500 dark:border-blue-600' // 未完了時のスタイル（青色）
      }` }
    >
      {/* 左側：チェックボックスとTO-DOタイトル */ }
      <div className="flex items-center flex-grow">
        {/* 完了状態を切り替えるチェックボックス */ }
        <div className="relative mr-4">
          <input
            type="checkbox"
            checked={ todo.completed }
            onChange={ () => onToggleComplete(todo.id, todo.completed) }
            className="form-checkbox h-6 w-6 text-blue-600 dark:text-blue-400 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 ease-in-out cursor-pointer"
          />
          {todo.completed && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
        {/* TO-DOのタイトル - 完了時は取り消し線が表示されます */ }
        <span
          className={ `text-lg font-medium transition-all duration-200 ${
            todo.completed 
              ? 'line-through text-gray-500 dark:text-gray-400' 
              : 'text-gray-800 dark:text-gray-100'
          }` }
        >
          { todo.title }
        </span>
      </div>

      {/* 右側：ステータスバッジと削除ボタン */ }
      <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
        {/* 完了状態を示すバッジ - 完了時は緑、未完了時は黄色 */ }
        <span
          className={ `px-3 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-200 ${
            todo.completed
              ? 'bg-gradient-to-r from-green-300 to-green-400 text-green-900 dark:from-green-600 dark:to-green-700 dark:text-green-50' // 完了時のスタイル
              : 'bg-gradient-to-r from-yellow-300 to-amber-300 text-amber-900 dark:from-yellow-500 dark:to-amber-500 dark:text-amber-50' // 未完了時のスタイル
          }` }
        >
          { todo.completed ? '完了' : '作業中' }
        </span>
        {/* 削除ボタン - ホバー時のみ表示されます */ }
        <button
          onClick={ () => onDeleteTodo(todo.id) }
          aria-label={ `${ todo.title } を削除` }
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 rounded-full shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={ 2 }>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
