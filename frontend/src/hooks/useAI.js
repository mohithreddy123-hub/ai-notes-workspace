/**
 * AI Feature Hooks — React Query mutations for AI operations.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import aiService from '../services/aiService';
import toast from 'react-hot-toast';

// ── AI Mutations ─────────────────────────────────────────────────────────────

export const useGenerateSummary = (noteId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => aiService.generateSummary(noteId),
    onSuccess: (res) => {
      // Invalidate the note so ai_summary is fresh
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      toast.success('Summary generated!');
      return res.data;
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to generate summary.';
      toast.error(msg);
    },
  });
};

export const useExtractActionItems = (noteId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => aiService.extractActionItems(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      toast.success('Action items extracted!');
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to extract action items.';
      toast.error(msg);
    },
  });
};

export const useSuggestTitle = (noteId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => aiService.suggestTitle(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      toast.success('Title suggestion ready!');
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to suggest title.';
      toast.error(msg);
    },
  });
};

// ── AI History ────────────────────────────────────────────────────────────────

export const useAIHistory = () => {
  return useQuery({
    queryKey: ['ai-history'],
    queryFn: () => aiService.getHistory().then((r) => r.data),
    staleTime: 60 * 1000,
  });
};
