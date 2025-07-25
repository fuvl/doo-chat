import type { LayoutProps } from './layout.types';

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[url('/src/assets/body-bg.png')] bg-repeat">
      {children}
    </div>
  );
}