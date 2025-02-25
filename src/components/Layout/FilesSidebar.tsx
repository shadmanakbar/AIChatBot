import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Modal,
    Button,
    TextField,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    AllInbox as AllFilesIcon,
    Description as DocumentIcon,
    Image as ImageIcon,
    Audiotrack as AudioIcon,
    VideoLibrary as VideoIcon,
    Add as AddIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { File } from '../../types'; // Import the File interface
import { useNavigate } from 'react-router-dom';

  const mockData = {
    allFiles: [
      { name: 'file1.txt', size: '15 KB', uploadedOn: '2023-01-01' },
      { name: 'file2.jpg', size: '200 KB', uploadedOn: '2023-01-02' },
      { name: 'video1.mp4', size: '5 MB', uploadedOn: '2023-01-03' },
      { name: 'audio1.mp3', size: '3 MB', uploadedOn: '2023-01-04' },
    ],
    documents: [
      { name: 'file1.txt', size: '15 KB', uploadedOn: '2023-01-01' },
      { name: 'file2.doc', size: '20 KB', uploadedOn: '2023-01-02' },
    ],
    images: [
      { name: 'file2.jpg', size: '200 KB', uploadedOn: '2023-01-02' },
      { name: 'image1.png', size: '150 KB', uploadedOn: '2023-01-03' },
    ],
    audio: [
      { name: 'audio1.mp3', size: '3 MB', uploadedOn: '2023-01-04' },
    ],
    videos: [
      { name: 'video1.mp4', size: '5 MB', uploadedOn: '2023-01-03' },
    ],
  };
  
  
  const DRAWER_WIDTH = 280;
  
  interface FileSidebarProps {
    setFetchedData: React.Dispatch<React.SetStateAction<File[]>>; // Ensure this matches the type of data being set 
    
  }
  export default function FileSidebar({ setFetchedData }: FileSidebarProps) {
    const [open, setOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const [knowledgeBaseName, setKnowledgeBaseName] = useState('');
    const [knowledgeBaseDescription, setKnowledgeBaseDescription] = useState('');
    const [knowledgeBases, setKnowledgeBases] = useState<{ name: string }[]>([]); // Ensure this is initialized as an array
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string | null>(null);
    const [newKnowledgeBaseName, setNewKnowledgeBaseName] = useState(''); // State for new name
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKnowledgeBases = async () => {
            try {
                const response = await fetch('http://localhost:8080/list-knowledgebase');
                if (!response.ok) {
                    throw new Error('Failed to fetch knowledge bases');
                }
                const data = await response.json();
                // Extract directories from the response
                if (Array.isArray(data.directories)) {
                    setKnowledgeBases(data.directories); // Set the directories directly
                } else {
                    console.error('Expected an array but got:', data.directories);
                }
            } catch (error) {
                console.error('Error fetching knowledge bases:', error);
            }
        };

        fetchKnowledgeBases(); // Call the function to fetch knowledge bases
    }, []);
  
    const handleFetchData = (type: string) => {
      // Mock API call
      console.log(`Fetching ${type}...`);
      const data = mockData[type as keyof typeof mockData]; // Cast type to keyof mockData
      console.log(data); // Display fetched data in console
      setFetchedData(data); // Set the fetched data to parent state
    };
  
    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setKnowledgeBaseName(''); // Clear input fields when closing the modal
        setKnowledgeBaseDescription('');
    };
    const handleOpenRenameModal = () => {
        setNewKnowledgeBaseName(selectedKnowledgeBase || ''); // Set the current name as default
        setRenameOpen(true);
        handleCloseMenu();
    };

    const handleCloseRenameModal = () => {
        setRenameOpen(false);
        setNewKnowledgeBaseName('');
    };
  

    const handleCreateKnowledgeBase = async () => {
        // Logic to create knowledge base
        const payload = {
            name: knowledgeBaseName,
            description: knowledgeBaseDescription,
        };

        try {
            const response = await fetch('http://localhost:8080/create-knowledgebase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create knowledge base');
            }

            const data = await response.json();
            console.log('Knowledge Base Created:', data); // Log the response from the server
        } catch (error) {
            console.error('Error creating knowledge base:', error);
        }

        handleCloseModal(); // Close the modal after creation
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, kb: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedKnowledgeBase(kb);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleRename = () => {
        handleOpenRenameModal();
    };

    const handleRenameSubmit = async () => {
        if (!selectedKnowledgeBase || !newKnowledgeBaseName) return;

        const payload = {
            currentName: selectedKnowledgeBase,
            newName: newKnowledgeBaseName,
        };

        try {
            const response = await fetch('http://localhost:8080/rename-knowledgebase', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to rename knowledge base');
            }

            // Update the state to reflect the new name
            setKnowledgeBases(prev => prev.map(kb => (kb.name === selectedKnowledgeBase ? { name: newKnowledgeBaseName } : kb)));
            console.log(`Renamed ${selectedKnowledgeBase} to ${newKnowledgeBaseName}`);
        } catch (error) {
            console.error('Error renaming knowledge base:', error);
        }

        handleCloseRenameModal();
    };

    const handleDelete = async () => {
        if (!selectedKnowledgeBase) return;

        const payload = {
            knowledgeBaseName: selectedKnowledgeBase,
        };

        try {
            const response = await fetch('http://localhost:8080/delete-knowledgebase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to delete knowledge base');
            }

            // Update the state to remove the deleted knowledge base
            setKnowledgeBases(prev => prev.filter(kb => kb.name !== selectedKnowledgeBase));
            console.log(`Deleted ${selectedKnowledgeBase}`);
        } catch (error) {
            console.error('Error deleting knowledge base:', error);
        }

        handleCloseMenu();
    };
  
    const handleKnowledgeBaseClick = (kb: string) => {
        navigate(`/files/${kb}`); // Change this line
    };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        marginLeft: 10,
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>Knowledge Base</Typography>
                    <List>
                        <ListItem component="button" onClick={() => handleFetchData('allFiles')}>
                            <ListItemIcon><AllFilesIcon /></ListItemIcon>
                            <ListItemText primary="All Files" />
                        </ListItem>
                        <ListItem component="button" onClick={() => handleFetchData('documents')}>
                            <ListItemIcon><DocumentIcon /></ListItemIcon>
                            <ListItemText primary="Documents" />
                        </ListItem>
                        <ListItem component="button" onClick={() => handleFetchData('images')}>
                            <ListItemIcon><ImageIcon /></ListItemIcon>
                            <ListItemText primary="Images" />
                        </ListItem>
                        <ListItem component="button" onClick={() => handleFetchData('audio')}>
                            <ListItemIcon><AudioIcon /></ListItemIcon>
                            <ListItemText primary="Audio" />
                        </ListItem>
                        <ListItem component="button" onClick={() => handleFetchData('videos')}>
                            <ListItemIcon><VideoIcon /></ListItemIcon>
                            <ListItemText primary="Videos" />
                        </ListItem>
                        <ListItem component="button" onClick={handleOpenModal}>
                            <ListItemIcon><AddIcon /></ListItemIcon>
                            <ListItemText primary="Create Knowledge Base" />
                        </ListItem>
                    </List>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Existing Knowledge Bases:</Typography>
                    {knowledgeBases.map((kb, index) => (
                        <ListItem key={index} onClick={() => handleKnowledgeBaseClick(kb)} secondaryAction={
                            <Button onClick={(e) => handleMenuClick(e, kb)}>
                                <MoreVertIcon />
                            </Button>
                        }>
                            <ListItemIcon><DocumentIcon /></ListItemIcon>
                            <ListItemText primary={kb} />
                        </ListItem>
                    ))}
                    {/* Menu for rename and delete options */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={handleRename}>Rename</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                    {/* Modal for creating knowledge base */}
                    <Modal open={open} onClose={handleCloseModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            width: 400,
                        }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Create Knowledge Base</Typography>
                            <TextField
                                label="Knowledge base name"
                                fullWidth
                                value={knowledgeBaseName}
                                onChange={(e) => setKnowledgeBaseName(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Knowledge base description (optional)"
                                fullWidth
                                multiline
                                rows={4}
                                value={knowledgeBaseDescription}
                                onChange={(e) => setKnowledgeBaseDescription(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button onClick={handleCreateKnowledgeBase} variant="contained" sx={{ mt: 2 }}>
                                Create New
                            </Button>
                        </Box>
                    </Modal>
                    {/* Modal for renaming knowledge base */}
                    <Modal open={renameOpen} onClose={handleCloseRenameModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            width: 400,
                        }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Rename Knowledge Base</Typography>
                            <TextField
                                label="New Knowledge Base Name"
                                fullWidth
                                value={newKnowledgeBaseName}
                                onChange={(e) => setNewKnowledgeBaseName(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button onClick={handleRenameSubmit} variant="contained" sx={{ mt: 2 }}>
                                OK
                            </Button>
                        </Box>
                    </Modal>
                </Box>
            </Drawer>
        </>
    );
}