import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import Files from './pages/Files';
import AssistantSettings from './pages/AssistantPage'; 
import AssistantChat from './pages/AssistantChat';
import KnowledgeBaseFiles from './pages/Files/KnowledgeBaseFiles';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    // Add dark class to body if dark mode is enabled
if (prefersDark) {
  document.body.classList.add('dark');
}
}, []);
const theme = createTheme({
  palette: {
  mode: darkMode ? 'dark' : 'light',
  primary: {
  main: '#7F7FD5',
  },
  background: {
  default: darkMode ? '#121212' : '#f5f5f7',
  paper: darkMode ? '#1e1e1e' : '#ffffff',
  },
  text: {
  primary: darkMode ? '#ffffff' : '#333333',
  secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  },
  },
  typography: {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
  borderRadius: 8,
  },
  components: {
  MuiButton: {
  styleOverrides: {
  root: {
  textTransform: 'none',
  fontWeight: 500,
  },
  },
  },
  },
  });
  return (
    <ThemeProvider theme={theme}>
<CssBaseline />
<Router>
<Layout>
<Routes>
<Route path="/" element={<Navigate to="/chat" replace />} />
<Route path="/chat" element={<Chat />} />
<Route path="/files/*" element={<Files />} />
<Route path="/:assistantTitle/settings" element={<AssistantSettings />} />
<Route path="/:assistantTitle/chat" element={<AssistantChat />}/>
<Route path="/files/:knowledgeBaseName" element={<KnowledgeBaseFiles />} />
</Routes>
</Layout>
</Router>
</ThemeProvider>
  );
}

export default App;