// app/(stream)/host/page.client.tsx
"use client";

import { Chat } from "@/components/chat";
import { ReactionBar } from "@/components/reaction-bar";
import { StreamPlayer } from "@/components/stream-player";
import { TokenContext } from "@/components/token-context";
import { LiveKitRoom } from "@livekit/components-react";

export default function HostPage({
  authToken,
  roomToken,
  serverUrl,
}: {
  authToken: string;
  roomToken: string;
  serverUrl: string;
}) {
  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <div className="w-full h-screen flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-muted">
              <StreamPlayer isHost />
            </div>
            <ReactionBar />
          </div>
          <div className="min-w-[280px] border-l bg-card hidden sm:block">
            <Chat />
          </div>
        </div>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}
