import {
  Box,
  Drawer,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const DRAWER_WIDTH = 70;

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
}));

export default function PrimarySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            mb: 2,
            cursor: 'pointer',
          }}
          onClick={handleDialogOpen} // Open dialog on click
        >
          S
        </Avatar>

        <Tooltip title="Chat" placement="right">
          <StyledIconButton
            className={isActive('/chat') ? 'active' : ''}
            onClick={() => navigate('/chat')}
          >
            <Badge color="primary" variant="dot">
              <ChatIcon />
            </Badge>
          </StyledIconButton>
        </Tooltip>

        <Tooltip title="Files" placement="right">
          <StyledIconButton
            className={isActive('/files') ? 'active' : ''}
            onClick={() => navigate('/files')}
          >
            <FolderIcon />
          </StyledIconButton>
        </Tooltip>
      </Box>

      {/* Profile Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Syed Shadman Akbar</Typography>
          <Typography variant="body2">shadman</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">2 Assistants</Typography>
            <Typography variant="body2">0 Topics</Typography>
            <Typography variant="body2">0 Messages</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}