import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/app/components/MainLayout';
import { ClientDashboard } from '@/app/pages/ClientDashboard';
import { EmptyState } from '@/app/pages/EmptyState';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: EmptyState,
      },
      {
        path: 'client/:clientId',
        Component: ClientDashboard,
      },
    ],
  },
]);
