// components/chat.tsx - FIXED FOR LARGE DEVICES
"use client";

import { RoomMetadata } from "@/lib/controller";
import {
  ReceivedChatMessage,
  useChat,
  useLocalParticipant,
  useRoomInfo,
} from "@livekit/components-react";
import { CircleUser, Send, MessageSquare } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmojiPickerComponent } from "./emoji-picker";

function ChatMessage({ message }: { message: ReceivedChatMessage }) {
  const { localParticipant } = useLocalParticipant();

  return (
    <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 hover:bg-muted/30 transition-colors rounded-lg">
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
        <AvatarFallback className="text-xs sm:text-sm bg-primary/10">
          {message.from?.identity[0]?.toUpperCase() || (
            <CircleUser className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
          <span
            className={cn(
              "text-xs sm:text-sm font-semibold truncate",
              localParticipant.identity === message.from?.identity
                ? "text-primary"
                : "text-foreground"
            )}
          >
            {message.from?.identity ?? "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-foreground break-words">
          {message.message}
        </p>
      </div>
    </div>
  );
}

export function Chat() {
  const [draft, setDraft] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { chatMessages, send } = useChat();
  const { metadata } = useRoomInfo();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { enable_chat: chatEnabled } = (
    metadata ? JSON.parse(metadata) : {}
  ) as RoomMetadata;

  // Deduplicate messages
  const messages = useMemo(() => {
    const seen = new Set();
    return chatMessages.filter((msg: any) => {
      const key = `${msg.timestamp}-${msg.from?.identity}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [chatMessages]);

  // Auto-scroll to bottom when new messages come in if we're at bottom
  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const onSend = async () => {
    if (draft.trim().length && send) {
      const messageToSend = draft;
      setDraft("");
      await send(messageToSend);
      setIsAtBottom(true);
    }
  };

  // Handle emoji insertion
  const handleEmojiSelect = (emoji: string) => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = draft.substring(0, start) + emoji + draft.substring(end);

    setDraft(newText);

    // Focus back and set cursor after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
      setIsAtBottom(isBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {" "}
      {/* Add min-h-0 here */}
      {/* Chat Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-3 border-b bg-card">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            Live Chat
          </h2>
          {messages.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!chatEnabled && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Chat disabled
            </span>
          )}
          {!isAtBottom && messages.length > 5 && (
            <Button
              size="sm"
              variant="outline"
              onClick={scrollToBottom}
              className="text-xs h-7"
            >
              Scroll to bottom
            </Button>
          )}
        </div>
      </div>
      {/* Messages Area - Add min-h-0 and proper flex */}
      <div
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 min-h-[200px]">
            <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg: any) => (
              <ChatMessage
                message={msg}
                key={`${msg.timestamp}-${msg.from?.identity}`}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Input Area - Fixed height */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t bg-card">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              disabled={!chatEnabled}
              placeholder={
                chatEnabled ? "Type your message..." : "Chat is disabled"
              }
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-10 text-sm sm:text-base"
            />
            <div className="absolute top-2 right-1 sm:right-3 bottom-3 flex items-center">
              <EmojiPickerComponent
                onEmojiSelect={handleEmojiSelect}
                disabled={!chatEnabled}
              />
            </div>
          </div>
          <Button
            onClick={onSend}
            disabled={!draft.trim().length || !chatEnabled}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}
