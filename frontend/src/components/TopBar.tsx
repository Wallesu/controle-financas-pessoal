import { AppBar, Toolbar, Typography, Tabs, Tab, Box, IconButton, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Extrai o accountId da URL, se existir
  const match = location.pathname.match(/\/accounts\/(\d+)/);
  const accountId = match ? match[1] : null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Controle Financeiro
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          {accountId && (
            <Tabs 
              value={location.pathname} 
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab 
                label="Transações" 
                value={`/accounts/${accountId}/transactions`} 
              />
              <Tab 
                label="Dashboard" 
                value={`/accounts/${accountId}/dashboard`} 
              />
            </Tabs>
          )}
        </Box>
        <Tooltip title="Sair">
          <IconButton edge="end" color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar; 