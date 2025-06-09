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
    <AppBar 
      position="static"
      sx={{
        background: 'linear-gradient(135deg,rgb(8, 14, 26) 0%,rgb(22, 37, 58) 30%,rgb(43, 59, 75) 50%,rgb(16, 33, 54) 75%,rgb(11, 19, 36) 100%)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Controle Financeiro
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          {accountId && (
            <Tabs 
              value={location.pathname} 
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: 'white',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#2563eb',
                },
              }}
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
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleLogout} 
            sx={{ 
              ml: 2,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar; 