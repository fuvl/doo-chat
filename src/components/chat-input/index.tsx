import { useEffect, forwardRef } from 'react';
import type { ChatInputProps } from './chat-input.types';

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    { value, onChange, onSubmit, placeholder = 'Message', disabled = false },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    useEffect(() => {
      const textarea = ref && 'current' in ref ? ref.current : null;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      }
    }, [value, ref]);

    return (
      <textarea
        ref={ref}
        placeholder={placeholder}
        className="flex-1 bg-white border-0 px-2 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent placeholder-text-secondary resize-none min-h-[48px] max-h-[120px] overflow-y-auto"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        aria-label="Type a message"
        aria-describedby="message-help"
        role="textbox"
        aria-multiline="true"
      />
    );
  }
);
