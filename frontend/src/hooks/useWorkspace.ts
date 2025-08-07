import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeWorkspace, createWorkspace, getWorkspace, listWorkspaces } from '../services/api.service';

export function useWorkspaces() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ['workspaces'], queryFn: listWorkspaces });
  const create = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workspaces'] }),
  });
  const analyze = useMutation({
    mutationFn: (id: string) => analyzeWorkspace(id),
  });
  return { list, create, analyze };
}

export function useWorkspaceDetail(id?: string) {
  return useQuery({ queryKey: ['workspace', id], queryFn: () => getWorkspace(id!), enabled: !!id });
}