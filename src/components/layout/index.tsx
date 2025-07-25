import type { LayoutProps } from "./layout.types";

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[url('/src/assets/body-bg.webp')] bg-repeat bg-[length:800px]">
      {children}
    </div>
  );
}
