import type { Preview } from '@storybook/react';
import type { ComponentType } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { TodoProvider } from '~/lib/todo-context';
import '../app/globals.css';

const withRouter = (Story: ComponentType) => {
  const router = createMemoryRouter([{ path: '/', element: <Story /> }], { initialEntries: ['/'] });
  return <RouterProvider router={router} />;
};

const withTodoProvider = (Story: ComponentType) => (
  <TodoProvider>
    <Story />
  </TodoProvider>
);

const preview: Preview = {
  decorators: [withRouter, withTodoProvider],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
