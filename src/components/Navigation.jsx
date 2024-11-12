import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';

import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import StorageRounded from '@mui/icons-material/StorageRounded';
import NewspaperRounded from '@mui/icons-material/NewspaperRounded';

const navigationItems = [
  {
    title: 'Latest News',
    link: '',
    icon: <NewspaperRounded fontSize="medium" />,
    description: 'Follow latest news'
  },
  {
    title: 'Bookmarks',
    link: 'bookmarks',
    icon: <BookmarkRounded fontSize="medium" />,
    description: 'View your saved items'
  },
  {
    title: 'Edited',
    link: 'edited',
    icon: <EditRounded fontSize="medium" />,
    description: 'Recently modified content'
  },
  {
    title: 'Deleted',
    link: 'deleted',
    icon: <DeleteRoundedIcon fontSize="medium" />,
    description: 'Removed items'
  },
  // {
  //   title: 'Cached Data',
  //   link: 'cached',
  //   icon: <StorageRounded fontSize="medium" />,
  //   description: 'Local storage items'
  // }
];

// Memoized navigation item component
const NavigationItem = React.memo(({ 
  item, 
  isActive, 
  onNavigate 
}) => (
  <ListItem>
    <ListItemButton 
      selected={isActive}
      variant={isActive ? "soft" : "plain"}
      onClick={() => onNavigate(item.link)}
    >
      <ListItemDecorator>
        {item.icon}
      </ListItemDecorator>
      <ListItemContent>
        <Typography level="body-sm" fontWeight="lg">
          {item.title}
        </Typography>
        <Typography level="body-xs" sx={{ color: 'neutral.500' }}>
          {item.description}
        </Typography>
      </ListItemContent>
    </ListItemButton>
  </ListItem>
));

NavigationItem.displayName = 'NavigationItem';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = React.useTransition();
  
  const handleNavigate = React.useCallback((link) => {
    startTransition(() => {
      navigate(link);
    });
  }, [navigate]);

  const isActivePath = React.useCallback((path) => {
    if (path === '') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(`/${path}`);
  }, [location.pathname]);
  

  const listStyles = React.useMemo(() => ({
    '--ListItem-radius': '8px',
    '--List-gap': '4px',
    '--ListItemDecorator-size': '32px',
    opacity: isPending ? 0.7 : 1,
    transition: 'opacity 0.2s ease'
  }), [isPending]);

  return (
    <Box 
      component="nav" 
      sx={{ 
        width: '100%', 
        maxWidth: 300 
      }}
    >
      <List
        size="md"
        sx={listStyles}
      >
        <ListItem nested>
          <ListSubheader 
            sx={{ 
              letterSpacing: '2px', 
              fontWeight: '800',
              fontSize: 'sm',
              paddingY: 1.5
            }}
          >
            Browse
          </ListSubheader>
          <List 
            aria-labelledby="nav-list-browse"
            role="navigation"
          >
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.link}
                item={item}
                isActive={isActivePath(item.link)}
                onNavigate={handleNavigate}
              />
            ))}
          </List>
        </ListItem>
      </List>
    </Box>
  );
}