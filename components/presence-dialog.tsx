// components/presence-dialog.tsx
"use client";

import { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { XIcon, UserIcon } from "lucide-react";
import { Participant } from "livekit-client";
import { useAuthToken } from "./token-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ParticipantListItem({
  participant,
  isCurrentUser,
  isHost = false,
}: {
  participant: Participant;
  isCurrentUser: boolean;
  isHost?: boolean;
}) {
  const authToken = useAuthToken();
  const participantMetadata = (participant.metadata &&
    JSON.parse(participant.metadata)) as ParticipantMetadata;
  const room = useRoomContext();
  const roomMetadata = (room.metadata &&
    JSON.parse(room.metadata)) as RoomMetadata;

  const onInvite = async () => {
    await fetch("/api/invite_to_stage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: participant.identity,
      }),
    });
  };

  const onRaiseHand = async () => {
    await fetch("/api/raise_hand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
    });
  };

  const onCancel = async () => {
    await fetch("/api/remove_from_stage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: participant.identity,
      }),
    });
  };

  function HostActions() {
    if (!isCurrentUser) {
      if (
        participantMetadata.invited_to_stage &&
        participantMetadata.hand_raised
      ) {
        return (
          <Button size="sm" variant="outline" onClick={onCancel}>
            Remove
          </Button>
        );
      } else if (participantMetadata.hand_raised) {
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={onInvite}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Reject
            </Button>
          </div>
        );
      } else if (participantMetadata.invited_to_stage) {
        return (
          <Button size="sm" variant="outline" disabled>
            Pending
          </Button>
        );
      } else if (!participantMetadata.invited_to_stage) {
        return (
          <Button size="sm" onClick={onInvite}>
            Invite to stage
          </Button>
        );
      }
    }
    return null;
  }

  function ViewerActions() {
    if (isCurrentUser) {
      if (
        participantMetadata.invited_to_stage &&
        participantMetadata.hand_raised
      ) {
        return (
          <Button size="sm" onClick={onCancel}>
            Leave stage
          </Button>
        );
      } else if (
        participantMetadata.invited_to_stage &&
        !participantMetadata.hand_raised
      ) {
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={onRaiseHand}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Reject
            </Button>
          </div>
        );
      } else if (
        !participantMetadata.invited_to_stage &&
        participantMetadata.hand_raised
      ) {
        return (
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        );
      } else if (
        !participantMetadata.invited_to_stage &&
        !participantMetadata.hand_raised
      ) {
        return (
          <Button size="sm" onClick={onRaiseHand}>
            Raise hand
          </Button>
        );
      }
    }
    return null;
  }

  return (
    <div
      key={participant.sid}
      className="flex justify-between items-center py-2"
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">
            {participant.identity[0]?.toUpperCase() || (
              <UserIcon className="h-3 w-3" />
            )}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "text-sm",
            isCurrentUser && "text-primary font-semibold"
          )}
        >
          {participant.identity}
          {isCurrentUser && " (you)"}
        </span>
      </div>
      {isHost && roomMetadata.allow_participation ? (
        <HostActions />
      ) : (
        <ViewerActions />
      )}
    </div>
  );
}

export function PresenceDialog({
  children,
  isHost = false,
}: {
  children: React.ReactNode;
  isHost?: boolean;
}) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const hosts = participants.filter(
    (participant) => participant.permissions?.canPublish ?? false
  );
  const viewers = participants.filter(
    (participant) => !participant.permissions?.canPublish
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Who&rsquo;s here
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <XIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {hosts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wide">
                {hosts.length > 1 ? "Co-Hosts" : "Host"}
              </h4>
              <div className="space-y-1">
                {hosts.map((participant) => (
                  <ParticipantListItem
                    key={participant.identity}
                    participant={participant}
                    isCurrentUser={
                      participant.identity === localParticipant.identity
                    }
                    isHost={isHost}
                  />
                ))}
              </div>
            </div>
          )}

          {viewers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wide">
                Viewers
              </h4>
              <div className="space-y-1">
                {viewers.map((participant) => (
                  <ParticipantListItem
                    key={participant.identity}
                    participant={participant}
                    isCurrentUser={
                      participant.identity === localParticipant.identity
                    }
                    isHost={isHost}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
