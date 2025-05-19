// App.tsx
import { ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </ThemeProvider>
  );
}

export default App;
