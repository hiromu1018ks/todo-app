import { useEffect, useState } from 'react';

/**
 * テーマ（ライト/ダークモード）を管理するカスタムフック
 * 
 * 機能:
 * - ローカルストレージからテーマ設定の読み込み
 * - テーマの切り替え
 * - DOMへのテーマ適用（darkクラスの追加/削除）
 * - ユーザーのOS設定からの初期テーマ検出
 */
export const useTheme = () => {
  // 現在のテーマ状態（'light'または'dark'）
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // コンポーネントのマウント時にローカルストレージから保存されたテーマを読み込む
  useEffect(() => {
    // ローカルストレージからテーマ設定を取得
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      // 保存されたテーマがある場合はそれを使用
      setTheme(savedTheme);
    } else {
      // 保存されたテーマがない場合はOSの設定を確認
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // OSがダークモード設定ならダーク、そうでなければライトモードを設定
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []); // 空の依存配列で初回レンダリング時のみ実行

  // テーマが変更されたときにDOMに適用し、ローカルストレージに保存
  useEffect(() => {
    if (theme === 'dark') {
      // ダークモードの場合、HTML要素に'dark'クラスを追加
      document.documentElement.classList.add('dark');
    } else {
      // ライトモードの場合、HTML要素から'dark'クラスを削除
      document.documentElement.classList.remove('dark');
    }
    // 現在のテーマをローカルストレージに保存（ページ更新後も維持するため）
    localStorage.setItem('theme', theme);
  }, [theme]); // テーマが変わるたびに実行

  // ライトモードとダークモードを切り替える関数
  const toggleTheme = () => {
    // 前の状態を基に新しい状態を設定（ライト→ダーク、ダーク→ライト）
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default useTheme;
