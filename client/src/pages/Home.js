import React, {useState} from 'react';
import {AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton,ListItemIcon,ListItemText,Toolbar,Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ProfessorIcon,StudentIcon, ManualIcon,AboutIcon } from '../icons';
import ResponsiveStepper from './ResponsiveStepper';
import StartQuiz from './StartQuiz';
import Manual from './Manual';
import About from './About';

const drawerWidth = 240;

export default function Home(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Professor');

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemClick = (text) => {
    setSelectedItem(text);
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Professor', 'Student', 'Manual', 'About'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(text)}
              selected={selectedItem === text}
            >
              <ListItemIcon>
                {text === 'Professor' ? (
                  <ProfessorIcon />
                ) : text === 'Student' ? (
                  <StudentIcon />
                ) : text === 'Manual' ? (
                  <ManualIcon />
                ) : (
                  <AboutIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}


      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const renderContent = () => {
    if (selectedItem === 'Professor') {
      return (
        <ResponsiveStepper selectedItem={selectedItem} />
      );
    } else if (selectedItem === 'Student') {
      return (
        <StartQuiz />
      );
    } else if (selectedItem === 'About') {
      return (
        <About />
      );
    } else if (selectedItem === 'Manual') {
      return (
        <Manual />
      );
    }
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "green",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'center', flexGrow: 1 }}>
            Quiz App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}

