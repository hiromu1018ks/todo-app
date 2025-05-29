import { useEffect, useState } from 'react';
import axios from 'axios';
import AddTodoForm from "./components/AddTodoForm.tsx";

// TODOアイテムの型を定義 (バックエンドのTodoエンティティと合わせる)
interface Todo {
  id : number;
  title : string;
  completed : boolean;
}

// バックエンドAPIのベースURL
const API_BASE_URL = 'http://localhost:8080/api/todos';

function App() {
  // TODOリストの状態
  const [ todos, setTodos ] = useState<Todo[]>([]);
  // ローディング状態
  const [ loading, setLoading ] = useState<boolean>(true);
  // エラー状態
  const [ error, setError ] = useState<string | null>(null);
  // 現在のテーマの状態 (ライトモードまたはダークモード)
  const [ theme, setTheme ] = useState<'light' | 'dark'>('light');

  // --- 副作用フック (useEffect) ---

  // 1. 初回マウント時にlocalStorageから保存されたテーマを読み込む
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if ( savedTheme ) {
      setTheme(savedTheme);
    } else {
      // オプション: OSのテーマ設定を初期値として尊重する場合
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []); // 空の依存配列なので、マウント時に1回だけ実行

  // 2. themeステートが変更されたら、<html>要素のクラスを更新し、localStorageにも保存する
  useEffect(() => {
    if ( theme === 'dark' ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [ theme ]); // themeが変更されるたびに実行

  // 3. 初回マウント時にバックエンドからTODOリストを取得する
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Todo[]>(API_BASE_URL);
        setTodos(response.data);
      } catch ( err ) {
        if ( axios.isAxiosError(err) ) {
          setError(`APIデータの取得に失敗しました: ${ err.message }`);
          console.error('Axios error fetching todos:', err.response?.data || err.message);
        } else {
          setError('TODOリストの取得中に予期せぬエラーが発生しました。');
          console.error('Unexpected error fetching todos:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // 空の依存配列なので、マウント時に1回だけ実行

  // --- イベントハンドラ ---

  // テーマを切り替える関数
  const toggleTheme = () => {
    setTheme(prevTheme => ( prevTheme === 'light' ? 'dark' : 'light' ));
  };

  // --- ▼▼▼ 新しいTODOを追加する処理 ▼▼▼ ---
  const handleAddTodo = async (title : string) => {

    // バックエンドAPIにPOSTリクエストを送信して新しいTODOを作成
    try {
      const response = await axios.post<Todo>(API_BASE_URL, {
        title : title,
        completed : false
      })
      setTodos(prevTodos => [ ...prevTodos, response.data ]);
    } catch ( err ) {
      if ( axios.isAxiosError(err) ) {
        setError(`TODOの追加に失敗しました：${ err.message }`);
        console.error("バックエンドAPIにPOSTリクエストを送信して新しいTODOを作成")
      } else {
        setError('TODOの追加中に予期せぬエラーが発生しました。');
        console.error('Unexpected error adding todo:', err)
      }
    }
  }
  // --- ▲▲▲ 新しいTODOを追加する処理 ▲▲▲ ---

  // --- ▼▼▼ TODOの完了状態を切り替える処理 ▼▼▼ ---
  const handleToggleComplete = async (id : number, currentCompletedStatus : boolean) : Promise<void> => {
    const newCompleteState = !currentCompletedStatus;

    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if ( !todoToUpdate ) {
        console.error('更新対象のTODOが見つかりません。ID:', id)
        setError('更新対象のTODOが見つかりませんでした。');
        return;
      }

      const updatedTodoData = { ...todoToUpdate, completed : newCompleteState };
      const response = await axios.put<Todo>(`${ API_BASE_URL }/${ id }`, updatedTodoData);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? response.data : todo
        )
      );
      // エラーがあればリセット
      if ( error ) setError(null);
    } catch ( err ) {
      // (4) エラーハンドリング
      if ( axios.isAxiosError(err) ) {
        setError(`TODOの更新に失敗しました: ${ err.message }`);
        console.error('Axios error updating todo:', err.response?.data || err.message);
      } else {
        setError('TODOの更新中に予期せぬエラーが発生しました。');
        console.error('Unexpected error updating todo:', err);
      }
      // エラーが発生した場合、既存のエラー表示ロジックでメッセージが表示される
    }
  }

  // --- ▼▼▼ TODOを削除する処理 ▼▼▼ ---
  const handleDeleteTodo = async (id : number) => {
    if ( !window.confirm('本当に削除しますか？') ) return;

    try {
      await axios.delete(`${ API_BASE_URL }/${ id }`);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

      if ( error ) setError(null);
    } catch ( err ) {
      if ( axios.isAxiosError(err) ) {
        setError(`TODOの削除に失敗しました: ${ err.message }`)
        console.error('Axios error deleting todo:', err.response?.data || err.message);
      } else {
        setError('TODOの削除中に予期せぬエラーが発生しました。');
        console.error('Unexpected error deleting todo:', err);
      }
    }
  }
  // --- ▲▲▲ TODOを削除する処理 ▲▲▲ ---


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

        <AddTodoForm onAddTodo={ handleAddTodo } currentTheme={ theme }/>

        {/* TODOリスト */ }
        <main>
          { todos.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">素晴らしい！TODOは全て完了しています。</p>
              {/* ここに新しいTODOを追加するフォームを後で配置できます */ }
            </div>
          ) : (
            <ul className="space-y-4">
              { todos.map(todo => (
                <li
                  key={ todo.id }
                  className={ `p-4 rounded-lg shadow-lg flex justify-between items-center transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    todo.completed
                      ? 'bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 dark:border-green-600'
                      : 'bg-white dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-600'
                  } group` }
                >
                  <div className="flex items-center flex-grow"> {/* 左側 */ }
                    <input
                      type="checkbox"
                      checked={ todo.completed }
                      onChange={ () => handleToggleComplete(todo.id, todo.completed) }
                      className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-150 ease-in-out mr-3 cursor-pointer"
                    />
                    <span
                      className={ `text-lg font-medium ${
                        todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'
                      }` }
                    >
                    { todo.title }
                  </span>
                  </div>

                  {/* 右側の要素群に flex-shrink-0 を追加 */ }
                  <div className="flex items-center space-x-2 ml-2 flex-shrink-0"> {/* 右側 */ }
                    <span
                      className={ `px-3 py-1 text-xs font-semibold rounded-full ${
                        todo.completed
                          ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'
                          : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100'
                      }` }
                    >
                    { todo.completed ? '完了' : '作業中' }
                  </span>
                    <button
                      onClick={ () => handleDeleteTodo(todo.id) }
                      aria-label={ `${ todo.title } を削除` }
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" strokeWidth={ 2 }>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </li>
              )) }
            </ul>
          ) }
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