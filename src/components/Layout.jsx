import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';

const Root = React.memo(({ sx, ...props }) => (
  <Box
    {...props}
    sx={[
      {
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
          md: 'minmax(160px, 300px) minmax(300px, 500px) minmax(500px, 1fr)',
        },
        gridTemplateRows: '64px 1fr',
        minHeight: '100vh',
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
));

const Header = React.memo(({ sx, ...props }) => (
  <Box
    component="header"
    className="Header"
    {...props}
    sx={[
      {
        p: 2,
        gap: 2,
        bgcolor: 'background.surface',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gridColumn: '1 / -1',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
));

const SideNav = React.memo(({ sx, ...props }) => (
  <Box
    component="nav"
    className="Navigation"
    role="navigation"
    {...props}
    sx={[
      {
        p: 2,
        bgcolor: 'background.surface',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: {
          xs: 'none',
          sm: 'initial',
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
));

const SidePane = React.memo(({ sx, ...props }) => (
  <Box
    className="Inbox"
    role="complementary"
    {...props}
    sx={[
      {
        bgcolor: 'background.surface',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: {
          xs: 'none',
          md: 'initial',
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
));

const Main = React.memo(({ sx, ...props }) => (
  <Box
    component="main"
    className="Main"
    role="main"
    {...props}
    sx={[
      { p: 2 },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
));

const SideDrawer = React.memo(({ onClose, sx, children, ...props }) => {
  const handleBackdropClick = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const backdropStyles = React.useMemo(
    () => (theme) => ({
      position: 'absolute',
      inset: 0,
      bgcolor: `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
    }),
    []
  );

  const sheetStyles = React.useMemo(
    () => ({
      minWidth: 256,
      width: 'max-content',
      height: '100%',
      p: 2,
      boxShadow: 'lg',
      bgcolor: 'background.surface',
    }),
    []
  );

  return (
    <Box
      {...props}
      sx={[
        { 
          position: 'fixed', 
          zIndex: 1200, 
          width: '100%', 
          height: '100%' 
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={handleBackdropClick}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        sx={backdropStyles}
      />
      <Sheet sx={sheetStyles}>
        {children}
      </Sheet>
    </Box>
  );
});

Root.displayName = 'LayoutRoot';
Header.displayName = 'LayoutHeader';
SideNav.displayName = 'LayoutSideNav';
SidePane.displayName = 'LayoutSidePane';
Main.displayName = 'LayoutMain';
SideDrawer.displayName = 'LayoutSideDrawer';

const Layout = {
  Root,
  Header,
  SideNav,
  SidePane,
  SideDrawer,
  Main,
};

export default Layout;

export {
  Root,
  Header,
  SideNav,
  SidePane,
  SideDrawer,
  Main,
};