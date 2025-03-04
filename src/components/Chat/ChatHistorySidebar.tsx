import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import the 3-dots icon
import { useState } from 'react';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatHistorySidebarProps {
  chatHistory?: ChatHistory[]; // Make chatHistory optional
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void; // Add onDeleteChat prop
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ chatHistory = [], onSelectChat, onDeleteChat }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For the menu
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // Track the selected chat for deletion

  // Open the menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, chatId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedChatId(chatId);
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChatId(null);
  };

  // Handle delete action
  const handleDelete = () => {
    if (selectedChatId) {
      onDeleteChat(selectedChatId); // Call the delete function
      handleMenuClose(); // Close the menu
    }
  };

  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chat History
      </Typography>
      <List>
        {chatHistory.map((chat) => (
          <ListItem
            key={chat.id}
            component="button" // Use component="button" instead of the button prop
            onClick={() => onSelectChat(chat.id)}
            sx={{
              textAlign: 'left',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ListItemText
              primary={chat.title}
              secondary={chat.timestamp.toLocaleString()}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent the ListItem onClick from firing
                handleMenuOpen(e, chat.id);
              }}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      {/* 3-dots Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatHistorySidebar;