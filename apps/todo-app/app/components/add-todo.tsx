import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { Plus } from 'lucide-react';
import { TextField, FormError } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui';

const addTodoSchema = z.object({
  text: z.string().min(1, 'Todo text is required').trim()
});

type AddTodoFormData = z.infer<typeof addTodoSchema>;

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const methods = useRemixForm<AddTodoFormData>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: { text: '' },
    submitHandlers: {
      onValid: data => {
        onAdd(data.text);
        methods.reset();
      }
    }
  });

  return (
    <RemixFormProvider {...methods}>
      <form className="flex gap-2" onSubmit={methods.handleSubmit}>
        <div className="flex-1">
          <TextField name="text" placeholder="Add a new todo..." className="w-full" />
        </div>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
      <FormError name="_form" />
    </RemixFormProvider>
  );
}
