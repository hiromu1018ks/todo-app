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
const AddTodoForm : React.FC<AddTodoFormProps> = ({ onAddTodo, currentTheme = 'light' }) => {
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
    <form onSubmit={ handleSubmit } className='mb-8 flex gap-4'>
      {/* テキスト入力フィールド - 入力値はnewTodoTitle状態と連動 */ }
      <input
        type='text'
        value={ newTodoTitle }
        onChange={ (e) => setNewTodoTitle(e.target.value) }
        placeholder="新しいTODOを入力..."
        className={ `flex-grow p-4 border-2 rounded-xl shadow-md 
                    focus:ring-2 focus:border-transparent outline-none transition-all duration-300
                    ${ currentTheme === 'dark'
          ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-blue-400 focus:shadow-lg focus:shadow-blue-500/20' // ダークモード時のスタイル
          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:shadow-lg focus:shadow-blue-500/20' // ライトモード時のスタイル
        }` }
      />
      {/* 送信ボタン - クリックするとフォームが送信される */ }
      <button
        type="submit"
        className={ `px-6 py-4 font-bold rounded-xl shadow-lg transform hover:scale-[1.02] hover:shadow-xl
                   focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
                   ${ currentTheme === 'dark'
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-900' // ダークモード時のスタイル
          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-600 focus:ring-offset-gray-100' // ライトモード時のスタイル
        }` }
      >
        追加
      </button>
    </form>
  )
}

export default AddTodoForm;
