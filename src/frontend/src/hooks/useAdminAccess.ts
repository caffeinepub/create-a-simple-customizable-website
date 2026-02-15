import { useInternetIdentity } from './useInternetIdentity';
import { useIsCallerAdmin } from './useQueries';

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
