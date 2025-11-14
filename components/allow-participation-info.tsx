// components/allow-participation-info.tsx
"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AllowParticipationInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <Info className="h-3 w-3" />
            <span className="sr-only">
              Learn more about panel background options
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs p-3">
          <p className="text-xs">
            If enabled, viewers can <strong>raise their hand</strong>. When
            accepted by the host, they can share their audio and video. The host
            can also <strong>invite</strong> viewers to share their audio and
            video.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
