import { Box, 
  Button, 
  useTheme, 
  alpha, 
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery, } from '@mui/material';
  import { 
    Add as AddIcon,
    Menu as MenuIcon,
    Close as CloseIcon
  } from '@mui/icons-material';

  import { motion, AnimatePresence } from 'framer-motion';

import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatHistorySidebar from './ChatHistorySidebar';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

export default function ChatArea({ assistantTitle }: { assistantTitle: string }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: '👋 Good Noon\n\nI am your personal intelligent assistant LobeChat. How can I assist you today?\n\nIf you need a more professional or customized assistant, you can click + to create a custom assistant.',
    sender: 'bot',
    timestamp: new Date()
  }]);

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]); // Initialize as an empty array
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    };
  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const sidebarVariants = {
  open: {
  width: 250,
  opacity: 1,
  transition: {
  type: "spring",
  stiffness: 300,
  damping: 30
  }
  },
  closed: {
  width: 0,
  opacity: 0,
  transition: {
  type: "spring",
  stiffness: 300,
  damping: 30
  }
  }
  };
  
  const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
  opacity: 1,
  transition: {
  duration: 0.3,
  ease: "easeInOut"
  }
  }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    if (isMobile) {
    setSidebarOpen(false);
    } else {
    setSidebarOpen(true);
    }
    }, [isMobile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 

  const handleSendMessage = async (text: string) => {
    // If no chat history exists, create one
    if (!selectedChatId) {
      try {
        const response = await fetch('http://localhost:8080/create-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assistantTitle }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create chat history');
        }
  
        const data = await response.json();
        const createdChat = data.chatHistory; // Assuming the API returns the new chat history entry
  
        if (createdChat) {
          setSelectedChatId(createdChat.id);
          // Fetch the updated chat history list after creating a new chat
          await fetchChatHistory();
        }
      } catch (error) {
        console.error('Error creating chat history:', error);
        return; // Exit if chat history creation fails
      }
    }
  
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
  
      // Update the chat context in the created history
      if (selectedChatId) {
        const updateResponse = await fetch(`http://localhost:8080/update-chat-context/${selectedChatId}`, {
          method: 'PUT', // Use PUT method
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assistantTitle, // Include assistantTitle in the request body
            context: `${context}\nbot: ${data.response}`, // Include the updated context
          }),
        });
  
        if (!updateResponse.ok) {
          throw new Error('Failed to update chat context');
        }
      }
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

  // Fetch chat history when the component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Handle chat selection
  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    const fetchMessagesForChat = async () => {
      try {
        const response = await fetch('http://localhost:8080/fetch-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assistantTitle, // Include assistantTitle in the request body
            historyID: id, // Include the historyID in the request body
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch messages for chat');
        }
  
        const data = await response.json();
        const context = data.context; // Extract the context from the response
  
        // Parse the context into individual messages
        const parsedMessages: Message[] = [];
        const lines = context.split('\n');
        let currentMessage: Partial<Message> = {};
  
        lines.forEach((line: string) => {
          if (line.startsWith('user: ') || line.startsWith('bot: ')) {
            // If we have a current message, push it to the parsedMessages array
            if (currentMessage.sender && currentMessage.text) {
              parsedMessages.push({
                id: Date.now().toString(), // Generate a unique ID for each message
                text: currentMessage.text.trim(),
                sender: currentMessage.sender.trim() as 'user' | 'bot',
                timestamp: new Date(), // Use the current date as the timestamp
              });
            }
  
            // Start a new message
            const [sender, text] = line.split(': ');
            currentMessage = {
              sender: sender.trim(),
              text: text.trim(),
            };
          } else {
            // Append to the current message's text
            if (currentMessage.text) {
              currentMessage.text += '\n' + line.trim();
            }
          }
        });
  
        // Push the last message if it exists
        if (currentMessage.sender && currentMessage.text) {
          parsedMessages.push({
            id: Date.now().toString(), // Generate a unique ID for each message
            text: currentMessage.text.trim(),
            sender: currentMessage.sender.trim() as 'user' | 'bot',
            timestamp: new Date(), // Use the current date as the timestamp
          });
        }
  
        setMessages(parsedMessages); // Update the messages state with the parsed messages
      } catch (error) {
        console.error('Error fetching messages for chat:', error);
      }
    };
  
    fetchMessagesForChat();
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/chat-history');
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      // Transform the API response into the ChatHistory format
      const history: ChatHistory[] = data.files.map((file: string) => ({
        id: file.replace('.json', ''), // Remove the .json extension
        title: file.replace('.json', ''), // Use the file name as the title
        timestamp: new Date(), // Use the current date as the timestamp
      }));
      setChatHistory(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Start a new chat
  const startNewChat = async () => {
    try {
      // Call the API to create a new chat history entry
      const response = await fetch('http://localhost:8080/create-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assistantTitle }),
      });
      fetchChatHistory()
  
      if (!response.ok) {
        throw new Error('Failed to create chat history');
      }
  
      const data = await response.json();
      const createdChat = data.chatHistory; // Assuming the API returns the new chat history entry
  
     
        setMessages([]);
        setSelectedChatId(createdChat.id);
  
      
    } catch (error) {
      console.error('Error creating chat history:', error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch('http://localhost:8080/delete-history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assistantTitle, chatHistoryID: chatId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat history');
      }

      // Remove the deleted chat from the chatHistory state
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

      // If the deleted chat was the selected chat, clear the messages
      if (selectedChatId === chatId) {
        setMessages([]);
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat history:', error);
    }
  };

  return (
    <Box
sx={{
height: '100vh',
display: 'flex',
flexDirection: 'row',
overflow: 'hidden',
bgcolor: 'background.default',
position: 'relative',
}}
>
{/* Mobile Toggle Button */}
{isMobile && (
<Box sx={{
position: 'absolute',
top: 12,
left: 12,
zIndex: 1100
}}>
<IconButton
onClick={toggleSidebar}
sx={{
bgcolor: alpha(theme.palette.background.paper, 0.8),
backdropFilter: 'blur(8px)',
boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
'&:hover': {
bgcolor: alpha(theme.palette.background.paper, 0.9),
}
}}
>
{sidebarOpen ? <CloseIcon /> : <MenuIcon />}
</IconButton>
</Box>
)}
  {/* Chat History Sidebar */}
  <AnimatePresence>
    {sidebarOpen && (
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate="open"
        exit="closed"
        style={{
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
          zIndex: isMobile ? 1000 : 1,
          position: isMobile ? 'absolute' : 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ 
          width: 250, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2.5 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={startNewChat}
                startIcon={<AddIcon />}
                sx={{ 
                  mb: 2.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  }
                }}
              >
                New Chat
              </Button>
            </motion.div>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <ChatHistorySidebar
              chatHistory={chatHistory}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
            />
          </Box>
        </Box>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Main Chat Area */}
  <motion.div
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      marginLeft: isMobile ? 0 : (sidebarOpen ? 0 : 0),
      transition: 'margin-left 0.3s ease',
      height: '100%',
    }}
  >
    <ChatHeader 
      title={selectedChatId ? 'Chat' : 'New Chat'} 
      onMenuClick={toggleSidebar}
      showMenuButton={isMobile}
    />
    <Box 
      sx={{ 
        flex: 1, 
        overflow: 'auto', 
        py: 2, 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: alpha(theme.palette.background.default, 0.6),
        backdropFilter: 'blur(8px)',
        px: { xs: 1, sm: 2, md: 4 },
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: alpha(theme.palette.primary.main, 0.4),
        },
      }}
    >
      <ChatMessages messages={messages} />
      <div ref={messagesEndRef} />
    </Box>
    <ChatInput onSendMessage={handleSendMessage} assistantTitle={assistantTitle} />
  </motion.div>
</Box>

  );
}