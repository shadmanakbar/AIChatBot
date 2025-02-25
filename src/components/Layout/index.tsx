import { Box } from '@mui/material';
import PrimarySidebar from './PrimarySidebar';
import Sidebar from './Sidebar';
import ChatArea from '../../components/Chat/ChatArea';
import { useLocation } from 'react-router-dom';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showSecondarySidebar = !location.pathname.startsWith('/profile');
  const showNewSidebar = location.pathname.startsWith('/files'); // Check if on files page

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {showSecondarySidebar && (
        <Box sx={{ width: '70px', flexShrink: 0 }}>
          <PrimarySidebar />
        </Box>
      )}
      {showSecondarySidebar && (
        <Box sx={{ width: '70px', flexShrink: 0 }}>
          <Sidebar />
        </Box>
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${showNewSidebar ? 80 : 200}px)` },
          ml: { sm: `${showNewSidebar ? 80 : 200}px` },
          height: '100vh',
          overflow: 'auto',
        }}
      >
       {children}
      </Box>
    </Box>
  );
}