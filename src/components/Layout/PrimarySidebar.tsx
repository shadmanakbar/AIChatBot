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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Folder as FolderIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logout from '../Auth/Logout';
import { motion, AnimatePresence } from 'framer-motion';

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
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: 100, opacity: 0 }
    };
    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
      }
      })
      };
      const [darkMode, setDarkMode] = useState(false);
   const theme = useTheme();
   

const toggleDarkMode = () => {
setDarkMode(!darkMode);
document.body.classList.toggle('dark');
};
  
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
backdropFilter: 'blur(10px)',
borderRight: '1px solid',
borderColor: alpha(theme.palette.divider, 0.1),
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
py: 3,
px: 1,
boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
},
}}
>
<motion.div
initial="hidden"
animate="visible"
variants={sidebarVariants}
style={{
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
height: '100%',
width: '100%'
}}
>
{/* Avatar Section */}
<motion.div variants={itemVariants}>
<motion.div
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
>
<Avatar
sx={{
width: 48,
height: 48,
mb: 4,
cursor: 'pointer',
background: 'linear-gradient(135deg, `#6366F1`, `#8B5CF6`, `#EC4899`)',
boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
border: '2px solid',
borderColor: alpha(theme.palette.background.paper, 0.8),
}}
onClick={handleDialogOpen}
>
S
`</Avatar>`
</motion.div>
</motion.div>
    {/* Navigation Icons */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
      <motion.div variants={itemVariants}>
        <Tooltip title="Chat" placement="right" arrow>
          <Box>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={() => navigate('/chat')}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: isActive('/chat') 
                    ? alpha(theme.palette.primary.main, 0.15) 
                    : 'transparent',
                  color: isActive('/chat') 
                    ? 'primary.main' 
                    : 'text.secondary',
                  borderRadius: '12px',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: isActive('/chat') 
                      ? alpha(theme.palette.primary.main, 0.25) 
                      : alpha(theme.palette.action.hover, 0.8),
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Badge 
                  color="error" 
                  variant="dot" 
                  overlap="circular"
                  sx={{
                    '& .MuiBadge-badge': {
                      boxShadow: '0 0 0 2px ' + theme.palette.background.paper,
                    }
                  }}
                >
                  <ChatIcon />
                </Badge>
                {isActive('/chat') && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -8,
                      width: 4,
                      height: 20,
                      borderRadius: '0 4px 4px 0',
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(180deg, #6366F1, #EC4899)',
                    }}
                  />
                )}
              </IconButton>
            </motion.div>
          </Box>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip title="Files" placement="right" arrow>
          <Box>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={() => navigate('/files')}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: isActive('/files') 
                    ? alpha(theme.palette.primary.main, 0.15) 
                    : 'transparent',
                  color: isActive('/files') 
                    ? 'primary.main' 
                    : 'text.secondary',
                  borderRadius: '12px',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: isActive('/files') 
                      ? alpha(theme.palette.primary.main, 0.25) 
                      : alpha(theme.palette.action.hover, 0.8),
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <FolderIcon />
                {isActive('/files') && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -8,
                      width: 4,
                      height: 20,
                      borderRadius: '0 4px 4px 0',
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(180deg, #6366F1, #EC4899)',
                    }}
                  />
                )}
              </IconButton>
            </motion.div>
          </Box>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip title="Settings" placement="right" arrow>
          <Box>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={() => navigate('/settings')}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: isActive('/settings') 
                    ? alpha(theme.palette.primary.main, 0.15) 
                    : 'transparent',
                  color: isActive('/settings') 
                    ? 'primary.main' 
                    : 'text.secondary',
                  borderRadius: '12px',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: isActive('/settings') 
                      ? alpha(theme.palette.primary.main, 0.25) 
                      : alpha(theme.palette.action.hover, 0.8),
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <SettingsIcon />
                {isActive('/settings') && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -8,
                      width: 4,
                      height: 20,
                      borderRadius: '0 4px 4px 0',
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(180deg, #6366F1, #EC4899)',
                    }}
                  />
                )}
              </IconButton>
            </motion.div>
          </Box>
        </Tooltip>
      </motion.div>
    </Box>

    {/* Bottom Actions */}
    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
      <motion.div variants={itemVariants}>
        <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} placement="right" arrow>
          <Box>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  width: 48,
                  height: 48,
                  color: 'text.secondary',
                  borderRadius: '12px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.action.hover, 0.8),
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </motion.div>
          </Box>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip title="Logout" placement="right" arrow>
          <Box>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                sx={{
                  width: 48,
                  height: 48,
                  color: 'text.secondary',
                  borderRadius: '12px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.action.hover, 0.8),
                    color: theme.palette.error.main,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LogoutIcon />
              </IconButton>
            </motion.div>
          </Box>
        </Tooltip>
      </motion.div>
    </Box>
  </motion.div>

  {/* Profile Dialog */}
  <Dialog 
    open={dialogOpen} 
    onClose={handleDialogClose}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        overflow: 'hidden',
      }
    }}
    TransitionComponent={motion.div}
  >
    <DialogTitle sx={{ 
      p: 3, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      borderBottom: '1px solid',
      borderColor: alpha(theme.palette.divider, 0.1),
    }}>
      <Avatar
        sx={{
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
        }}
      >
        S
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight={600}>Syed Shadman Akbar</Typography>
        <Typography variant="body2" color="text.secondary">shadman</Typography>
      </Box>
    </DialogTitle>
    
    <DialogContent sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 2, 
        mt: 2,
        mb: 2,
      }}>
        <Box sx={{ 
          p: 2, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: '12px',
        }}>
          <Typography variant="h6" fontWeight={600} color="primary.main">2</Typography>
          <Typography variant="body2" color="text.secondary">Assistants</Typography>
        </Box>
        
        <Box sx={{ 
          p: 2, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: '12px',
        }}>
          <Typography variant="h6" fontWeight={600} color="primary.main">0</Typography>
          <Typography variant="body2" color="text.secondary">Topics</Typography>
        </Box>
        
        <Box sx={{ 
          p: 2, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: '12px',
        }}>
          <Typography variant="h6" fontWeight={600} color="primary.main">0</Typography>
          <Typography variant="body2" color="text.secondary">Messages</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>Account Details</Typography>
        <Box sx={{ 
          p: 2, 
          bgcolor: alpha(theme.palette.background.default, 0.5),
          borderRadius: '12px',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="body2">shadman@example.com</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Plan</Typography>
            <Typography variant="body2">Free</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Joined</Typography>
            <Typography variant="body2">March 2023</Typography>
          </Box>
        </Box>
      </Box>
    </DialogContent>
    
    <DialogActions sx={{ 
      p: 3, 
      borderTop: '1px solid',
      borderColor: alpha(theme.palette.divider, 0.1),
    }}>
      <Button 
        onClick={handleDialogClose} 
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
        onClick={handleDialogClose} 
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
        View Profile
      </Button>
    </DialogActions>
  </Dialog>
</Drawer>
  );
}