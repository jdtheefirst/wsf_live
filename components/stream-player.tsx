// components/stream-player.tsx - Adjusted for side-by-side layout
"use client";

import { useCopyToClipboard } from "@/lib/clipboard";
import { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useDataChannel,
  useLocalParticipant,
  useMediaDeviceSelect,
  useParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import {
  CopyIcon,
  EyeIcon,
  EyeClosedIcon,
  Share2,
  Users,
  Maximize2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Confetti from "js-confetti";
import {
  ConnectionState,
  LocalVideoTrack,
  Track,
  createLocalTracks,
} from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { MediaDeviceSettings } from "./media-device-settings";
import { PresenceDialog } from "./presence-dialog";
import { useAuthToken } from "./token-context";
import { toast } from "sonner";

function ConfettiCanvas() {
  const [confetti, setConfetti] = useState<Confetti>();
  const [decoder] = useState(() => new TextDecoder());
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useDataChannel("reactions", (data) => {
    const options: { emojis?: string[]; confettiNumber?: number } = {};

    if (decoder.decode(data.payload) !== "🎉") {
      options.emojis = [decoder.decode(data.payload)];
      options.confettiNumber = 12;
    }

    confetti?.addConfetti(options);
  });

  useEffect(() => {
    setConfetti(new Confetti({ canvas: canvasEl?.current ?? undefined }));
  }, []);

  return (
    <canvas
      ref={canvasEl}
      className="absolute h-full w-full pointer-events-none"
    />
  );
}

function VideoTile({
  track,
  identity,
  isLocal = false,
}: {
  track: any;
  identity: string;
  isLocal?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (track && videoRef.current) {
      track.attach(videoRef.current);
    }
    return () => {
      if (track) {
        track.detach();
      }
    };
  }, [track]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden group aspect-video">
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Avatar className="h-12 w-12 md:h-16 md:w-16">
          <AvatarFallback className="text-sm md:text-lg bg-primary/20">
            {identity[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
      </div>

      {track && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          autoPlay
          muted={isLocal}
        />
      )}

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <Badge className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-xs truncate max-w-[70%]">
          {identity}
          {isLocal ? " (You)" : ""}
        </Badge>

        {isLocal && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
}

export function StreamPlayer({ isHost = false }) {
  const [_, copy] = useCopyToClipboard();

  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack>();
  const localVideoEl = useRef<HTMLVideoElement>(null);

  const { metadata, name: roomName, state: roomState } = useRoomContext();
  const roomMetadata = (metadata && JSON.parse(metadata)) as RoomMetadata;
  const { localParticipant } = useLocalParticipant();
  const localMetadata = (localParticipant.metadata &&
    JSON.parse(localParticipant.metadata)) as ParticipantMetadata;
  const canHost =
    isHost || (localMetadata?.invited_to_stage && localMetadata?.hand_raised);
  const participants = useParticipants();
  const showNotification = isHost
    ? participants.some((p) => {
        const metadata = (p.metadata &&
          JSON.parse(p.metadata)) as ParticipantMetadata;
        return metadata?.hand_raised && !metadata?.invited_to_stage;
      })
    : localMetadata?.invited_to_stage && !localMetadata?.hand_raised;

  useEffect(() => {
    if (canHost) {
      const createTracks = async () => {
        const tracks = await createLocalTracks({ audio: true, video: true });
        const camTrack = tracks.find((t) => t.kind === Track.Kind.Video);
        if (camTrack && localVideoEl?.current) {
          camTrack.attach(localVideoEl.current);
        }
        setLocalVideoTrack(camTrack as LocalVideoTrack);
      };
      void createTracks();
    }
  }, [canHost]);

  const { activeDeviceId: activeCameraDeviceId } = useMediaDeviceSelect({
    kind: "videoinput",
  });

  useEffect(() => {
    if (localVideoTrack) {
      void localVideoTrack.setDeviceId(activeCameraDeviceId);
    }
  }, [localVideoTrack, activeCameraDeviceId]);

  const remoteVideoTracks = useTracks([Track.Source.Camera]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const remoteAudioTracks = useTracks([Track.Source.Microphone]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const authToken = useAuthToken();
  const onLeaveStage = async () => {
    await fetch("/api/remove_from_stage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: localParticipant.identity,
      }),
    });
  };

  const handleCopyRoomLink = () => {
    const roomUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/watch/${roomName}`;
    copy(roomUrl);
    toast.success("Room link copied!");
  };

  const handleShareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${roomName} on Worldsamma`,
        text: `Watch ${roomName} live on Worldsamma`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/watch/${roomName}`,
      });
    } else {
      handleCopyRoomLink();
    }
  };

  // Responsive grid for side-by-side layout
  const getGridClass = () => {
    const totalTiles = canHost
      ? remoteVideoTracks.length + 1
      : remoteVideoTracks.length;

    if (totalTiles === 0) return "grid-cols-1";
    if (totalTiles === 1) return "grid-cols-1";
    if (totalTiles === 2) return "grid-cols-1 sm:grid-cols-2";
    if (totalTiles === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (totalTiles === 4)
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2";
    if (totalTiles <= 6) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    if (totalTiles <= 9)
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Main Video Grid */}
      <div
        className={`h-full grid ${getGridClass()} gap-2 sm:gap-3 p-2 sm:p-3 md:p-4`}
      >
        {canHost && (
          <VideoTile
            track={localVideoTrack}
            identity={localParticipant.identity}
            isLocal
          />
        )}

        {remoteVideoTracks.map((t) => (
          <VideoTile
            key={t.participant.identity}
            track={t}
            identity={t.participant.identity}
          />
        ))}

        {/* Empty state */}
        {!canHost && remoteVideoTracks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center col-span-full">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No one is streaming
            </h3>
            <p className="text-gray-400">Waiting for host to start...</p>
          </div>
        )}
      </div>

      {remoteAudioTracks.map((t) => (
        <AudioTrack trackRef={t} key={t.participant.identity} />
      ))}

      <ConfettiCanvas />

      <StartAudio
        label="Click to allow audio playback"
        className="absolute top-0 h-full w-full bg-background/90 text-foreground flex items-center justify-center backdrop-blur-sm"
      />

      {/* Top Controls Bar */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-background/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-semibold text-xs sm:text-sm text-white">
                LIVE
              </span>
            </div>

            <div className="flex-1 sm:flex-initial flex items-center gap-1 overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareRoom}
                className="h-7 sm:h-8 px-2 text-xs text-white hover:bg-white/20"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Share</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={!roomName}
                onClick={handleCopyRoomLink}
                className="h-7 sm:h-8 px-2 text-xs text-white hover:bg-white/20"
              >
                <CopyIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Copy</span>
              </Button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {canHost && (
              <>
                <div className="hidden sm:block">
                  <MediaDeviceSettings />
                </div>
                {roomMetadata?.creator_identity !==
                  localParticipant.identity && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onLeaveStage}
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                  >
                    <span className="hidden sm:inline">Leave Stage</span>
                    <span className="sm:hidden">Leave</span>
                  </Button>
                )}
              </>
            )}

            <PresenceDialog isHost={isHost}>
              <div className="relative">
                {showNotification && (
                  <div className="absolute -top-1 -right-1 flex h-2 w-2 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={roomState !== ConnectionState.Connected}
                  className="h-7 sm:h-8 px-2 sm:px-3 gap-1 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  {roomState === ConnectionState.Connected && (
                    <span className="font-medium">{participants.length}</span>
                  )}
                  <span className="hidden sm:inline text-white/70">
                    Viewers
                  </span>
                </Button>
              </div>
            </PresenceDialog>
          </div>
        </div>
      </div>

      {/* Mobile-only controls */}
      {canHost && (
        <div className="sm:hidden absolute bottom-2 left-2 right-2">
          <div className="flex justify-center gap-2">
            <MediaDeviceSettings />
          </div>
        </div>
      )}

      {/* Room Name */}
      {roomName && (
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10 max-w-[150px] sm:max-w-xs">
            <h3 className="font-semibold text-xs sm:text-sm text-white truncate">
              {roomName}
            </h3>
            <p className="text-xs text-gray-300">
              {canHost ? "You are hosting" : "You are watching"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
