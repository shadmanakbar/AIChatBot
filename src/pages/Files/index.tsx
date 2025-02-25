import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Menu, MenuItem } from '@mui/material';
import FileSidebar from '../../components/Layout/FilesSidebar';
import { useState, useEffect } from 'react';
import { File } from '../../types'; // Import the File interface

// Define the FilesProps interface
interface FilesProps {
  fetchedData?: File[]; // Optional prop for fetched data
}

export default function Files({ fetchedData = [] }: FilesProps) {
  const [data, setData] = useState<File[]>(fetchedData);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]); // State to track selected files
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for menu anchor

  // Effect to log data whenever it changes
  useEffect(() => {
    console.log('Current data:', data);
  }, [data]);

  const handleSelectFile = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) ? prev.filter(name => name !== fileName) : [...prev, fileName]
    );
  };

  const handleDeleteSelected = () => {
    setData(prev => prev.filter(file => !selectedFiles.includes(file.name)));
    setSelectedFiles([]); // Clear selection after deletion
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Set the anchor for the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Convert size to KB
        uploadedOn: new Date().toISOString().split('T')[0], // Set uploadedOn to today's date
      }));
      setData(prev => [...prev, ...filesArray]); // Add uploaded files to the data
    }
    handleClose(); // Close the menu after upload
  };

  const handleUploadFolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle folder upload logic here
    // Note: Folder uploads require a different approach, typically using the File System API
    handleClose(); // Close the menu after upload
  };

  return (
    <Box sx={{ p: 3, ml: 15 }}> {/* Added left margin of 50 pixels */}
      <FileSidebar setFetchedData={setData} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Files</Typography>
        <div>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
          >
            Upload
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <input
                type="file"
                id="upload-file"
                style={{ display: 'none' }}
                onChange={handleUploadFile}
              />
              <label htmlFor="upload-file" style={{ cursor: 'pointer' }}>
                Upload File
              </label>
            </MenuItem>
            <MenuItem>
              <input
                type="file"
                id="upload-folder"
                webkitdirectory="" // Allow folder selection
                style={{ display: 'none' }}
                onChange={handleUploadFolder}
              />
              <label htmlFor="upload-folder" style={{ cursor: 'pointer' }}>
                Upload Folder
              </label>
            </MenuItem>
          </Menu>
        </div>
      </Box>

      {selectedFiles.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
          sx={{ mb: 2 }}
        >
          Delete Selected
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedFiles.length === data.length}
                onChange={() => {
                  if (selectedFiles.length === data.length) {
                    setSelectedFiles([]);
                  } else {
                    setSelectedFiles(data.map(file => file.name));
                  }
                }}
              />
            </TableCell>
            <TableCell>File Name</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Uploaded On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? ( // Check if data has items
            data.map((file, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedFiles.includes(file.name)}
                    onChange={() => handleSelectFile(file.name)}
                  />
                </TableCell>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadedOn}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">No files available</TableCell> {/* Message when no files are available */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}