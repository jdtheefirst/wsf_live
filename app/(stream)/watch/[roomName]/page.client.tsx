// app/(stream)/watch/[roomName]/page.client.tsx
"use client";

import { useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { Flex, Card, Heading, Button, Text, Box } from "@radix-ui/themes";
import { Spinner } from "@/components/spinner";
import { StreamPlayer } from "@/components/stream-player";
import { ReactionBar } from "@/components/reaction-bar";
import { Chat } from "@/components/chat";
import { TokenContext } from "@/components/token-context";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/AuthContext";

interface WatchPageProps {
  roomName: string;
  serverUrl: string;
}

export default function WatchPage({ roomName, serverUrl }: WatchPageProps) {
  const { profile } = useAuth();
  const [authToken, setAuthToken] = useState("");
  const [roomToken, setRoomToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onJoin = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const res = await fetch("/api/join_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: roomName,
          identity: profile.full_name,
        }),
      });

      if (!res.ok)
        throw new Error(
          "Unable to join stream. Invalid room or network issue."
        );

      const { auth_token, connection_details } = await res.json();
      setAuthToken(auth_token);
      setRoomToken(connection_details.token);
    } catch (err) {
      setError(
        "There was an issue joining the stream. Check your network or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Flex align="center" justify="center" className="min-h-screen">
        <Card className="p-4 w-[400px]">
          <Heading size="4">Error</Heading>
          <Text mt="2" mb={"4"} align={"center"}>
            {error}
          </Text>
        </Card>
      </Flex>
    );
  }

  if (!authToken || !roomToken) {
    return (
      <Flex align="center" justify="center" className="min-h-screen">
        <Card className="p-3 w-[380px]">
          <Heading size="4" className="mb-4">
            Entering {decodeURI(roomName)}
          </Heading>
          <Flex gap="3" mt="6" justify="end">
            <Button disabled={loading} onClick={onJoin}>
              {loading ? (
                <Flex gap="2" align="center">
                  <Spinner />
                  <Text>Joining...</Text>
                </Flex>
              ) : (
                <>
                  Join Stream <ArrowRightIcon />
                </>
              )}
            </Button>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <Flex className="w-full h-screen">
          <Flex direction="column" className="flex-1">
            <Box className="flex-1 bg-gray-1">
              <StreamPlayer />
            </Box>
            <ReactionBar />
          </Flex>
          <Box className="bg-accent-2 min-w-[280px] border-l border-accent-5">
            <Chat />
          </Box>
        </Flex>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}
