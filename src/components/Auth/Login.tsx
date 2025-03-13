import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../authConfig';
import { Button, Box } from '@mui/material';

export default function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    console.log('Initiating login redirect...');
    instance.loginRedirect(loginRequest)
      .then(() => console.log('Login redirect initiated'))
      .catch(e => console.error('Login error:', e));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button variant="contained" onClick={handleLogin}>
        Sign in with Microsoft
      </Button>
    </Box>
  );
} 