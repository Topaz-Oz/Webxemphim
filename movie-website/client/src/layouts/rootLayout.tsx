// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

const RootLayout = () => {
  return (
    <AuthProvider>
      {/* Optional: bạn có thể đặt Header/Footer/Sidebar ở đây */}
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
