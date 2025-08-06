# Lambda Curry Forms Integration

This document outlines the integration of the `@lambdacurry/forms` library into the React Router 7 starter project.

## 🚀 What's Been Added

### Dependencies
- `@lambdacurry/forms` - The main forms library
- `@hookform/resolvers` - Zod resolver for React Hook Form
- `react-hook-form` - Form state management
- `remix-hook-form` - React Router integration
- `zod` - Schema validation

### Cursor Rules
- Added `.cursorrules/lambda-curry-forms.mdc` with comprehensive guidelines for using the forms library
- Includes patterns, best practices, and component usage examples

### Components Updated

#### 1. AddTodo Component (`apps/todo-app/app/components/add-todo.tsx`)
**Before:** Basic React state with manual form handling
```tsx
const [text, setText] = useState('');
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (text.trim()) {
    onAdd(text.trim());
    setText('');
  }
};
```

**After:** Lambda Curry forms with Zod validation
```tsx
const addTodoSchema = z.object({
  text: z.string().min(1, 'Todo text is required').trim(),
});

const methods = useRemixForm<AddTodoFormData>({
  resolver: zodResolver(addTodoSchema),
  defaultValues: { text: '' },
  submitHandlers: {
    onValid: (data) => {
      onAdd(data.text);
      methods.reset();
    },
  },
});
```

#### 2. TodoItem Component (`apps/todo-app/app/components/todo-item.tsx`)
**Enhanced editing functionality:**
- Replaced manual input handling with `TextField` component
- Added Zod validation for edit operations
- Integrated `FormError` component for error display
- Maintained keyboard shortcuts (Enter to save, Escape to cancel)

### New Routes

#### 3. Advanced Todo Creation (`apps/todo-app/app/routes/create-todo.tsx`)
A comprehensive form demonstrating all major features:

**Form Fields:**
- **Title** - Required text field with length validation
- **Description** - Optional multiline text field
- **Priority** - RadioGroup with low/medium/high options
- **Category** - Required text field
- **Due Date** - Optional DatePicker
- **Tags** - Optional text field
- **Is Urgent** - Checkbox for boolean flag

**Features Demonstrated:**
- ✅ Server-side validation with `getValidatedFormData`
- ✅ Client-side validation with Zod schemas
- ✅ Form-level error handling with `FormError`
- ✅ Progressive enhancement (works without JS)
- ✅ Type-safe form data with TypeScript
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Loading states and success feedback

## 🎯 Key Benefits

### 1. Type Safety
```tsx
type CreateTodoFormData = z.infer<typeof createTodoSchema>;
// Automatic TypeScript types from Zod schema
```

### 2. Validation
```tsx
const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level',
  }),
});
```

### 3. Server Integration
```tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<CreateTodoFormData>(
    request, 
    zodResolver(createTodoSchema)
  );
  
  if (errors) return { errors };
  // Process valid data...
};
```

### 4. Error Handling
```tsx
// Form-level errors
<FormError />

// Field-level errors (automatic)
<TextField name="title" label="Title" />
```

## 🧪 Testing the Integration

### 1. Basic Todo Creation
- Navigate to the home page
- Use the "Add Todo" form (now powered by Lambda Curry forms)
- Try submitting empty text to see validation

### 2. Todo Editing
- Create a todo and click the edit button
- Try clearing the text and saving to see validation
- Use Enter/Escape keys for save/cancel

### 3. Advanced Form
- Click "Advanced Todo Form" button
- Fill out the comprehensive form
- Try various validation scenarios:
  - Submit without required fields
  - Enter "error" in title to trigger server error
  - Test all form components

## 📚 Component Usage Patterns

### TextField
```tsx
<TextField
  name="fieldName"
  label="Field Label"
  placeholder="Enter text..."
  required
/>
```

### RadioGroup
```tsx
<RadioGroup
  name="priority"
  label="Priority Level"
  options={[
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ]}
/>
```

### Checkbox
```tsx
<Checkbox
  name="isUrgent"
  label="Mark as urgent"
/>
```

### DatePicker
```tsx
<DatePicker
  name="dueDate"
  label="Due Date (Optional)"
/>
```

## 🔧 Development Workflow

1. **Define Schema:** Create Zod schema for validation
2. **Setup Form:** Use `useRemixForm` with resolver
3. **Add Components:** Use Lambda Curry form components
4. **Handle Submission:** Implement server action with `getValidatedFormData`
5. **Error Handling:** Add `FormError` component for form-level errors

## 🎨 Styling Integration

The forms library integrates seamlessly with:
- **Tailwind CSS** - All components are styled with Tailwind
- **shadcn/ui** - Compatible with existing design system
- **Dark Mode** - Supports theme switching
- **Responsive Design** - Mobile-first approach

## 📖 Next Steps

1. **Install Dependencies:** Run `bun install` to install new packages
2. **Run Development:** Use `bun run dev` to start the development server
3. **Explore Examples:** Navigate through the updated components and new route
4. **Read Cursor Rules:** Review `.cursorrules/lambda-curry-forms.mdc` for detailed guidelines

## 🔗 Resources

- [Lambda Curry Forms Documentation](https://raw.githubusercontent.com/lambda-curry/forms/refs/heads/main/llms.txt)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Remix Hook Form](https://github.com/Code-Forge-Net/remix-hook-form)

---

This integration provides a solid foundation for building type-safe, accessible, and maintainable forms in React Router 7 applications using the Lambda Curry forms library.
