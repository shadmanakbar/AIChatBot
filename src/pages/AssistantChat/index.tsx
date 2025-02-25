import { Box, Typography, TextField, Button, Dialog } from '@mui/material';
import ChatHeader from '../../components/Chat/ChatHeader';
import ChatMessages from '../../components/Chat/ChatMessages';
import ChatInput from '../../components/Chat/ChatInput';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AssistantChat = () => {
  const { assistantTitle } = useParams<{ assistantTitle: string }>();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: '👋 Good Noon\n\nI am your personal intelligent assistant LobeChat. How can I assist you today?\n\nIf you need a more professional or customized assistant, you can click + to create a custom assistant.',
    sender: 'bot',
    timestamp: new Date()
  }]);

  const [role, setRole] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch role setting when the component mounts or when assistantTitle changes
  useEffect(() => {
    const fetchRoleSetting = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getRoleSetting?title=${assistantTitle}`);
        if (!response.ok) {
          throw new Error('Failed to fetch role setting');
        }
        const data = await response.json();
        setRole(data.roleSetting); // Set the role from the API response
      } catch (error) {
        console.error('Error fetching role setting:', error);
      }
    };

    fetchRoleSetting();
  }, [assistantTitle]); // Dependency array includes assistantTitle

  const handleSendMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: `I've received your message. This is a demo response.`,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setIsEditMode(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditMode(false);
  };

  const handleEditToggle = async () => {
    if (isEditMode) {
      // Send the updated role setting to the API
      try {
        const response = await fetch('http://localhost:8080/updateAssistant', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: assistantTitle, // Use the assistant title from params
            roleSetting: role, // Updated role setting
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update role setting');
        }

        // Optionally, you can handle the response if needed
        console.log('Role setting updated successfully');
      } catch (error) {
        console.error('Error updating role setting:', error);
      }
      handleCloseDialog();
    } else {
      setIsEditMode(true);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <ChatHeader />
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        py: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div onClick={handleOpenDialog}>
          <Box sx={{ p: 2, cursor: 'pointer' }} >
            <Typography variant="subtitle1">Role Setting</Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter role prompt word..."
              value={role}
              onChange={(e) => setRole(e.target.value)} 
              sx={{ mb: 2 }}
              disabled={!isEditMode} // Disable input if not in edit mode  
            />
          </Box>
        </div>
        <ChatMessages messages={messages} />
        <div ref={messagesEndRef} />
      </Box>
      <ChatInput assistantTitle={assistantTitle} onSendMessage={handleSendMessage} />

      {/* Dialog for Role Setting */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ p: 3, width: 400 }}>
          <Typography variant="h6">Role Setting</Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter role prompt word..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: 2 }}
            disabled={!isEditMode}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
            <Button onClick={handleEditToggle} color="primary" sx={{ ml: 1 }}>
              {isEditMode ? 'OK' : 'Edit'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AssistantChat;