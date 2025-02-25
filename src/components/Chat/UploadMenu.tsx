import { useState, useRef } from 'react';
import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Typography 
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Description as FileIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

interface UploadMenuProps {
  onUpload: (files: File[]) => void;
}

export default function UploadMenu({ onUpload }: UploadMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUpload(files);
      handleClose();
    }
    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <AttachFileIcon fontSize="small" />
      </IconButton>

      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />

      <input
        type="file"
        ref={folderInputRef}
        webkitdirectory=""
        directory=""
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => imageInputRef.current?.click()}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload image</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘U
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => fileInputRef.current?.click()}>
          <ListItemIcon>
            <FileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload file</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => folderInputRef.current?.click()}>
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload folder</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}