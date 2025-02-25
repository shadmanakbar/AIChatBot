import {
  Box,
  Typography,
  Button,
  Paper,
  InputBase,
  IconButton,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

export default function KnowledgeBase() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5">Knowledge Base</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your knowledge base and files
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
        >
          Upload
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
            bgcolor: 'background.paper',
          }}
        >
          <SearchIcon sx={{ p: 1, color: 'text.secondary' }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Knowledge Base..."
          />
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>
            ⌘K
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Click + to add a knowledge base
        </Typography>
      </Box>
    </Box>
  );
}