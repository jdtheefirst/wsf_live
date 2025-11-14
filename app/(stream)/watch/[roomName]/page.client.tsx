// app/(stream)/watch/[roomName]/page.client.tsx
"use client";

import { useState, useEffect } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/spinner";
import { StreamPlayer } from "@/components/stream-player";
import { ReactionBar } from "@/components/reaction-bar";
import { Chat } from "@/components/chat";
import { TokenContext } from "@/components/token-context";
import { ArrowRightIcon, Users, Video, Shield, Globe } from "lucide-react";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/context/AuthContext";

interface WatchPageProps {
  roomName: string;
  serverUrl: string;
}

interface StreamInfo {
  title?: string;
  description?: string;
  instructor?: string;
  participants?: number;
  isLive?: boolean;
}

export default function WatchPage({ roomName, serverUrl }: WatchPageProps) {
  const { profile, loading: authLoading } = useAuth();
  const [authToken, setAuthToken] = useState("");
  const [roomToken, setRoomToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);

  useEffect(() => {
    // Fetch stream information
    const fetchStreamInfo = async () => {
      try {
        const res = await fetch(`/api/streams/${roomName}`);
        if (res.ok) {
          const data = await res.json();
          setStreamInfo(data);
        }
      } catch (err) {
        console.error("Failed to fetch stream info:", err);
      }
    };

    fetchStreamInfo();
  }, [roomName]);

  const onJoin = async () => {
    if (!profile) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/join_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: roomName,
          identity:
            profile?.full_name || profile.email?.split("@")[0] || "Viewer",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Unable to join stream.");
      }

      const { auth_token, connection_details } = await res.json();
      setAuthToken(auth_token);
      setRoomToken(connection_details.token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "There was an issue joining the stream. Check your network or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Auto-join after successful login
    setTimeout(() => onJoin(), 500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <Spinner />
          <p className="text-purple-200">Loading stream...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="w-[400px] bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-white">Unable to Join Stream</CardTitle>
            <CardDescription className="text-purple-200">
              There was a problem accessing this stream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-purple-200 mb-6">{error}</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
              variant="outline"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authToken || !roomToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    World Samma Federation
                  </h1>
                  <p className="text-sm text-purple-200">Live Training</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-400 border-green-500/30"
              >
                Live Stream
              </Badge>
            </div>
          </div>
        </header>

        {/* Stream Join Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-4 py-1"
              >
                Ready to Join
              </Badge>
              <h1 className="text-4xl font-bold text-white">
                {streamInfo?.title || decodeURI(roomName)}
              </h1>
              <p className="text-xl text-purple-100">
                {streamInfo?.description ||
                  "Join this World Samma Federation training session"}
              </p>

              {streamInfo?.instructor && (
                <div className="flex items-center justify-center gap-2 text-purple-200">
                  <Users className="h-4 w-4" />
                  <span>Instructor: {streamInfo.instructor}</span>
                </div>
              )}
            </div>

            {/* Join Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Join Live Session</CardTitle>
                <CardDescription className="text-purple-200">
                  {profile
                    ? "Ready to join the training session"
                    : "Sign in to join this World Samma Federation stream"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stream Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Globe className="h-4 w-4 text-primary mx-auto mb-1" />
                    <div className="text-white font-medium">Live</div>
                    <div className="text-purple-200 text-xs">Real-time</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Users className="h-4 w-4 text-primary mx-auto mb-1" />
                    <div className="text-white font-medium">Interactive</div>
                    <div className="text-purple-200 text-xs">
                      Chat & Reactions
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  onClick={onJoin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 h-12 text-base"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Joining Session...
                    </>
                  ) : profile ? (
                    <>
                      Join Training Session
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    "Sign In to Join"
                  )}
                </Button>

                {!profile && (
                  <div className="text-center">
                    <p className="text-sm text-purple-300">
                      World Samma Federation members can join live training
                      sessions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-4">
                  <Video className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-white">
                    Live Demonstration
                  </h3>
                  <p className="text-sm text-purple-200">
                    Watch techniques in real-time
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-4">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Interactive Q&A</h3>
                  <p className="text-sm text-purple-200">Ask questions live</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-4">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Secure Platform</h3>
                  <p className="text-sm text-purple-200">Members-only access</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Login Dialog */}
        <LoginDialog
          open={showLogin}
          onOpenChange={setShowLogin}
          message="Sign in to your World Samma Federation account to join this live training session"
        />
      </div>
    );
  }

  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <div className="w-full h-screen flex bg-background">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black">
              <StreamPlayer />
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
