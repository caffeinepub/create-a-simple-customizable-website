import { useInternetIdentity } from './useInternetIdentity';
import { useIsCallerAdmin } from './useQueries';

// This hook is kept for backward compatibility but is no longer used for editor access
export function useAdminAccess() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading, error } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  return {
    isAdmin: isAuthenticated && isAdmin === true,
    isLoading,
    error,
    isAuthenticated,
  };
}
