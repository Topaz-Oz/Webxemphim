// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/rootLayout'; // Import RootLayout
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import MoviePage from '../pages/MoviePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FavoritesPage from '../pages/FavoritesPage';
import AdminDashboard from '../pages/AdminDashboard';
import { PrivateRoute, AdminRoute } from './ProtectedRoutes';
import ErrorPage from '../pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Bọc AuthProvider ở đây
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'movie/:slug', element: <MoviePage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          {
            path: 'favorites',
            element: (
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            ),
          },
          {
            path: 'admin',
            element: (
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            ),
          },
          {
            path: 'auth/callback',
            element: <HomePage />, // Hoặc Navigate tùy logic bạn xử lý
          },
        ],
      },
    ],
  },
]);
