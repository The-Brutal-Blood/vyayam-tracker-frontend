import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HomeScreen } from '@/features/dashboard/screens/HomeScreen';

import { SideDrawer } from '../components/SideDrawer';
import { Snackbar, useSnackbar } from '../components/Snackbar';
import { HomeDrawerContext } from '../context/HomeDrawerContext';

/**
 * Host for the Home tab: renders the Home screen, owns the navigation drawer's
 * open state, and provides `openDrawer` to the Home app-bar. Scoping the drawer
 * here keeps it exclusive to Home — other tabs are untouched.
 */
export const HomeWithDrawer = React.memo(function HomeWithDrawerBase() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { message, token, show, hide } = useSnackbar();

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleComingSoon = useCallback((label: string) => show(`${label} — Coming soon`), [show]);

  const drawerValue = useMemo(() => ({ openDrawer }), [openDrawer]);

  return (
    <HomeDrawerContext.Provider value={drawerValue}>
      <View style={styles.root}>
        <HomeScreen />
        <SideDrawer visible={drawerOpen} onClose={closeDrawer} onComingSoon={handleComingSoon} />
        <Snackbar message={message} token={token} onHide={hide} />
      </View>
    </HomeDrawerContext.Provider>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
