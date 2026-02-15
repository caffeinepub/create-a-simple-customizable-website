import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAnonymousActor } from './useAnonymousActor';
import type { WebsiteContent } from '../backend';

export function useGetAnonymousWebsiteContent() {
  const { actor, isFetching } = useAnonymousActor();

  return useQuery<WebsiteContent>({
    queryKey: ['websiteContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWebsiteContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAnonymousWebsiteContent() {
  const { actor } = useAnonymousActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: WebsiteContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWebsiteContent(content);
    },
    onSuccess: () => {
      // Invalidate both the anonymous and authenticated queries
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
    },
  });
}
