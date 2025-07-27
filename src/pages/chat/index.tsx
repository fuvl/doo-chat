import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../contexts/auth';
import { Button } from '../../components/button';
import { ChatInput } from '../../components/chat-input';
import { Message } from '../../components/message';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { Message as MessageType } from '../../types/message';

export function Chat() {
  const { username } = useAuth();
  const [chatState, setChatState] = useState({
    messages: [] as MessageType[],
    loading: true,
    lastMessageTime: null as string | null,
    firstMessageTime: null as string | null,
    hasMoreOlderMessages: true,
    loadingOlder: false,
  });
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const updateChatState = (
    type: 'initial' | 'older' | 'newer',
    data: MessageType[],
    hasMore?: boolean
  ) => {
    setChatState((prev) => {
      switch (type) {
        case 'initial':
          return {
            ...prev,
            messages: data,
            loading: false,
            lastMessageTime:
              data.length > 0 ? data[data.length - 1].createdAt : null,
            firstMessageTime: data.length > 0 ? data[0].createdAt : null,
            hasMoreOlderMessages: data.length === 50,
            loadingOlder: false,
          };
        case 'older':
          if (data.length > 0) {
            return {
              ...prev,
              messages: [...data, ...prev.messages],
              firstMessageTime: data[0].createdAt,
              hasMoreOlderMessages: hasMore ?? true,
              loadingOlder: false,
            };
          } else {
            return {
              ...prev,
              hasMoreOlderMessages: false,
              loadingOlder: false,
            };
          }
        case 'newer':
          if (data.length > 0) {
            return {
              ...prev,
              messages: [...prev.messages, ...data],
              lastMessageTime: data[data.length - 1].createdAt,
            };
          }
          return prev;
        default:
          return prev;
      }
    });
  };

  // Initial load
  useEffect(() => {
    fetchAllMessages();
  }, []);

  // Poll for new messages
  useEffect(() => {
    if (!chatState.loading && chatState.lastMessageTime) {
      const interval = setInterval(() => fetchNewMessages(), 2000);
      return () => clearInterval(interval);
    }
  }, [chatState.loading, chatState.lastMessageTime]);

  // Initial scroll to bottom when messages first load
  useEffect(() => {
    if (!chatState.loading && chatState.messages.length > 0) {
      scrollToBottom(false);
      // Focus the input for immediate typing
      inputRef.current?.focus();
    }
  }, [chatState.loading]);

  // Infinite scroll hook for loading older messages
  const { sentinelRef } = useInfiniteScroll<MessageType>({
    fetchData: () =>
      apiService.getMessages({
        before: chatState.firstMessageTime ?? undefined,
      }),
    hasMore: chatState.hasMoreOlderMessages,
    isLoading: chatState.loadingOlder,
    onLoadingStart: () => {
      setChatState((prev) => ({ ...prev, loadingOlder: true }));
    },
    onDataLoaded: (data, hasMore) => {
      updateChatState('older', data, hasMore);
    },
    onError: (error) => {
      console.error('Failed to fetch older messages:', error);
      toast.error('Failed to load older messages');
      setChatState((prev) => ({ ...prev, loadingOlder: false }));
    },
    enabled: !!chatState.firstMessageTime,
    containerRef: messagesContainerRef,
  });

  const fetchAllMessages = async () => {
    try {
      const data = await apiService.getMessages();
      updateChatState('initial', data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
      setChatState((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchNewMessages = async () => {
    if (!chatState.lastMessageTime) return;

    try {
      const data = await apiService.getMessages({
        after: chatState.lastMessageTime,
      });

      updateChatState('newer', data);
    } catch (error) {
      console.error('Failed to fetch new messages:', error);
      toast.error('Failed to fetch new messages');
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage || !username) return;

    try {
      await apiService.createMessage({
        message: trimmedMessage,
        author: username,
      });
      setNewMessage('');
      // Fetch new messages immediately after sending
      fetchNewMessages();
      // Scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div className="max-w-[640px] mx-auto px-6 py-6 space-y-4">
          <div ref={sentinelRef} className="h-1 w-full" />
          {chatState.loadingOlder && (
            <div className="flex justify-center py-2">
              <div className="flex items-center space-x-2 text-text-secondary text-sm">
                <div className="animate-spin h-4 w-4 border-2 border-text-secondary border-t-transparent rounded-full"></div>
                <span>Loading older messages...</span>
              </div>
            </div>
          )}
          {chatState.loading ? (
            <p className="text-text-secondary">Loading messages...</p>
          ) : chatState.messages.length === 0 ? (
            <p className="text-text-secondary">
              No messages yet. Start the conversation!
            </p>
          ) : (
            chatState.messages.map((message) => (
              <Message
                key={message._id}
                message={message}
                isOwn={message.author === username}
              />
            ))
          )}
        </div>
      </div>
      <div className="p-2 bg-bottom-bar" role="form" aria-label="Send message">
        <div className="max-w-[640px] mx-auto flex items-center space-x-2 sm:px-6">
          <ChatInput
            ref={inputRef}
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={() => handleSubmit()}
            placeholder="Message"
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!newMessage.trim()}
            className="flex-shrink-0"
            aria-label="Send message"
          >
            Send
          </Button>
        </div>
        <div id="message-help" className="sr-only">
          Press Enter to send, Shift+Enter for new line. Scroll to top to load
          older messages.
        </div>

        {/* Accessibility announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {chatState.loadingOlder && 'Loading older messages'}
          {!chatState.hasMoreOlderMessages &&
            chatState.messages.length > 0 &&
            'You have reached the beginning of the conversation'}
        </div>
      </div>
    </div>
  );
}
