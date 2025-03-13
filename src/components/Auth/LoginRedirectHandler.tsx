import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginRedirectHandler() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Handling redirect promise...');
    instance.handleRedirectPromise()
      .then(() => {
        console.log('Redirect promise resolved');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.error('Login redirect error:', error);
        navigate('/login');
      });
  }, [instance, navigate, location]);

  return null;
} 