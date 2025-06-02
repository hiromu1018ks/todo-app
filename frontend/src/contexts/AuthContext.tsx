// frontend/src/contexts/AuthContext.tsx
import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // API呼び出しやデフォルトヘッダー設定のため

// ユーザー情報の型 (必要に応じて拡張)
interface User {
  id : number;
  username : string;
  // roles?: string[]; // ロール情報もあれば
}

// AuthContextが提供する値の型
interface AuthContextType {
  token : string | null;
  user : User | null;
  isAuthenticated : boolean;
  isLoading : boolean; // 認証情報を読み込み中かどうかのフラグ
  login : (newToken : string, userData : User) => void;
  logout : () => void;
}

// Contextオブジェクトを作成 (初期値はundefinedでも良いが、型を満たすデフォルト値を設定)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProviderコンポーネント (このコンポーネントでContextの値を提供する)
interface AuthProviderProps {
  children : ReactNode; // 子コンポーネントを受け取る
}

export const AuthProvider : React.FC<AuthProviderProps> = ({ children }) => {
  const [ token, setToken ] = useState<string | null>(null);
  const [ user, setUser ] = useState<User | null>(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false);
  const [ isLoading, setIsLoading ] = useState<boolean>(true); // 初期読み込み中はtrue

  // アプリケーション初回読み込み時にlocalStorageからトークンとユーザー情報を復元する
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserString = localStorage.getItem('authUser');

    if ( storedToken && storedUserString ) {
      try {
        const storedUser = JSON.parse(storedUserString) as User;
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        // axiosのデフォルトヘッダーにAuthorizationトークンを設定
        axios.defaults.headers.common['Authorization'] = `Bearer ${ storedToken }`;
      } catch ( error ) {
        console.error("Failed to parse stored user data:", error);
        // 不正なデータならクリアする
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false); // 読み込み完了
  }, []); // マウント時に1回だけ実行

  const login = (newToken : string, userData : User) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    // axiosのデフォルトヘッダーにAuthorizationトークンを設定
    axios.defaults.headers.common['Authorization'] = `Bearer ${ newToken }`;
    // ここでバックエンドのAPIを呼び出すのではなく、
    // ログインページでAPIを呼び出し、成功したらこのlogin関数を呼び出す想定
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // axiosのデフォルトヘッダーからAuthorizationトークンを削除
    delete axios.defaults.headers.common['Authorization'];
    // ログアウト後にログインページなどにリダイレクトする処理は呼び出し元で行う
  };

  // Contextに渡す値
  const contextValue : AuthContextType = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ contextValue }>
      { children }
    </AuthContext.Provider>
  );
};

// Contextの値を簡単に利用するためのカスタムフック
export const useAuth = () : AuthContextType => {
  const context = useContext(AuthContext);
  if ( context === undefined ) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};