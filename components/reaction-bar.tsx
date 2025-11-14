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
    { emoji: "🔥", label: "Fire" },
    { emoji: "👏", label: "Applause" },
    { emoji: "🤣", label: "LOL" },
    { emoji: "❤️", label: "Love" },
    { emoji: "🎉", label: "Confetti" },
  ];

  return (
    <TooltipProvider>
      <div className="flex gap-2 justify-center items-center border-t bg-muted/50 h-14">
        {reactions.map((reaction) => (
          <Tooltip key={reaction.emoji} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onSend(reaction.emoji)}
                className="text-xl h-12 w-12 p-0 hover:scale-110 transition-transform"
              >
                {reaction.emoji}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{reaction.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
