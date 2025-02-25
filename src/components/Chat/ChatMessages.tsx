import { Box, Typography, Avatar, Paper } from '@mui/material';
import { SmartToy as BotIcon, Person as UserIcon } from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: File[];
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const renderImagePreview = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Box
        component="img"
        src={imageUrl}
        alt={file.name}
        sx={{
          maxWidth: '200px',
          maxHeight: '200px',
          borderRadius: 1,
          objectFit: 'cover',
          mt: 1
        }}
        onLoad={() => URL.revokeObjectURL(imageUrl)} // Clean up the URL after image loads
      />
    );
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            gap: 2,
            px: 4,
            py: 3,
            bgcolor: message.sender === 'bot' ? 'rgba(247, 247, 248, 0.7)' : 'transparent',
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: message.sender === 'bot' ? 'primary.main' : 'grey.300',
              width: 38,
              height: 38
            }}
          >
            {message.sender === 'bot' ? <BotIcon /> : <UserIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            {message.text && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 1,
                  color: 'text.primary',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {message.text}
              </Typography>
            )}
            
            {message.attachments && message.attachments.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {message.attachments.map((file, index) => (
                  <Box key={index}>
                    {isImageFile(file) ? (
                      renderImagePreview(file)
                    ) : (
                      <Paper
                        sx={{
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'background.default',
                        }}
                      >
                        <Typography variant="body2">
                          📎 {file.name}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                ))}
              </Box>
            )}
            
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}