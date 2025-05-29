import { useEffect, useState } from 'react';
import axios from 'axios';

// Todo interface
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// API base URL
export const API_BASE_URL = 'http://localhost:8080/api/todos';

/**
 * Custom hook for managing todos
 * Handles fetching, adding, updating, and deleting todos
 */
export const useTodos = () => {
  // State for todos, loading, and error
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Todo[]>(API_BASE_URL);
      setTodos(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`APIデータの取得に失敗しました: ${err.message}`);
        console.error('Axios error fetching todos:', err.response?.data || err.message);
      } else {
        setError('TODOリストの取得中に予期せぬエラーが発生しました。');
        console.error('Unexpected error fetching todos:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (title: string) => {
    try {
      const response = await axios.post<Todo>(API_BASE_URL, {
        title: title,
        completed: false
      });
      setTodos(prevTodos => [...prevTodos, response.data]);
      if (error) setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`TODOの追加に失敗しました：${err.message}`);
        console.error("バックエンドAPIにPOSTリクエストを送信して新しいTODOを作成");
      } else {
        setError('TODOの追加中に予期せぬエラーが発生しました。');
        console.error('Unexpected error adding todo:', err);
      }
    }
  };

  // Toggle todo completion status
  const toggleTodoComplete = async (id: number, currentCompletedStatus: boolean): Promise<void> => {
    const newCompleteState = !currentCompletedStatus;

    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) {
        console.error('更新対象のTODOが見つかりません。ID:', id);
        setError('更新対象のTODOが見つかりませんでした。');
        return;
      }

      const updatedTodoData = { ...todoToUpdate, completed: newCompleteState };
      const response = await axios.put<Todo>(`${API_BASE_URL}/${id}`, updatedTodoData);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? response.data : todo
        )
      );
      if (error) setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`TODOの更新に失敗しました: ${err.message}`);
        console.error('Axios error updating todo:', err.response?.data || err.message);
      } else {
        setError('TODOの更新中に予期せぬエラーが発生しました。');
        console.error('Unexpected error updating todo:', err);
      }
    }
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      if (error) setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`TODOの削除に失敗しました: ${err.message}`);
        console.error('Axios error deleting todo:', err.response?.data || err.message);
      } else {
        setError('TODOの削除中に予期せぬエラーが発生しました。');
        console.error('Unexpected error deleting todo:', err);
      }
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodoComplete,
    deleteTodo
  };
};

export default useTodos;
