import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AccountCircle, 
  Menu as MenuIcon,
  Favorite as FavoriteIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {isAuthenticated ? (
          <>
            <ListItem component={RouterLink} to="/favorites" button>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Yêu thích" />
            </ListItem>
            {user?.role === 'admin' && (
              <ListItem component={RouterLink} to="/admin" button>
                <ListItemIcon>
                  <AdminIcon />
                </ListItemIcon>
                <ListItemText primary="Quản lý" />
              </ListItem>
            )}
            <Divider />
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={RouterLink} to="/login" button>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng nhập" />
            </ListItem>
            <ListItem component={RouterLink} to="/register" button>
              <ListItemIcon>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng ký" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Container>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
                mr: 2
              }}
            >
              PhimHay
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, mx: 2 }}>
                <SearchBar />
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <>
                    <Button 
                      color="inherit" 
                      component={RouterLink} 
                      to="/favorites"
                      startIcon={<FavoriteIcon />}
                    >
                      Yêu thích
                    </Button>
                    {user?.role === 'admin' && (
                      <Button 
                        color="inherit" 
                        component={RouterLink} 
                        to="/admin"
                        startIcon={<AdminIcon />}
                      >
                        Quản lý
                      </Button>
                    )}
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                        Hồ sơ cá nhân
                      </MenuItem>
                      <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
                        Đăng xuất
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/login"
                      startIcon={<LoginIcon />}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/register"
                      startIcon={<RegisterIcon />}
                    >
                      Đăng ký
                    </Button>
                  </>
                )}
              </>
            )}
          </Toolbar>
        </Container>

        {/* Mobile Search */}
        {isMobile && (
          <Box sx={{ px: 2, pb: 2 }}>
            <SearchBar />
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Add toolbar spacing */}
      <Toolbar />
      {isMobile && <Box sx={{ height: 64 }} />}
    </>
  );
}
