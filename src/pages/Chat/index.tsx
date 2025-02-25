import { Box } from '@mui/material';
import ChatArea from '../../components/Chat/ChatArea';

export default function Chat() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatArea assistantTitle='Lets Chat' />
    </Box>
  );
}