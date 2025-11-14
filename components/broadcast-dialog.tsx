// components/broadcast-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/spinner";
import { AllowParticipationInfo } from "./allow-participation-info";
import { LoginDialog } from "./LoginDialog";
import { useAuth } from "@/context/AuthContext";

export function BroadcastDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [enableChat, setEnableChat] = useState(true);
  const [allowParticipation, setAllowParticipation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const onGoLive = async () => {
    if (!profile) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createRes = await fetch("/api/create_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_name: roomName,
          metadata: {
            creator_identity: profile.full_name,
            enable_chat: enableChat,
            allow_participation: allowParticipation,
          },
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create the stream.");
      }

      const {
        auth_token,
        connection_details: { token },
      } = await createRes.json();

      setOpen(false);
      router.push(`/host?&at=${auth_token}&rt=${token}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message ||
            "Failed to verify room existence. Please try again later."
        );
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRoomName("");
    setEnableChat(true);
    setAllowParticipation(true);
    setError(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new stream</DialogTitle>
            <DialogDescription>
              Set up your live stream room and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Card className="border-destructive bg-destructive/10">
                <CardContent className="p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {!profile && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-3">
                  <p className="text-sm text-yellow-800">
                    Please sign in to create a stream
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="roomName">Room name</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="abcd-1234"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={!profile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                type="text"
                readOnly
                value={profile?.full_name}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableChat" className="flex-1">
                  Enable chat
                </Label>
                <Switch
                  id="enableChat"
                  checked={enableChat}
                  onCheckedChange={setEnableChat}
                  disabled={!profile}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2 flex-1">
                  <Label
                    htmlFor="allowParticipation"
                    className="cursor-pointer"
                  >
                    Viewers can participate
                  </Label>
                  <AllowParticipationInfo />
                </div>
                <Switch
                  id="allowParticipation"
                  checked={allowParticipation}
                  onCheckedChange={setAllowParticipation}
                  disabled={!profile}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onGoLive}
              disabled={!roomName || loading || !profile}
            >
              {loading ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
}
