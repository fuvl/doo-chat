import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/auth";
import { Button } from "../../components/button";
import { ChatInput } from "../../components/chat-input";
import { Message } from "../../components/message";
import { apiService } from "../../services/api";
import type { Message as MessageType } from "../../types/message";

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
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
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

  // Handle scroll to top for loading older messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop === 0 &&
        chatState.firstMessageTime &&
        chatState.hasMoreOlderMessages
      ) {
        fetchOlderMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [chatState.firstMessageTime, chatState.hasMoreOlderMessages]);

  const fetchAllMessages = async () => {
    try {
      const data = await apiService.getMessages();
      // Sort messages by creation date (oldest first)
      const sortedMessages = data.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setChatState({
        messages: sortedMessages,
        loading: false,
        lastMessageTime:
          sortedMessages.length > 0
            ? sortedMessages[sortedMessages.length - 1].createdAt
            : null,
        firstMessageTime:
          sortedMessages.length > 0 ? sortedMessages[0].createdAt : null,
        hasMoreOlderMessages: sortedMessages.length === 50,
        loadingOlder: false,
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setChatState((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchNewMessages = async () => {
    if (!chatState.lastMessageTime) return;

    try {
      const data = await apiService.getMessages({
        after: chatState.lastMessageTime,
      });

      if (data.length > 0) {
        // Sort new messages
        const sortedNewMessages = data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, ...sortedNewMessages],
          lastMessageTime:
            sortedNewMessages[sortedNewMessages.length - 1].createdAt,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch new messages:", error);
    }
  };

  const fetchOlderMessages = async () => {
    if (!chatState.firstMessageTime) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    // Set loading state
    setChatState((prev) => ({ ...prev, loadingOlder: true }));

    // Save scroll height before adding older messages
    const previousScrollHeight = container.scrollHeight;

    try {
      const data = await apiService.getMessages({
        before: chatState.firstMessageTime,
      });

      if (data.length > 0) {
        // Sort older messages
        const sortedOlderMessages = data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setChatState((prev) => ({
          ...prev,
          messages: [...sortedOlderMessages, ...prev.messages],
          firstMessageTime: sortedOlderMessages[0].createdAt,
          loadingOlder: false,
        }));

        // Adjust scroll position to maintain current view
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - previousScrollHeight;
          container.scrollTop = container.scrollTop + heightDifference;
        });
      } else {
        // No more older messages available
        setChatState((prev) => ({
          ...prev,
          hasMoreOlderMessages: false,
          loadingOlder: false,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
      setChatState((prev) => ({ ...prev, loadingOlder: false }));
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
      setNewMessage("");
      // Fetch new messages immediately after sending
      fetchNewMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div className="max-w-[640px] mx-auto px-6 py-6 space-y-4">
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
          {chatState.loadingOlder && "Loading older messages"}
          {!chatState.hasMoreOlderMessages &&
            chatState.messages.length > 0 &&
            "You have reached the beginning of the conversation"}
        </div>
      </div>
    </div>
  );
}
