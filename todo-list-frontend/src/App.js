import './App.css';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Todos = ({todos, getTodos}) => {

  const [inputValue, setInputValue] = useState('');  
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState('');

  const handleVisibility = () => {
    setInputVisibility(!inputVisibility)
  }

  const createTodo = async () => {
    await axios.post('http://localhost:3333/todos', {
      name: inputValue
    });
    getTodos();
    setInputVisibility(!inputVisibility);
    setInputValue('')
  }

  const deleteTodo = async (todo) => {
    await axios.delete(`http://localhost:3333/todos/${todo.id}`)
    getTodos();
  }

  const editTodo = async (todo) => {
    await axios.put('http://localhost:3333/todos', {
      id: selectedTodo.id,
      name: inputValue,
    })
    setSelectedTodo('');
    setInputVisibility(false);
    getTodos();
    setInputValue('');
  }

  const handleEditButton = async (todo) => {
    setSelectedTodo(todo);
    setInputVisibility(true)
  }

  const modifyStatus = async (todo) => {
    await axios.put('http://localhost:3333/todos', {
      id: todo.id,
      status: !todo.status
    })
    getTodos();
  }

  return (
    <div>
      <div className="App">
        <header className="container">
          <div className="header">
            <h1>Lista de tarefas</h1>
          </div>
          <div className="todos">
            {todos.map((todo) => {
              return (
                <div className="todo" key={todo.id}>
                  <button 
                    onClick={() => modifyStatus(todo)}
                    className="checkbox" 
                    style={{backgroundColor: todo.status ? 'purple':'white'}}
                  />
                  <p>{todo.name}</p>
                  <button>
                    <AiOutlineEdit 
                      onClick={() => handleEditButton(todo)}
                      color={'green'}
                      size={20}
                    />
                  </button>
                  <button onClick={() => deleteTodo(todo)}>
                    <AiOutlineDelete 
                      color={'red'}
                      size={20}
                    />
                  </button>
                </div>
              )
            })}
          </div>
          <input 
            value={inputValue}
            className="inputName"
            onChange={(e) => setInputValue(e.target.value)}
            style={{display: inputVisibility ? 'block' : 'none'}}
          >
          </input>
          <button 
            onClick={inputVisibility ? selectedTodo ? editTodo : createTodo : handleVisibility} 
            className="newTaskButton"
          >
            {inputVisibility ? 'Confirmar' : 'Adicionar'}
          </button>
        </header>
      </div>
    </div>
  )
}

function App() { 

  const [todos, setTodos] = useState([])

  const getTodos = async () => {
    const response = await axios.get('http://localhost:3333/todos')
    setTodos(response.data)
  }

  useEffect(() => {
    getTodos()
  }, [])

  return (
    <Todos todos={todos} getTodos={getTodos}/>
  );
}

export default App;
