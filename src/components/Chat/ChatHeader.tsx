import { Box, Typography, Avatar } from '@mui/material';

export default function ChatHeader() {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Avatar sx={{ bgcolor: 'primary.main' }}>🤖</Avatar>
      <Box>
        <Typography variant="subtitle1">Perf Chat</Typography>
        <Typography variant="caption" color="text.secondary">
          Activate the brain cluster and spark creative thinking. Your virtual assistant is here to communicate with you about everything.
        </Typography>
      </Box>
    </Box>
  );
}