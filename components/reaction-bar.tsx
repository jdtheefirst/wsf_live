// components/reaction-bar.tsx
"use client";

import { useChat, useDataChannel } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Smile } from "lucide-react";

export function ReactionBar() {
  const [encoder] = useState(() => new TextEncoder());
  const { send } = useDataChannel("reactions");
  const { send: sendChat } = useChat();

  const onSend = (emoji: string) => {
    send(encoder.encode(emoji), { reliable: false });
    if (sendChat) {
      sendChat(emoji);
    }
  };

  const reactions = [
    { emoji: "🔥", label: "Fire", color: "hover:bg-orange-100" },
    { emoji: "👏", label: "Applause", color: "hover:bg-yellow-100" },
    { emoji: "🤣", label: "LOL", color: "hover:bg-green-100" },
    { emoji: "❤️", label: "Love", color: "hover:bg-red-100" },
    { emoji: "🎉", label: "Confetti", color: "hover:bg-purple-100" },
    { emoji: "👍", label: "Like", color: "hover:bg-blue-100" },
    { emoji: "🙌", label: "Celebrate", color: "hover:bg-pink-100" },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between px-2 sm:px-6 h-full">
        <div className="flex items-center gap-1">
          <Smile className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="text-sm font-medium text-muted-foreground">
            Quick Reactions
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {reactions.map((reaction) => (
            <Tooltip key={reaction.emoji} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => onSend(reaction.emoji)}
                  className={`text-2xl h-12 w-12 p-0 hover:scale-110 transition-all duration-200 ${reaction.color}`}
                >
                  {reaction.emoji}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">{reaction.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">Click to react</div>
      </div>
    </TooltipProvider>
  );
}
