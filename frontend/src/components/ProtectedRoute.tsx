// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute : React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // 現在のURLの情報を取得

  if ( isLoading ) {
    // 認証情報を読み込み中は何も表示しないか、ローディングスピナーを表示
    return <div className="min-h-screen flex items-center justify-center">認証情報を確認中...</div>;
  }

  if ( !isAuthenticated ) {
    // 認証されていない場合、ログインページにリダイレクト
    // リダイレクト後、ログインに成功したら元のページに戻れるように、現在のパスをstateとして渡す
    return <Navigate to="/login" state={ { from : location } } replace/>;
  }

  // 認証されている場合、子コンポーネント (Outlet) を表示
  return <Outlet/>;
};

export default ProtectedRoute;