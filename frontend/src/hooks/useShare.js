import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shareService } from '../services/shareService';
import { QUERY_KEYS } from './useNotes';
import toast from 'react-hot-toast';

export const useShareNote = (noteId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => shareService.shareNote(noteId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.note(noteId) });
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => toast.error('Failed to generate share link'),
  });
};

export const useUnshareNote = (noteId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => shareService.unshareNote(noteId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.note(noteId) });
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note is now private');
    },
    onError: () => toast.error('Failed to revoke share link'),
  });
};

export const usePublicNote = (shareId) => {
  return useQuery({
    queryKey: ['shared-note', shareId],
    queryFn: () => shareService.getSharedNote(shareId).then(r => r.data),
    enabled: !!shareId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
