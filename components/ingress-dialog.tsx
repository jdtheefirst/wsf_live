// components/ingress-dialog.tsx
"use client";

import { CreateIngressResponse } from "@/lib/controller";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AllowParticipationInfo } from "./allow-participation-info";
import { Spinner } from "./spinner";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function IngressDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("rtmp");
  const [enableChat, setEnableChat] = useState(true);
  const [allowParticipation, setAllowParticipation] = useState(true);
  const [ingressResponse, setIngressResponse] =
    useState<CreateIngressResponse>();
  const [error, setError] = useState<string | null>(null);

  const onCreateIngress = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create_ingress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: roomName,
          ingress_type: type,
          metadata: {
            creator_identity: name,
            enable_chat: enableChat,
            allow_participation: allowParticipation,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create ingress.");
      }

      const ingressResponse = await res.json();
      setIngressResponse(ingressResponse);
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
    setName("");
    setType("rtmp");
    setEnableChat(true);
    setAllowParticipation(true);
    setIngressResponse(undefined);
    setError(null);
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {ingressResponse ? (
          <>
            <DialogHeader>
              <DialogTitle>Start streaming now</DialogTitle>
              <DialogDescription>
                Copy these values into your OBS settings under{" "}
                <code className="bg-muted px-1 rounded">Stream</code> →{" "}
                <code className="bg-muted px-1 rounded">Service</code> →{" "}
                <code className="bg-muted px-1 rounded">
                  {type === "whip" ? "WHIP" : "Custom"}
                </code>
                . When you&rsquo;re ready, press &quot;Start Streaming&quot; and
                watch the bits flow!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serverUrl">Server URL</Label>
                <Input
                  id="serverUrl"
                  type="text"
                  value={ingressResponse.ingress.url}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamKey">Stream key</Label>
                <Input
                  id="streamKey"
                  type="text"
                  value={ingressResponse.ingress.streamKey}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() =>
                    router.push(
                      `/watch/${roomName}?at=${ingressResponse.auth_token}&rt=${ingressResponse.connection_details.token}`
                    )
                  }
                >
                  Join as viewer{" "}
                  <ArrowRightIcon className="ml-2 h-4 w-4 animate-bounce" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Setup ingress endpoint</DialogTitle>
              <DialogDescription>
                Configure your OBS streaming settings
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

              <div className="space-y-2">
                <Label htmlFor="roomName">Room name</Label>
                <Input
                  id="roomName"
                  type="text"
                  placeholder="abcd-1234"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Roger Dunn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Ingress type</Label>
                <RadioGroup
                  value={type}
                  onValueChange={setType}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rtmp" id="rtmp" />
                    <Label htmlFor="rtmp" className="cursor-pointer">
                      RTMP
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whip" id="whip" />
                    <Label htmlFor="whip" className="cursor-pointer">
                      WHIP
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enableChat" className="flex-1 cursor-pointer">
                    Enable chat
                  </Label>
                  <Switch
                    id="enableChat"
                    checked={enableChat}
                    onCheckedChange={setEnableChat}
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
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                disabled={!roomName || !name || !type || loading}
                onClick={onCreateIngress}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
