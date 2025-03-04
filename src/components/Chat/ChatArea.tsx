import { Box, Typography, Button } from '@mui/material';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
      {/* Chat History Sidebar */}
      <Box sx={{ width: 250, bgcolor: 'background.paper', p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={startNewChat}
          sx={{ mb: 2 }}
        >
          New Chat
        </Button>
        <ChatHistorySidebar
          chatHistory={chatHistory}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat} // Pass the delete function
        />
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ChatHeader title={selectedChatId ? 'Chat' : 'New Chat'} />
        <Box sx={{ flex: 1, overflow: 'auto', py: 2, display: 'flex', flexDirection: 'column' }}>
          <ChatMessages messages={messages} />
          <div ref={messagesEndRef} />
        </Box>
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
    </Box>
  );
}