import { QueryClient } from '@tanstack/react-query';

/**
 * App-wide TanStack Query client. Mutations never auto-retry (registration
 * and OTP verification must not fire twice); queries get a light retry for
 * flaky mobile networks.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
    mutations: {
      retry: 0,
    },
  },
});
