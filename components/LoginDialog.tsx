// components/auth/LoginDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LogIn, Users, Award, BookOpen, Star } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
}

export function LoginDialog({ open, onOpenChange, message }: LoginDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  const benefits = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "Track Progress",
      description: "Monitor your belt advancement and course completion",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Access Courses",
      description: "Unlock full video lessons and training materials",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Leadership Roles",
      description:
        "Apply for leadership positions within the World Samma Federation",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Join Community",
      description: "Connect with fellow Samma practitioners worldwide",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Join World Samma Federation
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {message ||
              "Sign in to access all member benefits and participate in our community"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Cards */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {benefit.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <p className="text-xs mt-1">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 text-base"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Your Account
            </Button>

            <div className="text-center">
              <p className="text-sm">
                New to Samma?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary font-semibold"
                  onClick={handleLogin}
                >
                  Create an account
                </Button>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-xs">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Alternative simpler version
export function SimpleLoginDialog({
  open,
  onOpenChange,
  message,
}: LoginDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center">
            {message || "Please sign in to continue"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={handleLogin} className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account? You'll be able to create one
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
