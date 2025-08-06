import type { MetaFunction, ActionFunctionArgs } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { RemixFormProvider, useRemixForm, getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';
import { useFetcher, useNavigate } from 'react-router';
import { TextField, Checkbox, RadioGroup, DatePicker, FormError } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@todo-starter/ui';
import type { Todo } from '@todo-starter/utils';
import { ArrowLeft, Plus } from 'lucide-react';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level'
  }),
  dueDate: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  isUrgent: z.boolean().default(false),
  tags: z.string().optional()
});

type CreateTodoFormData = z.infer<typeof createTodoSchema>;

export const meta: MetaFunction = () => {
  return [
    { title: 'Create Todo - React Router 7 Starter' },
    { name: 'description', content: 'Create a new todo with advanced options' }
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<CreateTodoFormData>(request, zodResolver(createTodoSchema));

  if (errors) return { errors };

  try {
    // Here you would typically save to a database
    // For now, we'll just simulate success
    console.log('Creating todo:', data);

    // Simulate potential server-side validation error
    if (data.title.toLowerCase().includes('error')) {
      return {
        errors: {
          _form: { message: 'Something went wrong. Please try again.' }
        }
      };
    }

    return {
      success: true,
      message: 'Todo created successfully!',
      todo: {
        id: Date.now().toString(),
        ...data,
        completed: false,
        createdAt: new Date().toISOString()
      }
    };
  } catch (_error) {
    return {
      errors: {
        _form: { message: 'Failed to create todo. Please try again.' }
      }
    };
  }
};

export default function CreateTodo() {
  const navigate = useNavigate();
  const fetcher = useFetcher<{
    success?: boolean;
    message?: string;
    errors?: Record<string, { message: string }>;
    todo?: Todo;
  }>();

  const methods = useRemixForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: '',
      isUrgent: false,
      tags: ''
    },
    fetcher,
    submitConfig: { action: '/create-todo', method: 'post' }
  });

  const isSubmitting = fetcher.state === 'submitting';

  // Handle successful submission
  if (fetcher.data?.success) {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Todo</h1>
            <p className="text-muted-foreground">Add a new todo with detailed information and options</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todo Details</CardTitle>
            <CardDescription>Fill out the form below to create a new todo item</CardDescription>
          </CardHeader>
          <CardContent>
            <RemixFormProvider {...methods}>
              <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <TextField name="title" label="Title" placeholder="Enter todo title..." required />
                  </div>

                  <div className="md:col-span-2">
                    <TextField
                      name="description"
                      label="Description"
                      placeholder="Optional description..."
                    />
                  </div>

                  <div>
                    <RadioGroup
                      name="priority"
                      label="Priority Level"
                      options={[
                        { value: 'low', label: 'Low Priority' },
                        { value: 'medium', label: 'Medium Priority' },
                        { value: 'high', label: 'High Priority' }
                      ]}
                    />
                  </div>

                  <div>
                    <TextField name="category" label="Category" placeholder="e.g., Work, Personal, Shopping" required />
                  </div>

                  <div>
                    <DatePicker name="dueDate" label="Due Date (Optional)" />
                  </div>

                  <div>
                    <TextField name="tags" label="Tags" placeholder="e.g., important, quick, meeting" />
                  </div>

                  <div className="md:col-span-2">
                    <Checkbox name="isUrgent" label="Mark as urgent" />
                  </div>
                </div>

                {fetcher.data?.success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">✅ {fetcher.data.message}</p>
                    <p className="text-green-600 text-sm mt-1">Redirecting to home page...</p>
                  </div>
                )}

                <FormError />

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Creating Todo...' : 'Create Todo'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={isSubmitting}>
                    Cancel
                  </Button>
                </div>
              </fetcher.Form>
            </RemixFormProvider>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                ✅ <strong>Zod Validation:</strong> Client and server-side validation with custom error messages
              </li>
              <li>
                ✅ <strong>TextField Component:</strong> Single-line and multiline text inputs with validation
              </li>
              <li>
                ✅ <strong>RadioGroup Component:</strong> Priority selection with validation
              </li>
              <li>
                ✅ <strong>DatePicker Component:</strong> Optional date selection
              </li>
              <li>
                ✅ <strong>Checkbox Component:</strong> Boolean field for urgent flag
              </li>
              <li>
                ✅ <strong>FormError Component:</strong> Displays form-level errors from server
              </li>
              <li>
                ✅ <strong>Progressive Enhancement:</strong> Works without JavaScript
              </li>
              <li>
                ✅ <strong>Type Safety:</strong> Full TypeScript integration
              </li>
              <li>
                ✅ <strong>Accessibility:</strong> WCAG 2.1 AA compliant form controls
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
