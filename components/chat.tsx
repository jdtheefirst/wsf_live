// components/chat.tsx
"use client";

import { RoomMetadata } from "@/lib/controller";
import {
  ReceivedChatMessage,
  useChat,
  useLocalParticipant,
  useRoomInfo,
} from "@livekit/components-react";
import { CircleUser, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function ChatMessage({ message }: { message: ReceivedChatMessage }) {
  const { localParticipant } = useLocalParticipant();

  return (
    <div className="flex gap-2 items-start break-words w-full max-w-[220px]">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">
          {message.from?.identity[0]?.toUpperCase() || (
            <CircleUser className="h-3 w-3" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={cn(
            "text-xs font-semibold",
            localParticipant.identity === message.from?.identity
              ? "text-primary"
              : "text-gray-600"
          )}
        >
          {message.from?.identity ?? "Unknown"}
        </span>
        <span className="text-xs text-gray-900 break-words">
          {message.message}
        </span>
      </div>
    </div>
  );
}

export function Chat() {
  const [draft, setDraft] = useState("");
  const { chatMessages, send } = useChat();
  const { metadata } = useRoomInfo();

  const { enable_chat: chatEnabled } = (
    metadata ? JSON.parse(metadata) : {}
  ) as RoomMetadata;

  // HACK: why do we get duplicate messages?
  const messages = useMemo(() => {
    const timestamps = chatMessages.map((msg: any) => msg.timestamp);
    const filtered = chatMessages.filter(
      (msg: any, i: number) => !timestamps.includes(msg.timestamp, i + 1)
    );

    return filtered;
  }, [chatMessages]);

  const onSend = async () => {
    if (draft.trim().length && send) {
      setDraft("");
      await send(draft);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Card className="h-full flex flex-col border-l rounded-none">
      <CardHeader className="p-3 border-b">
        <CardTitle className="text-sm font-mono text-primary text-center">
          Live Chat
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {messages.map((msg: any) => (
            <ChatMessage message={msg} key={msg.timestamp} />
          ))}
        </div>
      </ScrollArea>

      <CardContent className="p-3 border-t mt-auto">
        <div className="flex gap-2 items-center">
          <Input
            disabled={!chatEnabled}
            placeholder={chatEnabled ? "Say something..." : "Chat is disabled"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 text-sm"
          />
          <Button
            onClick={onSend}
            disabled={!draft.trim().length || !chatEnabled}
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
