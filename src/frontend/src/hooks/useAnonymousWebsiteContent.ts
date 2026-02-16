import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAnonymousActor } from './useAnonymousActor';
import type { WebsiteContent } from '../backend';

// Editor loads Draft content - only when editor is open
export function useGetDraftContent(isEditorOpen: boolean) {
  const { actor, isFetching } = useAnonymousActor();

  return useQuery<WebsiteContent>({
    queryKey: ['draftContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDraftContent();
    },
    enabled: !!actor && !isFetching && isEditorOpen,
    retry: 2,
    retryDelay: 1000,
  });
}

// Editor updates Draft content only
export function useUpdateDraftContent() {
  const { actor } = useAnonymousActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: WebsiteContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDraftContent(content);
    },
    onSuccess: () => {
      // Only invalidate draft content when saving
      queryClient.invalidateQueries({ queryKey: ['draftContent'] });
    },
  });
}

// Publish Draft to Live
export function usePublishDraft() {
  const { actor } = useAnonymousActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishDraft();
    },
    onSuccess: () => {
      // Invalidate both Draft and Live content so public site updates
      queryClient.invalidateQueries({ queryKey: ['draftContent'] });
      queryClient.invalidateQueries({ queryKey: ['liveContent'] });
    },
  });
}
