import type { MessageProps } from './message.types';

export function Message({ message, isOwn }: MessageProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full">
      <div
        className={`
          max-w-[400px] rounded-lg shadow-md p-4
          ${isOwn ? 'bg-message-own' : 'bg-message-other'}
        `}
      >
        <div className="text-text-secondary text-sm mb-1">
          {message.author}
        </div>
        <div className="text-text-primary mb-2">
          {message.message}
        </div>
        <div className="text-text-secondary text-xs">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}