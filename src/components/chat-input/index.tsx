import { useEffect, useRef } from "react";
import type { ChatInputProps } from "./chat-input.types";

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Message",
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      className="flex-1 bg-white border-0 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent placeholder-text-secondary resize-none min-h-[48px] max-h-[120px] overflow-y-auto"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      rows={1}
    />
  );
}
