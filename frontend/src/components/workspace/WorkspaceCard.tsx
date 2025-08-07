import { PropsWithChildren } from 'react';

export default function WorkspaceCard({ children }: PropsWithChildren) {
  return (
    <div className="border border-neutral-800 rounded p-4 bg-neutral-900/40">
      {children}
    </div>
  );
}