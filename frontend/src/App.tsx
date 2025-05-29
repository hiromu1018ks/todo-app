import AddTodoForm from "./components/AddTodoForm.tsx";
import TodoList from "./components/TodoList.tsx";
import useTheme from "./hooks/useTheme";
import useTodos, { API_BASE_URL } from "./hooks/useTodos";

/**
 * アプリケーションのメインコンポーネント
 * TO-DOリストの表示、追加、完了状態の切り替え、削除の機能を提供します
 * ダークモード/ライトモードの切り替え機能も含まれています
 */
function App() {
  // カスタムフックを使用してテーマ（ダークモード/ライトモード）の状態と切り替え機能を取得
  const { theme, toggleTheme } = useTheme();

  // カスタムフックを使用してTO-DOリストの状態と操作関数を取得
  // todos: TO-DOアイテムの配列
  // loading: データ読み込み中かどうかを示すフラグ
  // error: エラーメッセージ（エラーがない場合はnull）
  // addTodo: 新しいTO-DOを追加する関数
  // toggleTodoComplete: TO-DOの完了状態を切り替える関数
  // deleteTodo: TO-DOを削除する関数
  const { todos, loading, error, addTodo, toggleTodoComplete, deleteTodo } = useTodos();


  // --- レンダリングロジック ---

  if ( loading ) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <p className="text-xl">データを読み込み中です...</p>
      </div>
    );
  }

  if ( error ) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
        <p className="text-xl text-red-600 dark:text-red-400">エラーが発生しました。</p>
        <p className="text-md text-gray-700 dark:text-gray-300 mt-2">{ error }</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          バックエンドサーバーが起動しているか、APIのエンドポイント ({ API_BASE_URL }) が正しいか確認してください。
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
        {/* ヘッダーエリア: タイトルとテーマ切り替えボタン */ }
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            TODOアプリ
          </h1>
          <button
            onClick={ toggleTheme }
            aria-label="テーマを切り替える"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
          >
            { theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 dark:text-yellow-300"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            ) }
          </button>
        </header>

        <AddTodoForm onAddTodo={ addTodo } currentTheme={ theme }/>

        {/* TODOリスト */ }
        <main>
          <TodoList
            todos={ todos }
            onToggleComplete={ toggleTodoComplete }
            onDeleteTodo={ deleteTodo }/>
        </main>
        {/* フッター (オプション) */ }
        {/* <footer className="text-center mt-12 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} TODOアプリ</p>
        </footer> */ }
      </div>
    </div>
  );
}

export default App;
