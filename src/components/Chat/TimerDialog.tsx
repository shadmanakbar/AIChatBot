import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Switch,
  Typography,
  Slider,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface TimerDialogProps {
  open: boolean;
  onClose: () => void;
  messageLimit: number;
  isLimitEnabled: boolean;
  onLimitChange: (limit: number) => void;
  onLimitToggle: (enabled: boolean) => void;
}

export default function TimerDialog({
  open,
  onClose,
  messageLimit,
  isLimitEnabled,
  onLimitChange,
  onLimitToggle,
}: TimerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Context Settings</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography>Limit History Message Count</Typography>
            <Switch
              checked={isLimitEnabled}
              onChange={(e) => onLimitToggle(e.target.checked)}
            />
          </Box>
          <Box sx={{ px: 2 }}>
            <Slider
              disabled={!isLimitEnabled}
              value={messageLimit}
              onChange={(_, value) => onLimitChange(value as number)}
              min={1}
              max={50}
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}