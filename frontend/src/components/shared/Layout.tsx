import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>;
}