// components/home-actions.tsx
"use client";

import { BroadcastDialog } from "@/components/broadcast-dialog";
import { IngressDialog } from "@/components/ingress-dialog";
import { JoinDialog } from "@/components/join-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, Satellite, Users } from "lucide-react";

export function HomeActions() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Video className="h-5 w-5 text-green-400" />
              </div>
              <CardTitle className="text-white text-lg">
                Start Streaming
              </CardTitle>
            </div>
            <CardDescription className="text-purple-200">
              Go live directly from your browser - perfect for instructors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BroadcastDialog>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Stream from Browser
              </Button>
            </BroadcastDialog>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Satellite className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle className="text-white text-lg">
                Professional Setup
              </CardTitle>
            </div>
            <CardDescription className="text-purple-200">
              Use OBS or other streaming software for advanced production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IngressDialog>
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10"
              >
                Stream from OBS
              </Button>
            </IngressDialog>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle className="text-white text-lg">
                Join Training
              </CardTitle>
            </div>
            <CardDescription className="text-purple-200">
              Participate in live sessions as a student or observer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JoinDialog>
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10"
              >
                Join Existing Stream
              </Button>
            </JoinDialog>
          </CardContent>
        </Card>
      </div>

      {/* Divider with Text */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-900 px-4 text-sm text-purple-300">
            World Samma Federation Members
          </span>
        </div>
      </div>
    </div>
  );
}
