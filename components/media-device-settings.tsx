// components/media-device-settings.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  useLocalParticipant,
  useMediaDeviceSelect,
  useRoomContext,
} from "@livekit/components-react";
import { ChevronDownIcon } from "lucide-react";
import { ConnectionState } from "livekit-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MediaDeviceSettings() {
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  const { state: roomState } = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      void localParticipant.setMicrophoneEnabled(micEnabled);
      void localParticipant.setCameraEnabled(camEnabled);
    }
  }, [micEnabled, camEnabled, localParticipant, roomState]);

  const {
    devices: microphoneDevices,
    activeDeviceId: activeMicrophoneDeviceId,
    setActiveMediaDevice: setActiveMicrophoneDevice,
  } = useMediaDeviceSelect({
    kind: "audioinput",
  });

  const {
    devices: cameraDevices,
    activeDeviceId: activeCameraDeviceId,
    setActiveMediaDevice: setActiveCameraDevice,
  } = useMediaDeviceSelect({
    kind: "videoinput",
  });

  return (
    <div className="flex gap-1">
      {/* Microphone Controls */}
      <div className="flex">
        <Button
          variant={micEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setMicEnabled(!micEnabled)}
          className="rounded-r-none"
        >
          Mic {micEnabled ? "On" : "Off"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!micEnabled}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-l-none border-l-0"
            >
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {microphoneDevices.map((d) => (
              <DropdownMenuItem
                key={d.deviceId}
                onClick={() => setActiveMicrophoneDevice(d.deviceId)}
                className={cn(
                  d.deviceId === activeMicrophoneDeviceId &&
                    "text-primary font-semibold"
                )}
              >
                {d.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Camera Controls */}
      <div className="flex">
        <Button
          variant={camEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setCamEnabled(!camEnabled)}
          className="rounded-r-none"
        >
          Cam {camEnabled ? "On" : "Off"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!camEnabled}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-l-none border-l-0"
            >
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {cameraDevices.map((d) => (
              <DropdownMenuItem
                key={d.deviceId}
                onClick={() => setActiveCameraDevice(d.deviceId)}
                className={cn(
                  d.deviceId === activeCameraDeviceId &&
                    "text-primary font-semibold"
                )}
              >
                {d.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
