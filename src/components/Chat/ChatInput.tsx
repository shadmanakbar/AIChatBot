import { Box, IconButton, TextField, Paper } from '@mui/material';
import {
  Send as SendIcon,
  Timer as TimerIcon,
  Code as CodeIcon,
  Psychology as BrainIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import UploadMenu from './UploadMenu';
import VoiceInput from './VoiceInput';
import TimerDialog from './TimerDialog';
import ModelSelector from './ModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  assistantTitle: string; // Add assistantTitle prop
}

export default function ChatInput({ onSendMessage, assistantTitle }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [messageLimit, setMessageLimit] = useState(8);
  const [isLimitEnabled, setIsLimitEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleUpload = async (files: File[]) => {
    setAttachments(prev => [...prev, ...files]);

    // Upload each file to the server
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`http://localhost:8080/upload?title=${assistantTitle}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        console.log(`File ${file.name} uploaded successfully.`);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleVoiceInput = (text: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + text);
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  const renderAttachmentPreview = (file: File, index: number) => {
    if (isImageFile(file)) {
      const imageUrl = URL.createObjectURL(file);
      return (
        <Box
          key={index}
          sx={{
            position: 'relative',
            display: 'inline-block',
            m: 0.5,
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={file.name}
            sx={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 1,
            }}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
          <IconButton
            size="small"
            onClick={() => handleRemoveAttachment(index)}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    }

    return (
      <Box
        key={index}
        sx={{
          position: 'relative',
          display: 'inline-block',
          m: 0.5,
          p: 1,
          borderRadius: 1,
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="body2">📎 {file.name}</Typography>
        <IconButton
          size="small"
          onClick={() => handleRemoveAttachment(index)}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      p: 2, 
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      bottom: 0,
      bgcolor: 'background.default',
      zIndex: 1,
    }}>
      <Paper
        sx={{
          p: 1,
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {attachments.length > 0 && (
          <Box 
            sx={{ 
              p: 1, 
              mb: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center'
            }}
          >
            {attachments.map((file, index) => renderAttachmentPreview(file, index))}
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setIsTimerOpen(true)}
          >
            <TimerIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setIsModelSelectorOpen(true)}
          >
            <BrainIcon fontSize="small" />
          </IconButton>
          <UploadMenu onUpload={handleUpload} />
          <VoiceInput onVoiceInput={handleVoiceInput} />
          <IconButton size="small"><CodeIcon fontSize="small" /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              }
            }}
          />
          <IconButton 
            onClick={handleSend}
            disabled={!message.trim() && attachments.length === 0}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': {
                bgcolor: 'rgba(37, 99, 235, 0.5)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
              height: 40,
              width: 40,
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      <TimerDialog
        open={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        messageLimit={messageLimit}
        isLimitEnabled={isLimitEnabled}
        onLimitChange={setMessageLimit}
        onLimitToggle={setIsLimitEnabled}
      />

      <ModelSelector
        open={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </Box>
  );
}