import { Box, Container, CssBaseline, Typography, Link, CircularProgress } from '@mui/material';
import { Outlet, useNavigation } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="/">
            PhimHay
          </Link>
          {' - Website xem phim trực tuyến'}
        </Typography>
      </Container>
    </Box>
  );
}

function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}

export default function MainLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 12, sm: 10 }, // Space for fixed navbar and mobile search
          pb: 3,
        }}
      >
        <Container maxWidth="xl">
          {isLoading ? <LoadingOverlay /> : <Outlet />}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
