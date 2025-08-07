import { create } from 'zustand';

interface WorkspaceStore {
  selectedWorkspaceId?: string;
  setSelectedWorkspaceId: (id?: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  selectedWorkspaceId: undefined,
  setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
}));