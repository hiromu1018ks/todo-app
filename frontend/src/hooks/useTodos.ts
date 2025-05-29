import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * TO-DOアイテムの型定義
 * id: TO-DOの一意の識別子
 * title: TO-DOのタイトル（内容）
 * completed: 完了状態（true: 完了済み、false: 未完了）
 */
export interface Todo {
  id : number;
  title : string;
  completed : boolean;
}

/**
 * APIのベースURL
 * バックエンドサーバーのエンドポイントを指定
 */
export const API_BASE_URL = 'http://localhost:8080/api/todos';

/**
 * TO-DOリストを管理するカスタムフック
 *
 * 機能:
 * - TO-DOリストの取得（GET）
 * - 新しいTO-DOの追加（POST）
 * - TO-DOの更新（PUT）
 * - TO-DOの削除（DELETE）
 * - ローディング状態の管理
 * - エラー状態の管理
 */
export const useTodos = () => {
  // TO-DOリストを保持する状態
  const [ todos, setTodos ] = useState<Todo[]>([]);
  // データ読み込み中かどうかを示す状態
  const [ loading, setLoading ] = useState<boolean>(true);
  // エラーメッセージを保持する状態（エラーがない場合はnull）
  const [ error, setError ] = useState<string | null>(null);

  // コンポーネントのマウント時にTO-DOリストを取得
  useEffect(() => {
    fetchTodos();
  }, []); // 空の依存配列で初回レンダリング時のみ実行

  /**
   * APIからTO-DOリストを取得する関数
   *
   * 処理の流れ:
   * 1. ローディング状態をtrueに設定
   * 2. エラー状態をクリア
   * 3. APIからデータを取得
   * 4. 取得したデータでTO-DO状態を更新
   * 5. エラー発生時はエラーメッセージを設定
   * 6. 最後にローディング状態をfalseに設定
   */
  const fetchTodos = async () => {
    try {
      // データ取得開始前の準備
      setLoading(true);
      setError(null);

      // APIからTO-DOリストを取得
      const response = await axios.get<Todo[]>(API_BASE_URL);
      // 取得したデータでTO-DO状態を更新
      setTodos(response.data);
    } catch ( err ) {
      // エラー処理
      if ( axios.isAxiosError(err) ) {
        // Axiosからのエラー（ネットワークエラーやサーバーエラーなど）
        setError(`APIデータの取得に失敗しました: ${ err.message }`);
        console.error('Axios error fetching todos:', err.response?.data || err.message);
      } else {
        // その他の予期せぬエラー
        setError('TODOリストの取得中に予期せぬエラーが発生しました。');
        console.error('Unexpected error fetching todos:', err);
      }
    } finally {
      // 成功・失敗に関わらず最後に実行
      setLoading(false);
    }
  };

  /**
   * 新しいTO-DOを追加する関数
   *
   * 処理の流れ:
   * 1. APIに新しいTO-DOのデータをPOSTリクエストで送信
   * 2. レスポンスで返ってきたTO-DOを状態に追加
   * 3. エラーがあれば解除
   * 4. エラー発生時はエラーメッセージを設定
   *
   * @param title 新しいTO-DOのタイトル
   */
  const addTodo = async (title : string) => {
    try {
      // APIに新しいTO-DOのデータを送信
      const response = await axios.post<Todo>(API_BASE_URL, {
        title : title,      // TO-DOのタイトル
        completed : false   // 初期状態は未完了
      });

      // 既存のTO-DOリストに新しいTO-DOを追加
      setTodos(prevTodos => [ ...prevTodos, response.data ]);

      // エラーがあれば解除
      if ( error ) setError(null);
    } catch ( err ) {
      // エラー処理
      if ( axios.isAxiosError(err) ) {
        // Axiosからのエラー
        setError(`TODOの追加に失敗しました：${ err.message }`);
        console.error("バックエンドAPIにPOSTリクエストを送信して新しいTODOを作成");
      } else {
        // その他の予期せぬエラー
        setError('TODOの追加中に予期せぬエラーが発生しました。');
        console.error('Unexpected error adding todo:', err);
      }
    }
  };

  /**
   * TO-DOの完了状態を切り替える関数
   *
   * 処理の流れ:
   * 1. 現在の完了状態を反転
   * 2. 更新対象のTO-DOを検索
   * 3. 見つからなければエラーを設定して終了
   * 4. 見つかった場合、更新データを作成
   * 5. APIにPUTリクエストで更新データを送信
   * 6. 状態を更新
   * 7. エラー発生時はエラーメッセージを設定
   *
   * @param id 更新するTO-DOのID
   * @param currentCompletedStatus 現在の完了状態
   */
  const toggleTodoComplete = async (id : number, currentCompletedStatus : boolean) : Promise<void> => {
    // 現在の完了状態を反転（true→false、false→true）
    const newCompleteState = !currentCompletedStatus;

    try {
      // 更新対象のTO-DOをIDで検索
      const todoToUpdate = todos.find(todo => todo.id === id);
      if ( !todoToUpdate ) {
        // TO-DOが見つからない場合はエラーを設定して終了
        console.error('更新対象のTODOが見つかりません。ID:', id);
        setError('更新対象のTODOが見つかりませんでした。');
        return;
      }

      // 更新データを作成（スプレッド構文で既存のデータをコピーし、completedのみ更新）
      const updatedTodoData = { ...todoToUpdate, completed : newCompleteState };

      // APIに更新データを送信
      const response = await axios.put<Todo>(`${ API_BASE_URL }/${ id }`, updatedTodoData);

      // 状態を更新（IDが一致するTO-DOのみ更新、それ以外はそのまま）
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? response.data : todo
        )
      );

      // エラーがあれば解除
      if ( error ) setError(null);
    } catch ( err ) {
      // エラー処理
      if ( axios.isAxiosError(err) ) {
        // Axiosからのエラー
        setError(`TODOの更新に失敗しました: ${ err.message }`);
        console.error('Axios error updating todo:', err.response?.data || err.message);
      } else {
        // その他の予期せぬエラー
        setError('TODOの更新中に予期せぬエラーが発生しました。');
        console.error('Unexpected error updating todo:', err);
      }
    }
  };

  /**
   * TO-DOを削除する関数
   *
   * 処理の流れ:
   * 1. 削除確認ダイアログを表示
   * 2. キャンセルされた場合は何もせずに終了
   * 3. 確認された場合、APIにDELETEリクエストを送信
   * 4. 状態から削除されたTO-DOを除外
   * 5. エラー発生時はエラーメッセージを設定
   *
   * @param id 削除するTO-DOのID
   */
  const deleteTodo = async (id : number) => {
    // 削除前に確認ダイアログを表示
    if ( !window.confirm('本当に削除しますか？') ) return;

    try {
      // APIに削除リクエストを送信
      await axios.delete(`${ API_BASE_URL }/${ id }`);

      // 状態から削除されたTO-DOを除外
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

      // エラーがあれば解除
      if ( error ) setError(null);
    } catch ( err ) {
      // エラー処理
      if ( axios.isAxiosError(err) ) {
        // Axiosからのエラー
        setError(`TODOの削除に失敗しました: ${ err.message }`);
        console.error('Axios error deleting todo:', err.response?.data || err.message);
      } else {
        // その他の予期せぬエラー
        setError('TODOの削除中に予期せぬエラーが発生しました。');
        console.error('Unexpected error deleting todo:', err);
      }
    }
  };

  // フックから返すオブジェクト
  // これらの値と関数は、このフックを使用するコンポーネントで利用できる
  return {
    todos,              // TO-DOリスト配列
    loading,            // データ読み込み中かどうかを示すフラグ
    error,              // エラーメッセージ（エラーがない場合はnull）
    addTodo,            // 新しいTO-DOを追加する関数
    toggleTodoComplete, // TO-DOの完了状態を切り替える関数
    deleteTodo          // TO-DOを削除する関数
  };
};

export default useTodos;
