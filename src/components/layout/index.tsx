import type { LayoutProps } from './layout.types';

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-[url('/src/assets/body-bg.webp')] bg-repeat bg-[length:800px]">
      {children}
    </div>
  );
}
