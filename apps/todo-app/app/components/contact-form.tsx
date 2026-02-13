import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui';
import type { FetcherWithComponents } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').trim()
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormActionData {
  message?: string;
  errors?: Record<string, { message: string }>;
}

interface ContactFormProps {
  /** When provided, form submits via fetcher to the given action (route usage). */
  fetcher?: FetcherWithComponents<ContactFormActionData>;
  /** When provided (e.g. in Storybook), called with validated data on submit. */
  onSubmit?: (data: ContactFormData) => void;
}

const defaultValues: ContactFormData = {
  name: '',
  email: '',
  message: ''
};

export function ContactForm({ fetcher, onSubmit }: ContactFormProps) {
  const methods = useRemixForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    ...(fetcher && {
      fetcher,
      submitConfig: { action: '/contact', method: 'post' }
    }),
    ...(onSubmit && {
      submitHandlers: {
        onValid: data => {
          onSubmit(data);
          methods.reset();
        }
      }
    })
  });

  const isSubmitting = fetcher?.state === 'submitting';

  const formContent = (
    <>
      <TextField name="name" label="Name" placeholder="Your name" required />
      <TextField name="email" type="email" label="Email" placeholder="you@example.com" required />
      <TextField name="message" label="Message" placeholder="Your message..." required />
      <FormError name="_form" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
    </>
  );

  return (
    <RemixFormProvider {...methods}>
      {fetcher ? (
        <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-4">
          {formContent}
        </fetcher.Form>
      ) : (
        <form onSubmit={methods.handleSubmit} className="space-y-4">
          {formContent}
        </form>
      )}
    </RemixFormProvider>
  );
}
