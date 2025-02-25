import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description'; // Import an icon for file type
import FileSidebar from '../../components/Layout/FilesSidebar';

interface File {
    name: string;
    type: string;
    creationTime: string;
    updatedTime: string;
}

const KnowledgeBaseFiles: React.FC = () => {
    const { knowledgeBaseName } = useParams<{ knowledgeBaseName: string }>();
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null); // State to handle errors

    useEffect(() => {
        const fetchFiles = async () => {
            const payload = { knowledgeBaseName };
            console.log('Fetching files for knowledge base:', knowledgeBaseName); // Debugging log
            try {
                const response = await fetch('http://localhost:8080/list-files-knowledgebase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch files for knowledge base');
                }

                const data = await response.json();
                console.log('Fetched files:', data); // Log the fetched files

                // Check if files is null and handle accordingly
                if (data.files === null) {
                    setFiles([]); // Set files to an empty array
                    setError('No files available for this knowledge base.'); // Set error message
                } else {
                    setFiles(data.files); // Set the fetched files
                    setError(null); // Clear any previous error
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('An error occurred while fetching files.'); // Set error message
            }
        };

        if (knowledgeBaseName) { // Ensure knowledgeBaseName is defined
            fetchFiles();
        }
    }, [knowledgeBaseName]);

    return (
        <Box sx={{ p: 3, ml: 15 }}>
            <FileSidebar setFetchedData={setFiles} />
            <Typography variant="h4" gutterBottom>
                Files in {knowledgeBaseName}
            </Typography>
            {error && <Typography color="error">{error}</Typography>} {/* Display error message if any */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>File Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Updated</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.length > 0 ? ( // Check if there are files to display
                        files.map((file) => (
                            <TableRow key={file.name}>
                                <TableCell>
                                    <DescriptionIcon style={{ marginRight: 8 }} /> {/* Icon for file type */}
                                    {file.name}
                                </TableCell>
                                <TableCell>{file.type}</TableCell>
                                <TableCell>{new Date(file.creationTime).toLocaleString()}</TableCell>
                                <TableCell>{new Date(file.updatedTime).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">No files available.</TableCell> {/* Message when no files are available */}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
};

export default KnowledgeBaseFiles;