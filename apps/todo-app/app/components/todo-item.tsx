import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { TextField, FormError } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui';
import { Checkbox } from '@todo-starter/ui';
import { cn } from '@todo-starter/utils';
import type { Todo } from '@todo-starter/utils';

const editTodoSchema = z.object({
  text: z.string().min(1, 'Todo text is required').trim()
});

type EditTodoFormData = z.infer<typeof editTodoSchema>;

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const methods = useRemixForm<EditTodoFormData>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: { text: todo.text },
    submitHandlers: {
      onValid: data => {
        if (data.text !== todo.text) {
          onUpdate(todo.id, data.text);
        }
        setIsEditing(false);
      }
    }
  });

  const handleCancel = () => {
    setIsEditing(false);
    methods.reset({ text: todo.text });
  };

  const handleEdit = () => {
    setIsEditing(true);
    methods.reset({ text: todo.text });
  };

  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
      <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="flex-shrink-0" />

      {isEditing ? (
        <RemixFormProvider {...methods}>
          <form onSubmit={methods.handleSubmit} className="flex-1 flex items-center gap-2">
            <div className="flex-1">
              <TextField name="text" className="w-full" autoFocus />
            </div>
            <Button size="icon" variant="ghost" type="submit">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" type="button" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </form>
          <FormError name="_form" />
        </RemixFormProvider>
      ) : (
        <>
          <span className={cn('flex-1 text-left', todo.completed && 'line-through text-muted-foreground')}>
            {todo.text}
          </span>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={handleEdit} className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
