import { Box, 
  Typography, 
  Avatar, 
  Paper, 
  useTheme, 
  alpha,
  Tooltip,
  useMediaQuery } from '@mui/material';
import { SmartToy as BotIcon, 
  Person as UserIcon,
  AttachFile as AttachmentIcon } from '@mui/icons-material';
  import { motion, AnimatePresence } from 'framer-motion';
  import ReactMarkdown from 'react-markdown';
  import { useState } from 'react';

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
  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const [expandedImage, setExpandedImage] = useState<string | null>(null);
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
    opacity: 1,
    transition: {
    staggerChildren: 0.05
    }
    }
    };
    
    const messageVariants = {
    hidden: { opacity: 0, y: 20 },
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

  return (
    <>
<motion.div
variants={containerVariants}
initial="hidden"
animate="visible"
style={{
display: 'flex',
flexDirection: 'column',
gap: '24px',
width: '100%',
maxWidth: '900px',
margin: '0 auto',
}}
>
`<AnimatePresence>`
{messages.map((message) => (
<motion.div
key={message.id}
variants={messageVariants}
layout
initial="hidden"
animate="visible"
exit={{ opacity: 0, y: -10 }}
>
<Box
sx={{
display: 'flex',
gap: 2,
px: { xs: 2, sm: 3, md: 4 },
py: 2.5,
borderRadius: '16px',
bgcolor: message.sender === 'bot'
? alpha(theme.palette.primary.main, 0.05)
: alpha(theme.palette.background.paper, 0.5),
backdropFilter: 'blur(8px)',
boxShadow: message.sender === 'bot'
? `0 2px 12px ${alpha(theme.palette.primary.main, 0.1)}`
: '0 2px 8px rgba(0, 0, 0, 0.05)',
border: '1px solid',
borderColor: message.sender === 'bot'
? alpha(theme.palette.primary.main, 0.1)
: alpha(theme.palette.divider, 0.05),
position: 'relative',
overflow: 'hidden',
transition: 'all 0.3s ease',
'&:hover': {
boxShadow: message.sender === 'bot'
? `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`
: '0 4px 12px rgba(0, 0, 0, 0.08)',
}
}}
>
{message.sender === 'bot' && (
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
            <Tooltip 
              title={message.sender === 'bot' ? 'AI Assistant' : 'You'} 
              placement="top"
              arrow
            >
              <Avatar 
                sx={{ 
                  bgcolor: message.sender === 'bot' 
                    ? 'transparent'
                    : alpha(theme.palette.background.default, 0.8),
                  width: 40,
                  height: 40,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  border: '2px solid',
                  borderColor: message.sender === 'bot' 
                    ? 'transparent'
                    : alpha(theme.palette.divider, 0.2),
                  background: message.sender === 'bot' 
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                    : undefined,
                  color: message.sender === 'bot' 
                    ? 'white'
                    : theme.palette.text.primary,
                }}
              >
                {message.sender === 'bot' ? <BotIcon /> : <UserIcon />}
              </Avatar>
            </Tooltip>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {message.text && (
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 0,
                    bgcolor: 'transparent',
                    mb: 1,
                  }}
                >
                  <Typography 
                    variant="body1" 
                    component="div"
                    sx={{ 
                      color: 'text.primary',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      fontWeight: message.sender === 'bot' ? 400 : 500,
                      wordBreak: 'break-word',
                      '& p': {
                        mt: 0,
                        mb: 1.5,
                      },
                      '& p:last-child': {
                        mb: 0,
                      },
                      '& code': {
                        bgcolor: alpha(theme.palette.background.default, 0.7),
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                      },
                      '& pre': {
                        bgcolor: alpha(theme.palette.background.default, 0.7),
                        p: 1.5,
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                      },
                    }}
                  >
                    <ReactMarkdown>
                      {message.text}
                    </ReactMarkdown>
                  </Typography>
                </Paper>
              )}
              
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                  {message.attachments.map((file, index) => (
                    <Box key={index}>
                      {isImageFile(file) ? (
                        renderImagePreview(file)
                      ) : (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: alpha(theme.palette.background.default, 0.7),
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.background.default, 0.9),
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            }
                          }}
                        >
                          <AttachmentIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                          <Typography 
                            variant="body2"
                            sx={{
                              maxWidth: '180px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: alpha(theme.palette.text.secondary, 0.8),
                  mt: 1,
                  display: 'block',
                  textAlign: 'right',
                  fontSize: '0.7rem',
                }}
              >
                {formatTime(message.timestamp)}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>

  {/* Image Preview Modal */}
  {expandedImage && (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        cursor: 'pointer',
      }}
      onClick={() => setExpandedImage(null)}
    >
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        src={expandedImage}
        alt="Expanded image"
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          objectFit: 'contain',
          borderRadius: '8px',
        }}
      />
    </Box>
  )}
</>
  );
}