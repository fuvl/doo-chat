import type { MessageProps } from "./message.types";

export function Message({ message, isOwn }: MessageProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`
            max-w-[240px] sm:max-w-[420px] rounded-md p-4 border border-border
            ${isOwn ? "bg-message-own" : "bg-message-other"}
            shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus
          `}
        role="article"
        aria-label={`Message from ${message.author}`}
        tabIndex={0}
      >
        <div className="text-text-secondary text-sm mb-1">{message.author}</div>
        <div className="text-text-primary mb-2 break-words">
          {message.message}
        </div>
        <div className="text-text-secondary text-xs">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
