import type { LayoutProps } from './layout.types';

export function Layout({ children }: LayoutProps) {
  return (
    <div className="max-w-[640px] mx-auto min-h-screen">
      {children}
    </div>
  );
}