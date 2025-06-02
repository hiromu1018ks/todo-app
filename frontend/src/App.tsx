// frontend/src/App.tsx
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // (1) HomePageをインポート
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [ theme, setTheme ] = useState<'light' | 'dark'>('light');

  // Check system preference for dark mode on initial load
  useEffect(() => {
    if ( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to document body
  useEffect(() => {
    if ( theme === 'dark' ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [ theme ]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if ( isLoading && !isAuthenticated ) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 p-8 rounded-xl shadow-lg border border-blue-100 dark:border-indigo-800 flex items-center space-x-3">
          <div
            className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">アプリケーションを準備中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <nav
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 p-4 shadow-lg sticky top-0 z-50 border-b border-blue-100 dark:border-indigo-800 transition-all duration-300"> {/* sticky top-0 z-50 でナビゲーションを上部固定 */ }
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* アプリロゴ */ }
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <Link to="/"
                  className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text hover:scale-105 transform transition-transform duration-200">
              TODOアプリ
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            { isAuthenticated && user ? (
              <>
                <span
                  className="text-gray-700 dark:text-gray-200 hidden sm:block font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">👋</span> こんにちは、{ user.username } さん
                </span> {/* sm以上で表示 */ }
                <button
                  onClick={ handleLogout }
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                ログイン
              </Link>
            ) }
            {/* テーマ切り替えボタン */ }
            <button
              onClick={ toggleTheme }
              className="p-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 hover:shadow-md shadow-sm transform hover:scale-110 transition-all duration-200"
              aria-label={ theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え' }
            >
              { theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) }
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={ <ProtectedRoute/> }>
          <Route index element={ <HomePage currentTheme={ theme }/> }/> {/* (2) HomePageコンポーネントをここで使用 */ }
        </Route>
        <Route path="/login" element={ <LoginPage/> }/>
        {/* 今後、ユーザー登録ページなどもここに追加できます */ }
        {/* <Route path="/register" element={<RegisterPage />} /> */ }
      </Routes>
    </div>
  );
}

export default App;
