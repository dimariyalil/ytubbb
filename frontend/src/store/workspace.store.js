import { create } from 'zustand';
export const useWorkspaceStore = create((set) => ({
    selectedWorkspaceId: undefined,
    setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
}));
