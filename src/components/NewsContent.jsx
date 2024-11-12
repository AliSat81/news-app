import * as React from 'react';
import { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Sheet,
  Typography,
  Button,
  Snackbar,
  AspectRatio,
  Divider,
  Avatar,
  Textarea,
  Tooltip,
  Link
} from '@mui/joy';
import {
  DeleteRounded,
  BookmarkAddRounded,
  EditRounded,
  BookmarkAddedRounded
} from '@mui/icons-material';
import {
  addBookmark,
  deleteBookmark,
  deleteNews,
  editNews,
  selectBookmarks,
  selectSelectedNews
} from '../app/store/slices/newsSlice';

const NewsHeader = ({ news, onEdit, isBookmarked, onBookmarkAction, onDelete }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar src={news?.multimedia?.[0]?.url || 'https://i.pravatar.cc/80?img=3'} />
      <Box sx={{ ml: 2 }}>
        <Typography level="title-sm" textColor="text.primary" sx={{ mb: 0.5 }}>
          {news?.byline?.original || news?.source || 'Publisher'}
        </Typography>
        <Typography level="body-xs" textColor="text.tertiary">
          {news?.pub_date ? new Date(news.pub_date).toLocaleDateString() : 'Publish Date'}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}>
      <Button size="lg" variant="plain" color="neutral" onClick={onEdit}>
        <EditRounded />
      </Button>
      <Tooltip title={isBookmarked ? "Remove From Bookmarks" : "Add To Bookmarks"} variant="plain">
        <Button 
          size="lg" 
          variant="plain" 
          color="neutral" 
          onClick={() => onBookmarkAction(isBookmarked ? 'Delete' : 'Add')}
        >
          {isBookmarked ? <BookmarkAddedRounded /> : <BookmarkAddRounded />}
        </Button>
      </Tooltip>
      <Button size="lg" variant="plain" color="danger" onClick={onDelete}>
        <DeleteRounded />
      </Button>
    </Box>
  </Box>
);

