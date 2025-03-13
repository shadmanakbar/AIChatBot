import {
  Drawer,
  Typography,
  Box,
  IconButton,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  alpha,
  useTheme,
  Avatar,
  Tooltip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import ChatArea from '../Chat/ChatArea';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DRAWER_WIDTH = 280;

export default function Sidebar() {
  const [assistants, setAssistants] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatKey, setChatKey] = useState<string>(Date.now().toString());
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newAssistantName, setNewAssistantName] = useState('');
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState('Assistant name must be unique!');
  const getAvatar = (avatar: string | undefined) => {
    if (avatar) return avatar;
    const emojis = ['🤖', '🧠', '🔮', '🦾', '👾', '🛸', '🚀', '💫', '⚡️', '🌟'];
    return emojis[Math.floor(Math.random() * emojis.length)];
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

  // Fetch assistants from the API on component mount
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch('http://localhost:8080/listAssistants');
        if (!response.ok) {
          throw new Error('Failed to fetch assistants');
        }
        const data = await response.json();
        setAssistants(data); // Set the state directly with the new structure from the API
      } catch (error) {
        console.error('Error fetching assistants:', error);
        setErrorSnackbarOpen(true); // Show error snackbar
      }
    };

    fetchAssistants();
  }, []);

  const handleAddAssistant = async () => {
    const newAssistantNumber = assistants.length + 1;
    const newAssistantTitle = `Assistant ${newAssistantNumber}`;
    
    try {
      const response = await fetch('http://localhost:8080/createAssistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAssistantTitle,
          roleSetting: 'This is the role setting.', // You can customize this as needed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create assistant');
      }

      // If successful, update the state
      setAssistants(prev => [
        ...prev,
        { title: newAssistantTitle, avatar: '🤖' }, // Default avatar for new assistants
      ]);
    } catch (error) {
      console.error('Error creating assistant:', error);
      setErrorSnackbarOpen(true); // Show error snackbar
    }
  };

  const handleOpenChat = (title: string) => {
    setActiveChat(title);
    setChatKey(Date.now().toString());
    if (title === 'Just Chat') {
      navigate(`/chat`);
    } else {
      navigate(`/${title}/chat`);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, title: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssistant(title);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRenameAssistant = () => {
    if (selectedAssistant) {
      setNewAssistantName(selectedAssistant);
      setRenameDialogOpen(true);
    }
    handleCloseMenu();
  };

  const handleRenameConfirm = async () => {
    if (assistants.some(assistant => assistant.title === newAssistantName)) {
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/renameAssistant', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentTitle: selectedAssistant,
          newTitle: newAssistantName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename assistant');
      }

      // Update the state
      setAssistants(prev =>
        prev.map(assistant =>
          assistant.title === selectedAssistant ? { ...assistant, title: newAssistantName } : assistant
        )
      );
      setRenameDialogOpen(false);
      setNewAssistantName('');
    } catch (error) {
      console.error('Error renaming assistant:', error);
      setErrorSnackbarOpen(true); // Show error snackbar
    }
  };

  const handleOpenSettings = () => {
    if (selectedAssistant) {
      navigate(`/${selectedAssistant}/settings`);
    }
    handleCloseMenu();
  };

  const handleDeleteAssistant = async () => {
    if (selectedAssistant) {
      try {
        const response = await fetch(`http://localhost:8080/deleteAssistant?title=${selectedAssistant}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete assistant');
        }

        // If successful, update the state
        setAssistants(prev =>
          prev.filter(assistant => assistant.title !== selectedAssistant)
        );
      } catch (error) {
        console.error('Error deleting assistant:', error);
        setErrorSnackbarOpen(true); // Show error snackbar
      }
      handleCloseMenu();
    }
  };

  const filteredAssistants = assistants.filter(assistant =>
    assistant.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
    <Drawer
    variant="permanent"
    sx={{
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    marginLeft: 10,
    bgcolor: 'background.paper',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.1),
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
    },
    }}
    >
    <motion.div
    initial="hidden"
    animate="visible"
    variants={containerVariants}
    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
    {/* Header Section */}
    <Box sx={{ p: 3 }}>
    <motion.div variants={itemVariants}>
    <Typography
    variant="h6"
    sx={{
    mb: 3,
    fontWeight: 700,
    background: 'linear-gradient(135deg, `#6366F1`, `#8B5CF6`, `#EC4899`)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textFillColor: 'transparent',
    letterSpacing: '0.5px',
    }}
    >
    PerfAIChat
    `</Typography>`
    </motion.div>
    <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.background.default, 0.6),
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                bgcolor: alpha(theme.palette.background.default, 0.8),
              },
            }}
          >
            <SearchIcon sx={{ mx: 1, color: 'text.secondary' }} />
            <InputBase
              sx={{ 
                ml: 1, 
                flex: 1,
                '& .MuiInputBase-input': {
                  fontSize: '0.9rem',
                }
              }}
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>
        </motion.div>
      </Box>

      {/* Assistants Section */}
      <Box 
        sx={{ 
          px: 2, 
          pb: 2, 
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
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
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: '16px',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '6px',
                height: '100%',
                background: 'linear-gradient(180deg, #6366F1, #EC4899)',
                borderRadius: '4px',
              }
            }}
            onClick={() => handleOpenChat('Just Chat')}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pl: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                😊
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>Just Chat</Typography>
                <Typography variant="caption" color="text.secondary">General purpose assistant</Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            px: 1
          }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              Assistants
            </Typography>
            <Tooltip title="Add Assistant" arrow>
              <IconButton 
                size="small" 
                onClick={handleAddAssistant}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                  width: 28,
                  height: 28,
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>
       
        <AnimatePresence>
          {filteredAssistants.map((assistant, index) => (
            <motion.div 
              key={assistant.title}
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
                  p: 2,
                  mb: 1.5,
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.1),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.action.hover, 0.8),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  },
                }}
                onClick={() => handleOpenChat(assistant.title)}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      fontSize: '1.2rem',
                    }}
                  >
                    {getAvatar(assistant.avatar)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500}>{assistant.title}</Typography>
                    <Typography variant="caption" color="text.secondary">Custom assistant</Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={(event) => handleOpenMenu(event, assistant.title)}
                    sx={{
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
                </Box>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAssistants.length === 0 && searchTerm && (
          <Box sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}>
            <SearchIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" align="center">
              No assistants found matching "{searchTerm}"
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  </Drawer>

  {/* Conditionally render ChatArea only if activeChat is not null */}
  {activeChat && <ChatArea key={chatKey} assistantTitle={activeChat} />}

  {/* Assistant Options Menu */}
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleCloseMenu}
    PaperProps={{
      sx: {
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        minWidth: '180px',
        overflow: 'visible',
        mt: 1,
      }
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <MenuItem onClick={handleRenameAssistant} sx={{ py: 1.5, gap: 1.5 }}>
      <EditIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
      <Typography variant="body2">Rename</Typography>
    </MenuItem>
    <MenuItem onClick={handleOpenSettings} sx={{ py: 1.5, gap: 1.5 }}>
      <SettingsIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
      <Typography variant="body2">Settings</Typography>
    </MenuItem>
    <Divider sx={{ my: 1 }} />
    <MenuItem onClick={handleDeleteAssistant} sx={{ py: 1.5, gap: 1.5, color: theme.palette.error.main }}>
      <DeleteIcon fontSize="small" />
      <Typography variant="body2">Delete</Typography>
    </MenuItem>
  </Menu>

  {/* Rename Assistant Dialog */}
  <Dialog 
    open={renameDialogOpen} 
    onClose={() => setRenameDialogOpen(false)}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        overflow: 'hidden',
      }
    }}
  >
    <DialogTitle sx={{ 
      p: 3, 
      borderBottom: '1px solid',
      borderColor: alpha(theme.palette.divider, 0.1),
    }}>
      <Typography variant="h6" fontWeight={600}>Rename Assistant</Typography>
    </DialogTitle>
    <DialogContent sx={{ p: 3 }}>
      <TextField
        autoFocus
        margin="dense"
        label="New Assistant Name"
        type="text"
        fullWidth
        value={newAssistantName}
        onChange={(e) => setNewAssistantName(e.target.value)}
        variant="outlined"
        sx={{
          mt: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          }
        }}
      />
    </DialogContent>
    <DialogActions sx={{ 
      p: 3, 
      borderTop: '1px solid',
      borderColor: alpha(theme.palette.divider, 0.1),
    }}>
      <Button 
        onClick={() => setRenameDialogOpen(false)} 
        variant="outlined"
        sx={{ 
          borderRadius: '10px',
          px: 3,
          py: 1,
          mr: 1,
        }}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleRenameConfirm} 
        variant="contained"
        sx={{ 
          borderRadius: '10px',
          px: 3,
          py: 1,
          background: 'linear-gradient(90deg, #6366F1, #EC4899)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
          }
        }}
      >
        Rename
      </Button>
    </DialogActions>
  </Dialog>

  {/* Snackbar for Error Messages */}
  <Snackbar
    open={errorSnackbarOpen}
    autoHideDuration={3000}
    onClose={() => setErrorSnackbarOpen(false)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert 
      onClose={() => setErrorSnackbarOpen(false)} 
      severity="error" 
      sx={{ 
        width: '100%', 
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {errorMessage}
    </Alert>
  </Snackbar>
</Box>
  );
}