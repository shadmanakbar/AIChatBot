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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import ChatArea from '../Chat/ChatArea';
import { useNavigate } from 'react-router-dom';

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
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>PerfAIChat</Typography>
          <Paper
            sx={{
              p: '3px 4px',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <SearchIcon sx={{ mx: 1, color: 'text.secondary' }} />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>
        </Box>

        <Box sx={{ p: 2 }}>
          <Paper
            sx={{
              p: 2,
              mb: 1,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'action.hover' },
              cursor: 'pointer',
            }}
            onClick={() => handleOpenChat('Just Chat')}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="h4">😊</Typography>
              <Typography variant="subtitle2">Just Chat</Typography>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Assistants</Typography>
            <IconButton size="small" onClick={handleAddAssistant}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
         
          {filteredAssistants.map((assistant) => (
            <Paper
              key={assistant.title}
              sx={{
                p: 2,
                mb: 1,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                cursor: 'pointer',
              }}
              onClick={() => handleOpenChat(assistant.title)}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="h4">{assistant.avatar}</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">{assistant.title}</Typography>
                </Box>
                <IconButton size="small" onClick={(event) => handleOpenMenu(event, assistant.title)}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleRenameAssistant}>Rename</MenuItem>
            <MenuItem onClick={handleOpenSettings}>Settings</MenuItem>
            <MenuItem onClick={handleDeleteAssistant}>Delete</MenuItem>
          </Menu>
        </Box>
      </Drawer>

      {/* Conditionally render ChatArea only if activeChat is not null */}
      {activeChat && <ChatArea key={chatKey} assistantTitle={activeChat} />}

      {/* Rename Assistant Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Assistant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Assistant Name"
            type="text"
            fullWidth
            value={newAssistantName}
            onChange={(e) => setNewAssistantName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleRenameConfirm} color="primary">Rename</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbarOpen(false)}
        message="Assistant name must be unique!"
      />
    </Box>
  );
}