import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: {
    news: [],
    selectedNews: {},
    bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || {},
    editedNews: JSON.parse(localStorage.getItem('editedNews')) || {},
    deletedNews: JSON.parse(localStorage.getItem('deletedNews')) || {},
  },
  loading: {
    fetchNews: false,
  },
  error: {
    fetchNews: null,
  },
  lastUpdated: null
};

// Helper function to handle API errors
const handleApiError = (error) => {
  const message = error.response?.data?.message || "An unexpected error occurred";
  return { error: true, message };
};

// Async action to fetch news
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
        params: {
          q: 'crypto',
          "api-key": import.meta.env.VITE_NYT_API_KEY,
        },
      });
      return response?.data?.response?.docs;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const newsSlice = createSlice(
    {
        name: "news",
        initialState,
        reducers: {
          clearErrors: (state) => {
            state.error = initialState.error;
          },
          addToSelectedNews: (state, action) => {
            state.data.selectedNews = (action.payload);
          },
          removeFromSelectedNews: (state, action) => {
            state.data.selectedNews = state.data.selectedNews.filter(item => item._id !== action.payload._id);
          },
          addBookmark: (state, action) => {
            const item = action.payload;
            state.data.bookmarks[item._id] = item;
            
            localStorage.setItem('bookmarks', JSON.stringify(state.data.bookmarks));
          },
          deleteBookmark: (state, action) => {
            const itemId = action.payload._id;
            delete state.data.bookmarks[itemId];
            
            localStorage.setItem('bookmarks', JSON.stringify(state.data.bookmarks));
          },
          editNews: (state, action) => {
            const item = action.payload;
            state.data.editedNews[item._id] = item;
            state.data.news = state.data.news.map(i => i._id === item._id ? item : i)
            state.data.selectedNews = item
            localStorage.setItem('editedNews', JSON.stringify(state.data.editedNews));
          },
          deleteNews: (state, action) => {
            const itemId = action.payload._id;
            state.data.deletedNews[itemId] = action.payload;
            state.data.news = state.data.news.filter(item => item._id !== itemId);
            state.data.selectedNews = { ...state.data.news[0], index: 0 }
            
            localStorage.setItem('deletedNews', JSON.stringify(state.data.deletedNews));
            
            // Remove from bookmarks and editedNews too
            delete state.data.bookmarks[itemId];
            delete state.data.editedNews[itemId];
            localStorage.setItem('bookmarks', JSON.stringify(state.data.bookmarks));
            localStorage.setItem('editedNews', JSON.stringify(state.data.editedNews));
          }
        },
        extraReducers: (builder) => {
          builder
            .addCase(fetchNews.pending, (state) => {
              state.loading.fetchNews = true;
              state.error.fetchNews = null;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
              state.loading.fetchNews = false;
              state.error.fetchNews = null;

              const editedNews = state.data.editedNews;
              const deletedNews = state.data.deletedNews;

              // Filter out deleted news from the fetched data
              const filteredNews = action.payload.filter(item => !deletedNews[item._id]);

              // Apply edits to the filtered news
              const updatedNews = filteredNews.map(item => editedNews[item._id] ? editedNews[item._id] : item);

              state.data.news = updatedNews;
              state.data.selectedNews = { ...updatedNews[0], index: 0 };
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchNews.rejected, (state, action) => {
              state.loading.fetchNews = false;
              state.error.fetchNews = action.payload;
            })
        },
    }
)


export const { clearErrors, addToSelectedNews, removeFromSelectedNews, addBookmark, deleteBookmark, deleteNews, editNews } = newsSlice.actions;

export const selectNews = (state) => 
  state.news.data.news || [];

export const selectSelectedNews = (state) => 
  state.news.data.selectedNews || {};

export const selectBookmarks = (state) => 
  state.news.data.bookmarks || {};

export const selectEditedNews = (state) => 
  state.news.data.editedNews || {};

export const selectDeletedNews = (state) => 
  state.news.data.deletedNews || {};

export const selectLoadingState = (state, operation) => 
  state.news.loading[operation];

export const selectError = (state, operation) => 
  state.news.error[operation];

export const selectLastUpdated = (state) => 
  state.news.lastUpdated;

export default newsSlice.reducer;