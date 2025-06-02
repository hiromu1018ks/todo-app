// frontend/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // (1) ページ遷移のためのフックをインポート
import { useAuth } from '../contexts/AuthContext'; // (2) 作成したAuthContextのカスタムフックをインポート

// バックエンドAPIのログインエンドポイントURL
const LOGIN_API_URL = 'http://localhost:8080/api/auth/login';

// バックエンドからのレスポンスの型 (JwtResponse.java に合わせる)
interface LoginResponse {
  token : string;
  type : string;
  id : number;
  username : string;
  // roles?: string[]; // もしロール情報もあれば
}

const LoginPage : React.FC = () => {
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const navigate = useNavigate(); // (3) ページ遷移用のnavigate関数を取得
  const auth = useAuth(); // (4) AuthContextから認証関連の関数や状態を取得

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // エラーメッセージをリセット
    setIsLoading(true);

    if ( !username || !password ) {
      setError('ユーザー名とパスワードを入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      // (5) バックエンドのログインAPIを呼び出す
      const response = await axios.post<LoginResponse>(LOGIN_API_URL, {
        username,
        password,
      });

      // (6) ログイン成功時: AuthContextのlogin関数を呼び出し、トークンとユーザー情報を保存
      if ( response.data && response.data.token ) {
        const userData = {
          id : response.data.id,
          username : response.data.username,
          // roles: response.data.roles, // もしあれば
        };
        auth.login(response.data.token, userData); // AuthContextのlogin関数を実行

        // (7) ログイン成功後、ホームページ (TODOリストページ) にリダイレクト
        navigate('/'); // ルートパスに遷移
      } else {
        setError('ログインに失敗しました。無効なレスポンスです。');
      }
    } catch ( err ) {
      if ( axios.isAxiosError(err) && err.response ) {
        if ( err.response.status === 401 ) {
          setError('ユーザー名またはパスワードが間違っています。');
        } else {
          setError(`ログインエラー: ${ err.response.data?.message || err.message }`);
        }
        console.error('Login API error:', err.response.data || err.message);
      } else {
        setError('ログイン中に予期せぬエラーが発生しました。');
        console.error('Unexpected error during login:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          ログイン
        </h1>
        <form onSubmit={ handleSubmit } className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ユーザー名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={ username }
              onChange={ (e) => setUsername(e.target.value) }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={ isLoading }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={ password }
              onChange={ (e) => setPassword(e.target.value) }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={ isLoading }
            />
          </div>

          { error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded">
              { error }
            </p>
          ) }

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              { isLoading ? 'ログイン処理中...' : 'ログイン' }
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          アカウントをお持ちでないですか？{ ' ' }
          {/* 後で登録ページへのリンクを追加 */ }
          <a href="#" onClick={ (e) => {
            e.preventDefault();
            alert('登録ページは準備中です！')
          } } className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            新規登録はこちら
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
