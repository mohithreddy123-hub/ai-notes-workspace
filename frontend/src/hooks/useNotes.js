import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService, tagsService } from '../services/notesService';
import toast from 'react-hot-toast';

// ── Query Keys ─────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  notes: (params) => ['notes', params],
  note: (id) => ['note', id],
  tags: ['tags'],
};

// ── Notes Hooks ────────────────────────────────────────────────────────────

export const useNotes = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.notes(params),
    queryFn: () => notesService.list(params).then(r => r.data.results || r.data),
    staleTime: 30 * 1000,
  });
};

export const useNote = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.note(id),
    queryFn: () => notesService.get(id).then(r => r.data),
    enabled: !!id,
    staleTime: 10 * 1000,
  });
};

export const useCreateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => notesService.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => notesService.update(id, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.note(id) });
    },
  });
};

export const useDeleteNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
  });
};

export const usePinNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notesService.pin(id).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
};

export const useArchiveNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notesService.archive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note archived');
    },
  });
};

export const useRestoreNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notesService.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note restored');
    },
  });
};

// ── Tags Hooks ─────────────────────────────────────────────────────────────

export const useTags = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tags,
    queryFn: () => tagsService.list().then(r => r.data.results || r.data),
    staleTime: 60 * 1000,
  });
};

export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tagsService.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.tags });
      toast.success('Tag created');
    },
    onError: (err) => {
      toast.error(err.response?.data?.name?.[0] || 'Failed to create tag');
    },
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => tagsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.tags });
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Tag deleted');
    },
  });
};
