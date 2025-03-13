import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../../authConfig';

const pca = new PublicClientApplication(msalConfig);

// Add initialization check
pca.initialize()
  .then(() => console.log('MSAL initialized successfully'))
  .catch(e => console.error('MSAL initialization error:', e));

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={pca}>{children}</MsalProvider>;
} 