// app/(stream)/host/page.client.tsx
"use client";

import { Chat } from "@/components/chat";
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
        <div className="w-full h-screen flex flex-col lg:flex-row bg-background overflow-hidden fixed inset-0">
          {/* Video Area */}
          <div className="flex-1 min-h-0 bg-black lg:border-r relative">
            <StreamPlayer isHost />
          </div>

          {/* Chat Area - Fixed height on mobile, auto on desktop */}
          <div className="flex-1 lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l bg-card flex flex-col h-[40vh] lg:h-auto">
            <Chat />
          </div>
        </div>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}
