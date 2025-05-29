import { useState } from "react";

/**
 * AddTodoFormコンポーネントのプロパティの型定義
 * onAddTodo: 新しいTO-DOを追加する関数（タイトルを引数に取る）
 * currentTheme: 現在のテーマ（'light'または'dark'）- スタイリングに使用
 */
interface AddTodoFormProps {
  onAddTodo : (title : string) => Promise<void>;
  currentTheme? : 'light' | 'dark';
}

/**
 * 新しいTO-DOを追加するためのフォームコンポーネント
 * テキスト入力フィールドと追加ボタンを表示します
 */
const AddTodoForm : React.FC<AddTodoFormProps> = ({ onAddTodo, currentTheme }) => {
  // 新しいTO-DOのタイトルを保持するための状態
  const [ newTodoTitle, setNewTodoTitle ] = useState<string>('');

  /**
   * フォーム送信時の処理
   * 1. デフォルトのフォーム送信動作を防止
   * 2. 入力値が空でないか確認
   * 3. 親コンポーネントから渡されたonAddTodo関数を呼び出してTO-DOを追加
   * 4. 入力フィールドをクリア
   */
  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // ページのリロードを防止
    if ( !newTodoTitle.trim() ) {
      alert("TODOのタイトルを入力してください。");
      return;
    }
    await onAddTodo(newTodoTitle);
    setNewTodoTitle(''); // 入力フィールドをクリア
  };

  // フォームのレンダリング
  // - テキスト入力フィールドと送信ボタンを表示
  // - テーマに応じてスタイルが変わる
  return (
    <form onSubmit={ handleSubmit } className='mb-8 flex gap-3'>
      {/* テキスト入力フィールド - 入力値はnewTodoTitle状態と連動 */ }
      <input
        type='text'
        value={ newTodoTitle }
        onChange={ (e) => setNewTodoTitle(e.target.value) }
        placeholder="新しいTODOを入力..."
        className={ `flex-grow p-3 border rounded-lg shadow-sm 
                    focus:ring-2 focus:border-transparent outline-none transition-colors duration-200
                    ${ currentTheme === 'dark'
          ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-blue-400' // ダークモード時のスタイル
          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500' // ライトモード時のスタイル
        }` }
      />
      {/* 送信ボタン - クリックするとフォームが送信される */ }
      <button
        type="submit"
        className={ `px-6 py-3 font-semibold rounded-lg shadow-md 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                   ${ currentTheme === 'dark'
          ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 focus:ring-offset-gray-900' // ダークモード時のスタイル
          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600 focus:ring-offset-gray-100' // ライトモード時のスタイル
        }` }
      >
        追加
      </button>
    </form>
  )
}

export default AddTodoForm;
