import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import Files from './pages/Files';
import AssistantSettings from './pages/AssistantPage'; 
import AssistantChat from './pages/AssistantChat';
import KnowledgeBaseFiles from './pages/Files/KnowledgeBaseFiles';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/files/*" element={<Files />} />
          <Route path="/:assistantTitle/settings" element={<AssistantSettings />} /> {/* New route for settings */}
          <Route path="/:assistantTitle/chat" element={<AssistantChat />}/> 
          <Route path="/files/:knowledgeBaseName" element={<KnowledgeBaseFiles />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;