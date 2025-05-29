import TodoItem from "./TodoItem.tsx";
import React from "react";

interface Todo {
  id : number;
  title : string;
  completed : boolean;
}

interface TodoListProps {
  todos : Todo[];
  onToggleComplete : (id : number, currentCompletedStatus : boolean) => Promise<void>;
  onDeleteTodo : (id : number) => Promise<void>;
}

const TodoList : React.FC<TodoListProps> = ({ todos, onToggleComplete, onDeleteTodo }) => {
  if ( todos.length === 0 ) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500 dark:text-gray-400">素晴らしい！TODOは全て完了しています。</p>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      { todos.map(todo => (
        <TodoItem
          todo={ todo }
          onToggleComplete={ onToggleComplete }
          onDeleteTodo={ onDeleteTodo }
        />
      )) }
    </ul>
  )
}

export default TodoList;