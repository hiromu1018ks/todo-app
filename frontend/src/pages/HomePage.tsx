// frontend/src/pages/HomePage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // 認証情報が必要な場合 (今回はaxiosデフォルトヘッダーで対応)
import AddTodoForm from '../components/AddTodoForm';
import TodoList from '../components/TodoList';
import type { Todo } from '../types'; // (1) 共通の型定義をインポート
// (1) 共通の型定義をインポート

const API_BASE_URL = 'http://localhost:8080/api/todos';

interface HomePageProps {
  currentTheme?: 'light' | 'dark';
}

const HomePage : React.FC<HomePageProps> = ({ currentTheme = 'light' }) => {
  const [ todos, setTodos ] = useState<Todo[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);
  const { isAuthenticated } = useAuth(); // (2) 認証状態を取得 (API呼び出しの可否判断など)

  // APIエラーを処理する共通関数
  const handleApiError = (err : unknown, defaultMessage : string) => {
    if ( axios.isAxiosError(err) && err.response ) {
      if ( err.response.status === 401 || err.response.status === 403 ) {
        setError("認証エラーが発生しました。再度ログインしてください。");
      } else {
        setError(`${ defaultMessage }: ${ err.response.data?.message || err.message }`);
      }
      console.error('API error:', err.response.data || err.message);
    } else {
      setError(`予期せぬエラーが発生しました: ${ defaultMessage }`);
      console.error('Unexpected error:', err);
    }
  };

  // TODOリストを取得する関数
  const fetchTodos = useCallback(async () => {
    if ( !isAuthenticated ) {
      // 通常、ProtectedRouteでこのページには来ないはずだが、念のため
      // もし認証されていない場合は、ログインページへリダイレクトするか、
      // AuthContextのログアウト処理を呼び出すなどの対応も考えられる。
      // ここでは何もしないか、エラーメッセージを設定する程度に留める。
      // setTodos([]); // 空にするなど
      // setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Todo[]>(API_BASE_URL);
      setTodos(response.data);
    } catch ( err ) {
      handleApiError(err, "TODOリストの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [ isAuthenticated ]); // isAuthenticated が変わったタイミングでも再取得を試みる

  // コンポーネントマウント時、または認証状態が変わった時にTODOリストを取得
  useEffect(() => {
    fetchTodos();
  }, [ fetchTodos ]);


  // 新しいTODOを追加する関数
  const handleAddNewTodo = useCallback(async (title : string) => {
    if ( !title.trim() ) {
      alert('TODOのタイトルを入力してください。'); // 簡単なクライアントサイドバリデーション
      return;
    }
    try {
      const response = await axios.post<Todo>(API_BASE_URL, { title, completed : false });
      setTodos(prevTodos => [ ...prevTodos, response.data ]);
      if ( error ) setError(null); // 成功したらエラーをクリア
    } catch ( err ) {
      handleApiError(err, "TODOの追加に失敗しました");
    }
  }, [ error ]); // error stateを依存配列に追加して、エラークリアロジックが正しく働くように

  // TODOの完了状態を切り替える関数
  const handleToggleComplete = useCallback(async (id : number, currentCompletedStatus : boolean) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if ( !todoToUpdate ) {
      console.error("更新対象のTODOが見つかりません。ID:", id);
      setError("更新対象のTODOが見つかりませんでした。");
      return;
    }

    const newCompletedStatus = !currentCompletedStatus;
    const updatedTodoData = { ...todoToUpdate, completed : newCompletedStatus };

    try {
      const response = await axios.put<Todo>(`${ API_BASE_URL }/${ id }`, updatedTodoData);
      setTodos(prevTodos =>
        prevTodos.map(todo => ( todo.id === id ? response.data : todo ))
      );
      if ( error ) setError(null);
    } catch ( err ) {
      handleApiError(err, "TODOの更新に失敗しました");
    }
  }, [ todos, error ]); // todos と error を依存配列に追加

  // TODOを削除する関数
  const handleDeleteTodo = useCallback(async (id : number) => {
    // if (!window.confirm("このTODOを本当に削除しますか？")) { // 確認ダイアログ (オプション)
    //   return;
    // }
    try {
      await axios.delete(`${ API_BASE_URL }/${ id }`);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      if ( error ) setError(null);
    } catch ( err ) {
      handleApiError(err, "TODOの削除に失敗しました");
    }
  }, [ error ]); // error を依存配列に追加

  // ローディング中の表示
  if ( loading ) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-10 shadow-lg flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400 mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">TODOリストを読み込み中です...</p>
        </div>
      </div>
    );
  }

  // エラー発生時の表示
  if ( error && !loading ) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-8 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/40 border-l-4 border-red-500 dark:border-red-600 rounded-xl shadow-lg text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-bold text-red-700 dark:text-red-300">エラーが発生しました</p>
          <p className="mt-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 p-3 rounded-lg inline-block">{ error }</p>
          <button
            onClick={ fetchTodos }
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-900"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto px-4"> {/* 上下のパディング、最大幅、中央寄せ、左右のパディング */ }
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        TODOリスト
      </h1>

      <AddTodoForm onAddTodo={ handleAddNewTodo } currentTheme={ currentTheme }/>

      <TodoList
        todos={ todos }
        onToggleComplete={ handleToggleComplete }
        onDeleteTodo={ handleDeleteTodo }
      />
    </div>
  );
};

export default HomePage;
