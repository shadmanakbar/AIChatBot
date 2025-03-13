import { useMsal } from '@azure/msal-react';

export default function TestAuth() {
  const { accounts } = useMsal();

  return (
    <div>
      <h2>Authentication Test</h2>
      <p>Accounts: {JSON.stringify(accounts)}</p>
    </div>
  );
} 