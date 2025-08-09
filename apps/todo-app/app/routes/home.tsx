import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@todo-starter/ui';
import { Button } from '@lambdacurry/forms/ui';
import { AddTodo } from '~/components/add-todo';
import { TodoItem } from '~/components/todo-item';
import { TodoFilters } from '~/components/todo-filters';
import { useTodoStore, getFilteredTodos } from '~/lib/todo-context';
import { Settings } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Todo App - React Router 7 Starter' },
    { name: 'description', content: 'A modern todo app built with React Router 7' }
  ];
};

export default function Home() {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, updateTodo, setFilter, clearCompleted } = useTodoStore();

  const filteredTodos = getFilteredTodos(todos, filter);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Todo App</h1>
            <p className="text-muted-foreground">
              Built with React Router 7, Tailwind CSS, shadcn/ui, and @lambdacurry/forms
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/create-todo">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Todo Form
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Todo</CardTitle>
            <CardDescription>What would you like to accomplish today?</CardDescription>
          </CardHeader>
          <CardContent>
            <AddTodo onAdd={addTodo} />
          </CardContent>
        </Card>

        {todos.length > 0 && (
          <>
            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />

            <div className="space-y-2">
              {filteredTodos.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {filter === 'active' && 'No active todos'}
                      {filter === 'completed' && 'No completed todos'}
                      {filter === 'all' && 'No todos found'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                  />
                ))
              )}
            </div>
          </>
        )}

        {todos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No todos yet. Add one above to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
