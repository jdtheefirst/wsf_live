// components/stream-player.tsx
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
import { CopyIcon, EyeIcon, EyeClosedIcon } from "lucide-react";
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
    toast("Room link copied!");
  };

  return (
    <div className="relative h-full w-full bg-black">
      <div className="grid w-full h-full absolute gap-2 grid-cols-1 lg:grid-cols-2">
        {canHost && (
          <div className="relative bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {localParticipant.identity[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <video
              ref={localVideoEl}
              className="absolute inset-0 w-full h-full object-contain -scale-x-100 bg-transparent"
            />
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {localParticipant.identity} (you)
              </Badge>
            </div>
          </div>
        )}
        {remoteVideoTracks.map((t) => (
          <div
            key={t.participant.identity}
            className="relative bg-muted rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {t.participant.identity[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <VideoTrack
              trackRef={t}
              className="absolute inset-0 w-full h-full object-contain bg-transparent"
            />
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {t.participant.identity}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {remoteAudioTracks.map((t) => (
        <AudioTrack trackRef={t} key={t.participant.identity} />
      ))}

      <ConfettiCanvas />

      <StartAudio
        label="Click to allow audio playback"
        className="absolute top-0 h-full w-full bg-background/80 text-foreground flex items-center justify-center"
      />

      <div className="absolute top-0 w-full p-4">
        <div className="flex justify-between items-end">
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              size="sm"
              disabled={!roomName}
              onClick={handleCopyRoomLink}
              className="bg-background/80 backdrop-blur-sm"
            >
              {roomState === ConnectionState.Connected ? (
                <>
                  {roomName} <CopyIcon className="ml-2 h-3 w-3" />
                </>
              ) : (
                "Loading..."
              )}
            </Button>
            {roomName && canHost && (
              <div className="flex gap-2">
                <MediaDeviceSettings />
                {roomMetadata?.creator_identity !==
                  localParticipant.identity && (
                  <Button size="sm" onClick={onLeaveStage}>
                    Leave stage
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {roomState === ConnectionState.Connected && (
              <div className="flex gap-2 items-center bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white uppercase">
                  Live
                </span>
              </div>
            )}

            <PresenceDialog isHost={isHost}>
              <div className="relative">
                {showNotification && (
                  <div className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={roomState !== ConnectionState.Connected}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {roomState === ConnectionState.Connected ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeClosedIcon className="h-4 w-4" />
                  )}
                  {roomState === ConnectionState.Connected && (
                    <span className="ml-2">{participants.length}</span>
                  )}
                </Button>
              </div>
            </PresenceDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
