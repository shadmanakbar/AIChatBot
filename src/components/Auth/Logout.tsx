import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutRedirect().then(() => {
      navigate('/login');
    });
  };

  return (
    <Button variant="outlined" onClick={handleLogout}>
      Logout
    </Button>
  );
} 