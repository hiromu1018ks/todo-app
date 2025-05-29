import React from "react";

interface Todo {
  id : number;
  title : string;
  completed : boolean;
}

interface TodoItemProps {
  todo : Todo;
  onToggleComplete : (id : number, currentCompletedStatus : boolean) => Promise<void>;
  onDeleteTodo : (id : number) => Promise<void>;
}

const TodoItem : React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDeleteTodo }) => {
  return (
    <li
      className={ `p-4 rounded-lg shadow-lg flex justify-between items-center transition-all duration-300 ease-in-out transform hover:scale-105 group ${
        todo.completed
          ? 'bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 dark:border-green-600'
          : 'bg-white dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-600'
      }` }
    >
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={ todo.completed }
          onChange={ () => onToggleComplete(todo.id, todo.completed) }
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

      <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
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
          onClick={ () => onDeleteTodo(todo.id) }
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
  );
}

export default TodoItem;