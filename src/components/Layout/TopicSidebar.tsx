import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function TopicSidebar() {
  return (
    <Paper
      sx={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        bgcolor: 'background.paper',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Topic</Typography>
        <IconButton size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Click the button on the left to save the current conversation as a historical topic and start a new conversation.
        </Typography>
      </Box>
    </Paper>
  );
}