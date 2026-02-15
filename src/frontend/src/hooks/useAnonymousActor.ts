import { useQuery } from '@tanstack/react-query';
import { createActorWithConfig } from '../config';
import { type backendInterface } from '../backend';

let anonymousActorInstance: backendInterface | null = null;

async function getAnonymousActor() {
  if (anonymousActorInstance) {
    return anonymousActorInstance;
  }

  // Create actor without identity (anonymous)
  anonymousActorInstance = await createActorWithConfig();
  return anonymousActorInstance;
}

export function useAnonymousActor() {
  const query = useQuery<backendInterface>({
    queryKey: ['anonymousActor'],
    queryFn: getAnonymousActor,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    actor: query.data || null,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}
