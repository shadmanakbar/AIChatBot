import { Box, Typography, TextField, Button, Dialog } from '@mui/material';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatAreaProps {
  assistantTitle: string;
}

export default function ChatArea({ assistantTitle }: ChatAreaProps) {
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

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Prepare the context for the API
    const context = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n') + `\nuser: ${text}`;

    try {
      // Send the context to the API
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response, // Assuming the API returns a field called 'response'
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add bot response
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Optionally, handle error response
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleOpenDialog = () => {
    console.log("Opening dialog...");
    setDialogOpen(true);
    setIsEditMode(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditMode(false);
  };

  const handleEditToggle = () => {
    if (isEditMode) {
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
        <ChatMessages messages={messages} />
        <div ref={messagesEndRef} />
      </Box>
      <ChatInput onSendMessage={handleSendMessage} />
    </Box>
  );
}