import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@todo-starter/ui';
import type { ActionFunctionArgs, MetaFunction } from 'react-router';
import { useFetcher } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { ContactForm, contactFormSchema, type ContactFormData } from '~/components/contact-form';

export const meta: MetaFunction = () => {
  return [
    { title: 'Contact - React Router 7 Starter' },
    { name: 'description', content: 'Example contact form with Zod validation and action handler' }
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<ContactFormData>(
    request,
    zodResolver(contactFormSchema)
  );

  if (errors) return { errors };

  try {
    // Simulate sending the message (e.g. to an API or email service)
    console.log('Contact submission:', data);
    return { message: 'Thanks! Your message has been sent.' };
  } catch (_error) {
    return {
      errors: {
        _form: { message: 'Failed to send. Please try again.' }
      }
    };
  }
};

export default function Contact() {
  const fetcher = useFetcher<{
    message?: string;
    errors?: Record<string, { message: string }>;
  }>();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground mt-1">
            Example form using @lambdacurry/forms, Zod validation, and getValidatedFormData.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
            <CardDescription>Fill out the form below. Validation runs on client and server.</CardDescription>
          </CardHeader>
          <CardContent>
            {fetcher.data?.message && (
              <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✅ {fetcher.data.message}</p>
              </div>
            )}
            <ContactForm fetcher={fetcher} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
