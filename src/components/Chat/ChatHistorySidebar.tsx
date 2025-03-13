import { Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    IconButton, 
    Menu, 
    MenuItem, 
    Paper, 
    Avatar, 
    Tooltip, 
    useTheme, 
    alpha } from '@mui/material';

import { 
    MoreVert as MoreVertIcon, 
    Delete as DeleteIcon, 
    Chat as ChatIcon, 
    History as HistoryIcon,
    ChatBubbleOutline as ChatBubbleIcon
  } from '@mui/icons-material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const theme = useTheme();
  const [activeChat, setActiveChat] = useState(null);
  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    onSelectChat(id);
    };

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
    opacity: 1,
    transition: {
    staggerChildren: 0.05,
    delayChildren: 0.1
    }
    }
    };
    
    const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
    opacity: 1,
    y: 0,
    transition: {
    type: "spring",
    stiffness: 300,
    damping: 24
    }
    }
    };
    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    };

  return (
    <Box
sx={{
width: 250,
bgcolor: 'background.paper',
backdropFilter: 'blur(10px)',
height: '100%',
display: 'flex',
flexDirection: 'column',
borderRight: '1px solid',
borderColor: alpha(theme.palette.divider, 0.1),
}}
>
<Box sx={{ p: 2.5 }}>
<motion.div
initial="hidden"
animate="visible"
variants={containerVariants}
>
<motion.div variants={itemVariants}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
<HistoryIcon
sx={{
color: theme.palette.primary.main,
background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
backgroundClip: 'text',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
textFillColor: 'transparent',
}}
/>
<Typography
variant="h6"
sx={{
fontWeight: 600,
background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
backgroundClip: 'text',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
textFillColor: 'transparent',
}}
>
Chat History
</Typography>
</Box>
</motion.div>
{chatHistory.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '2rem 0',
            textAlign: 'center'
          }}
        >
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60, 
              mb: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main
            }}
          >
            <ChatBubbleIcon />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            No chat history yet
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Your conversations will appear here
          </Typography>
        </motion.div>
      ) : (
        <List sx={{ px: 0 }}>
          <AnimatePresence>
            {chatHistory.map((chat, index) => (
              <motion.div
                key={chat.id}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Paper
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: activeChat === chat.id 
                      ? alpha(theme.palette.primary.main, 0.3) 
                      : alpha(theme.palette.divider, 0.1),
                    bgcolor: activeChat === chat.id 
                      ? alpha(theme.palette.primary.main, 0.08) 
                      : 'background.paper',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: activeChat === chat.id 
                        ? alpha(theme.palette.primary.main, 0.12) 
                        : alpha(theme.palette.action.hover, 0.8),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  {activeChat === chat.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '4px',
                        height: '100%',
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }}
                    />
                  )}
                  <ListItem
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        <ChatIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={activeChat === chat.id ? 600 : 500}
                          sx={{ 
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {chat.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {formatDate(chat.timestamp)}
                        </Typography>
                      </Box>
                      <Tooltip title="Options" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, chat.id)}
                          sx={{
                            ml: 0.5,
                            bgcolor: alpha(theme.palette.background.default, 0.6),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.background.default, 0.9),
                            },
                            width: 28,
                            height: 28,
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      )}
    </motion.div>
  </Box>

  {/* 3-dots Menu */}
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
    PaperProps={{
      sx: {
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        minWidth: '150px',
        overflow: 'visible',
        mt: 1,
      }
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <MenuItem onClick={handleDelete} sx={{ py: 1.5, gap: 1.5, color: theme.palette.error.main }}>
      <DeleteIcon fontSize="small" />
      <Typography variant="body2">Delete</Typography>
    </MenuItem>
  </Menu>
</Box>
  );
};

export default ChatHistorySidebar;