import { create } from 'zustand';
import type { Todo, TodoFilter, TodoStore } from '@todo-starter/utils';

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [
    {
      id: '1',
      text: 'Learn React Router 7',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      text: 'Set up Tailwind CSS',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      text: 'Build a todo app',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  filter: 'all',

  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set(state => ({
      todos: [...state.todos, newTodo]
    }));
  },

  toggleTodo: (id: string) => {
    set(state => ({
      todos: state.todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    }));
  },

  deleteTodo: (id: string) => {
    set(state => ({
      todos: state.todos.filter(todo => todo.id !== id)
    }));
  },

  updateTodo: (id: string, text: string) => {
    set(state => ({
      todos: state.todos.map(todo =>
        todo.id === id
          ? { ...todo, text: text.trim(), updatedAt: new Date() }
          : todo
      )
    }));
  },

  setFilter: (filter: TodoFilter) => {
    set({ filter });
  },

  clearCompleted: () => {
    set(state => ({
      todos: state.todos.filter(todo => !todo.completed)
    }));
  }
}));

export const getFilteredTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

