import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WebsiteContent } from '../backend';

// Editor loads Draft content - only when editor is open
// Now uses authenticated actor for admin-only draft operations
export function useGetDraftContent(isEditorOpen: boolean) {
  const { actor, isFetching } = useActor();

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
// Now uses authenticated actor for admin-only draft operations
export function useUpdateDraftContent() {
  const { actor } = useActor();
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
// Now uses authenticated actor for admin-only publish operation
export function usePublishDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishDraft();
    },
    onSuccess: async () => {
      // Invalidate both Draft and Live content so public site updates
      await queryClient.invalidateQueries({ queryKey: ['draftContent'] });
      await queryClient.invalidateQueries({ queryKey: ['liveContent'] });
      // Explicitly refetch live content to guarantee immediate update
      await queryClient.refetchQueries({ queryKey: ['liveContent'] });
    },
  });
}
