import { createContext, useContext } from 'react';

export interface HomeDrawerValue {
  /** Opens the Home navigation drawer. */
  openDrawer: () => void;
}

/**
 * Lets the Home app-bar's hamburger open the drawer owned by `HomeWithDrawer`,
 * without threading props through the navigator's screen component.
 */
export const HomeDrawerContext = createContext<HomeDrawerValue>({
  openDrawer: () => {},
});

export function useHomeDrawer(): HomeDrawerValue {
  return useContext(HomeDrawerContext);
}
