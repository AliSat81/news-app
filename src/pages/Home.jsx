import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import News from '../components/News';
import NewsContent from '../components/NewsContent';
import Header from '../components/Header';
import { useDispatch } from 'react-redux';
import { fetchNews } from '../app/store/slices/newsSlice';

export default function Home() {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(fetchNews()).unwrap();
      } catch (e) {
        console.error('Error fetching news:', e);
      }
    }
    fetchData();
  }, []);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={[
          drawerOpen && {
            height: '100vh',
            overflow: 'hidden',
          },
        ]}
      >
        <Layout.Header>
          <Header />
        </Layout.Header>
        <Layout.SideNav>
          <Navigation />
        </Layout.SideNav>
        <Layout.SidePane>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
          </Box>
          <News/>
        </Layout.SidePane>
        <Layout.Main>
          <NewsContent/>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}
