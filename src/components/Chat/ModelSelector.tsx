import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Radio,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Psychology as BrainIcon } from '@mui/icons-material';

interface Model {
  id: string;
  name: string;
  description: string;
}

const availableModels: Model[] = [
  {
    id: 'gpt-4',
    name: 'ChatGPT-4',
    description: 'Most capable GPT-4 model, great at tasks that require creativity and advanced reasoning'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Advanced model from Google, excellent at analysis and coding'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Specialized in technical and scientific tasks'
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Well-rounded model with strong analytical capabilities'
  }
];

interface ModelSelectorProps {
  open: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({
  open,
  onClose,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Select AI Model</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {availableModels.map((model) => (
            <ListItem
              key={model.id}
              button
              onClick={() => {
                onModelChange(model.id);
                onClose();
              }}
            >
              <ListItemIcon>
                <Radio checked={selectedModel === model.id} />
              </ListItemIcon>
              <ListItemText
                primary={model.name}
                secondary={model.description}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}