const NewsContent = () => {
  const dispatch = useDispatch();
  const selectedNews = useSelector(selectSelectedNews);
  const bookmarks = useSelector(selectBookmarks);
  const [editableData, setEditableData] = useState(selectedNews || {});
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({});

  const isBookmarked = useMemo(() => 
    bookmarks?.[selectedNews?._id], 
    [bookmarks, selectedNews?._id]
  );

  const displayImages = useMemo(() => 
    selectedNews?.multimedia?.slice(0, 3).map(media => ({
      url: `https://www.nytimes.com/${media.url}`,
      alt: media.caption || "News image"
    })),
    [selectedNews?.multimedia]
  );

  const handleFieldChange = useCallback((field, value) => {
    setEditableData(prevData => {
      const fields = field.split('.');
      const newData = { ...prevData };
      let currentLevel = newData;

      for (let i = 0; i < fields.length - 1; i++) {
        const key = fields[i];
        currentLevel[key] = { ...currentLevel[key] };
        currentLevel = currentLevel[key];
      }

      currentLevel[fields[fields.length - 1]] = value;
      return newData;
    });
  }, []);

  const handleAddOrDeleteBookmark = useCallback(async (action) => {
    try {
      if (action === 'Add') {
        await dispatch(addBookmark(selectedNews));
        setSnackbar({ color: 'success', message: 'Bookmark Added Successfully.' });
      } else {
        await dispatch(deleteBookmark(selectedNews));
        setSnackbar({ color: 'success', message: 'News Deleted From Bookmarks Successfully.' });
      }
    } catch (error) {
      setSnackbar({ color: 'danger', message: 'There was an error. Please Try again' });
      console.error('Bookmark action failed:', error);
    }
  }, [dispatch, selectedNews]);

  const handleDeleteNews = useCallback(async () => {
    try {
      await dispatch(deleteNews(selectedNews));
      setSnackbar({ color: 'success', message: 'Item Deleted Successfully.' });
    } catch (error) {
      setSnackbar({ color: 'danger', message: 'Delete failed. Please try again.' });
      console.error('Delete failed:', error);
    }
  }, [dispatch, selectedNews]);

  const handleEditNews = useCallback(async () => {
    try {
      await dispatch(editNews(editableData));
      setSnackbar({ color: 'success', message: 'News Updated Successfully.' });
      setIsEditMode(false);
    } catch (error) {
      setSnackbar({ color: 'danger', message: 'Update failed. Please try again.' });
      console.error('Update failed:', error);
    }
  }, [dispatch, editableData]);

  const handleEditStart = useCallback(() => {
    setIsEditMode(true);
    setEditableData(selectedNews);
  }, [selectedNews]);

  const EditableFields = useMemo(() => (
    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%' }}>
      <Textarea
        size="md"
        sx={{ mt: 1, width: '100%', p: 2 }}
        minRows={1}
        value={editableData.headline?.main || ''}
        onChange={(e) => handleFieldChange('headline.main', e.target.value)}
        placeholder="Headline"
      />
      <Textarea
        size="md"
        sx={{ mt: 1, width: '100%', p: 2 }}
        value={editableData.snippet || ''}
        onChange={(e) => handleFieldChange('snippet', e.target.value)}
        minRows={2}
        placeholder="Snippet"
      />
      <Textarea
        size="md"
        sx={{ mt: 1, width: '100%', p: 2 }}
        value={editableData.lead_paragraph || ''}
        onChange={(e) => handleFieldChange('lead_paragraph', e.target.value)}
        minRows={2}
        placeholder="Lead paragraph"
      />
    </Box>
  ), [editableData, handleFieldChange]);

  const DisplayFields = useMemo(() => (
    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Link href={selectedNews?.web_url} target="_blank" rel="noopener noreferrer">
        <Typography level="title-lg" textColor="text.primary">
          {selectedNews?.headline?.main}
        </Typography>
      </Link>
      <Typography level="body-sm" sx={{ mt: 1 }}>
        {selectedNews?.snippet || 'Summary of the news'}
      </Typography>
      <Divider sx={{ width: '100%', my: 2 }} />
      <Typography level="body-sm">
        {selectedNews?.lead_paragraph || 'Full news summary or first paragraph'}
      </Typography>
    </Box>
  ), [selectedNews]);

  return (
    <React.Fragment>
      <Sheet variant="outlined" sx={{ minHeight: 500, borderRadius: 'sm', p: 2, mb: 3 }}>
        <NewsHeader
          news={selectedNews}
          onEdit={handleEditStart}
          isBookmarked={isBookmarked}
          onBookmarkAction={handleAddOrDeleteBookmark}
          onDelete={handleDeleteNews}
        />
        <Divider sx={{ mt: 2 }} />
        
        {isEditMode ? EditableFields : DisplayFields}
        
        <Divider />
        {displayImages && displayImages.length > 0 && (
          <>
            <Typography level="title-sm" sx={{ mt: 2, mb: 2 }}>
              Attachments
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {displayImages.map((image, index) => (
                <Link href={image.url} target="_blank" rel="noopener noreferrer">
                  <Card key={index} variant="outlined">
                    <AspectRatio ratio="1" sx={{ minWidth: 80 }}>
                      <img src={image.url} alt={image.alt} loading="lazy" />
                    </AspectRatio>
                  </Card>
                </Link>
              ))}
            </Box>
          </>
        )}
        
        {isEditMode && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button color="success" onClick={handleEditNews}>Save</Button>
            <Button color="neutral" onClick={() => setIsEditMode(false)}>Cancel</Button>
          </Box>
        )}
      </Sheet>

      <Snackbar 
        color={snackbar?.color} 
        open={!!snackbar?.message} 
        onClose={() => setSnackbar({})}
        autoHideDuration={3000}
      >
        {snackbar?.message}
      </Snackbar>
    </React.Fragment>
  );
};

export default NewsContent;