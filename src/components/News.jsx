import * as React from 'react';
import { useMemo, useCallback, useTransition } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { 
  addToSelectedNews, 
  selectNews, 
  selectSelectedNews,
  selectDeletedNews,
  selectBookmarks, 
  selectEditedNews
} from '../app/store/slices/newsSlice';

const NewsListItem = React.memo(({ 
  item, 
  index, 
  isSelected, 
  onSelect 
}) => {
  const handleClick = useCallback(() => {
    onSelect(item, index);
  }, [item, index, onSelect]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(item?.pub_date).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  }, [item?.pub_date]);

  return (
    <React.Fragment>
      <ListItem onClick={handleClick}>
        <ListItemButton
          selected={isSelected}
          color="neutral"
          sx={{ p: 2 }}
        >
          <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
            <Avatar 
              src={item?.multimedia?.[0]?.url || 'https://i.pravatar.cc/80?img=3'}
              alt={item?.headline?.main || 'News thumbnail'}
            />
          </ListItemDecorator>
          <Box sx={{ pl: 2, width: '100%' }}>
            <Box
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 0.5 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography level="body-xs">
                  {item?.byline?.original || item?.source || "Publisher"}
                </Typography>
                {item.color && (
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '99px',
                      bgcolor: item.color,
                    }}
                  />
                )}
              </Box>
              <Typography level="body-xs" textColor="text.tertiary">
                {formattedDate}
              </Typography>
            </Box>
            <div>
              <Typography level="title-sm" sx={{ mb: 0.5 }}>
                {item?.headline?.main}
              </Typography>
              <Typography level="body-sm">{item.body}</Typography>
            </div>
          </Box>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ m: 0 }} />
    </React.Fragment>
  );
});

NewsListItem.displayName = 'NewsListItem';

export default function News() {
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Selectors for different data sources
  const latestNews = useSelector(selectNews);
  const editedNews = useSelector(selectEditedNews);
  const deletedNews = useSelector(selectDeletedNews);
  const bookmarkedNews = useSelector(selectBookmarks);
  const selectedNews = useSelector(selectSelectedNews);

  const currentData = useMemo(() => {
    const path = location.pathname;
    
    switch (path) {
      case '/deleted':
        return Object.values(deletedNews || {});
      case '/bookmarks':
        return Object.values(bookmarkedNews || {});
      case '/edited':
        return Object.values(editedNews || {});
      // case '/cached':
      //   return Object.values(bookmarkedNews || {});
      case '/':
      default:
        return latestNews || [];
    }
  }, [location.pathname, latestNews, deletedNews, bookmarkedNews]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    
    switch (path) {
      case '/deleted':
        return 'Deleted News';
      case '/edited':
        return 'Edited News';
      // case '/cached':
      //   return 'Cached News';
      case '/bookmarks':
        return 'Bookmarked News';
      case '/':
      default:
        return 'Latest News';
    }
  }, [location.pathname]);

  const handleSelect = useCallback((item, index) => {
    startTransition(() => {
      dispatch(addToSelectedNews({ ...item, index }));
    });
  }, [dispatch]);

  const listStyles = useMemo(() => ({
    [`& .${listItemButtonClasses.root}.${listItemButtonClasses.selected}`]: {
      borderLeft: '2px solid',
      borderLeftColor: 'var(--joy-palette-primary-outlinedBorder)',
    },
    opacity: isPending ? 0.7 : 1,
    transition: 'opacity 0.2s ease'
  }), [isPending]);

  if (!currentData || !Array.isArray(currentData) || currentData.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography level="h2" sx={{ mb: 2 }}>{pageTitle}</Typography>
        <Typography level="body-sm">
          {location.pathname === '/bookmarks' 
            ? 'No bookmarked news available. Add some news to your bookmarks!'
            : location.pathname === '/deleted'
            ? 'No deleted news available.'
            : 'No news available at the moment.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography level="h2" sx={{ p: 2 }}>{pageTitle}</Typography>
      <List sx={listStyles}>
        {currentData.map((item, index) => (
          <NewsListItem
            key={`${item?.headline?.main}-${index}`}
            item={item}
            index={index}
            isSelected={selectedNews?.index === index}
            onSelect={handleSelect}
          />
        ))}
      </List>
    </Box>
  );
}