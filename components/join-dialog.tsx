// components/join-dialog.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";

export function JoinDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    setLoading(true);
    router.push(`/watch/${roomName}`);
  };

  const resetForm = () => {
    setRoomName("");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join existing stream</DialogTitle>
          <DialogDescription>
            Enter the room name to join a live stream
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room name</Label>
            <Input
              id="roomName"
              type="text"
              placeholder="abcd-1234"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && roomName && !loading) {
                  handleJoin();
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button disabled={!roomName || loading} onClick={handleJoin}>
            {loading ? (
              <>
                <Spinner />
                Joining...
              </>
            ) : (
              "Join"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
