import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy';
import theme from './styles/theme.js';
import { Provider } from 'react-redux';
import { store } from './app/store/store.js';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <CssVarsProvider theme={theme} defaultMode='dark'>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CssVarsProvider>
    </Provider>
  </StrictMode>
)
