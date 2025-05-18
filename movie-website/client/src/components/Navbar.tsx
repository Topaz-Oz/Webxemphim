import { Container, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <AppBar position="fixed">
      <Container>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            PhimHay
          </Typography>

          <IconButton
            size="large"
            color="inherit"
            component={RouterLink}
            to="/search"
          >
            <SearchIcon />
          </IconButton>

          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/favorites"
              >
                Yêu thích
              </Button>
              {user?.role === 'admin' && (
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/admin"
                >
                  Quản lý
                </Button>
              )}
              <IconButton
                size="large"
                color="inherit"
                component={RouterLink}
                to="/profile"
              >
                <AccountCircle />
              </IconButton>
              <Button color="inherit" onClick={logout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Đăng nhập
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/register"
              >
                Đăng ký
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
