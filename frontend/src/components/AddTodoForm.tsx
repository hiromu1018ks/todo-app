import { useState } from "react";

interface AddTodoFormProps {
  onAddTodo : (title : string) => Promise<void>;
  currentTheme? : 'light' | 'dark';
}

const AddTodoForm : React.FC<AddTodoFormProps> = ({ onAddTodo, currentTheme }) => {
  const [ newTodoTitle, setNewTodoTitle ] = useState<string>('');

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //
    if ( !newTodoTitle.trim() ) {
      alert("TODOのタイトルを入力してください。");
      return;
    }
    await onAddTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <form onSubmit={ handleSubmit } className='mb-8 flex gap-3'>
      <input
        type='text'
        value={ newTodoTitle }
        onChange={ (e) => setNewTodoTitle(e.target.value) }
        placeholder="新しいTODOを入力..."
        className={ `flex-grow p-3 border rounded-lg shadow-sm 
                    focus:ring-2 focus:border-transparent outline-none transition-colors duration-200
                    ${ currentTheme === 'dark'
          ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-blue-400'
          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500'
        }` }
      />
      <button
        type="submit"
        className={ `px-6 py-3 font-semibold rounded-lg shadow-md 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                   ${ currentTheme === 'dark'
          ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 focus:ring-offset-gray-900'
          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600 focus:ring-offset-gray-100'
        }` }
      >
        追加
      </button>
    </form>
  )
}

export default AddTodoForm;