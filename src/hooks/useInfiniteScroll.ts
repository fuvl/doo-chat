import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchData: () => Promise<T[]>;
  hasMore: boolean;
  isLoading: boolean;
  onDataLoaded: (data: T[], hasMore: boolean) => void;
  onLoadingStart: () => void;
  onError: (error: Error) => void;
  enabled?: boolean;
  containerRef: RefObject<HTMLElement | null>;
}

interface UseInfiniteScrollReturn {
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll<T>({
  fetchData,
  hasMore,
  isLoading,
  onDataLoaded,
  onLoadingStart,
  onError,
  enabled = true,
  containerRef,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container || !enabled) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoading
        ) {
          try {
            // Set loading state
            onLoadingStart();

            // Save more precise scroll position info
            const previousScrollHeight = container.scrollHeight;
            const previousScrollTop = container.scrollTop;
            const scrollFromBottom =
              previousScrollHeight - previousScrollTop - container.clientHeight;

            const data = await fetchData();

            const hasMoreData = data.length === 50; // Assuming 50 is the page size
            onDataLoaded(data, hasMoreData);

            // Restore scroll position more accurately for fast scrolling
            if (data.length > 0) {
              requestAnimationFrame(() => {
                const newScrollHeight = container.scrollHeight;
                // Calculate new scroll position to maintain distance from bottom
                const newScrollTop =
                  newScrollHeight - scrollFromBottom - container.clientHeight;
                container.scrollTop = Math.max(0, newScrollTop);
              });
            }
          } catch (error) {
            onError(error as Error);
          }
        }
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    fetchData,
    hasMore,
    isLoading,
    onDataLoaded,
    onLoadingStart,
    onError,
    enabled,
    containerRef,
  ]);

  return {
    sentinelRef,
  };
}