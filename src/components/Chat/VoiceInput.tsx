import { useState, useCallback } from 'react';
import { 
  IconButton, 
  Dialog, 
  DialogContent, 
  Box, 
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
} from '@mui/icons-material';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export default function VoiceInput({ onVoiceInput }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          onVoiceInput(transcript);
          setTranscript('');
        }
      };

      recognition.start();
      setRecognition(recognition);
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  }, [onVoiceInput, transcript]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      if (transcript) {
        onVoiceInput(transcript);
        setTranscript('');
      }
    }
  }, [recognition, onVoiceInput, transcript]);

  return (
    <>
      <IconButton 
        size="small" 
        onClick={isListening ? stopListening : startListening}
        sx={{
          color: isListening ? 'error.main' : 'inherit',
        }}
      >
        <MicIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={isListening}
        onClose={stopListening}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                mb: 3,
              }}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{
                  color: 'primary.main',
                }}
              />
              <IconButton
                size="large"
                onClick={stopListening}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'error.main',
                }}
              >
                <StopIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" gutterBottom>
              Listening...
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxHeight: 100, 
                overflowY: 'auto',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              {transcript || "Start speaking..."}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}