// app/page.tsx
"use client";

import { HomeActions } from "@/components/home-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Video, Award, Globe, Clock } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const year = new Date().getFullYear();
  const features = [
    {
      icon: <Video className="h-6 w-6" />,
      title: "Live Training Sessions",
      description:
        "Participate in real-time training with world-class Samma instructors",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Global Community",
      description: "Connect with Samma practitioners from around the world",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Belt Advancement",
      description:
        "Watch demonstrations and learn techniques for your next belt level",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Platform",
      description:
        "Private streaming for WSF members and certified instructors",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Worldwide Access",
      description: "Join from anywhere with an internet connection",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "On-Demand Replays",
      description: "Missed a session? Access recordings in your member portal",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 transition-all duration-300">
                <Image
                  src={"/favicon-32x32.png"}
                  height={32}
                  width={32}
                  alt="logo"
                  color="white"
                />
              </div>
              <div>
                <h1 className=" text-sm sm:text-xl font-bold text-white">
                  World Samma Federation
                </h1>
                <p className="text-sm text-purple-200">Live Training Portal</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400 border-green-500/30"
            >
              Live
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="bg-white/10 text-white border-white/20 px-4 py-1"
            >
              Official Streaming Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Samma <span className="text-purple-400">Live</span> Training
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join the global Samma community for live training sessions, belt
              demonstrations, and master classes from World Samma Federation
              certified instructors.
            </p>
          </div>

          {/* Main Actions */}
          <div className="py-8">
            <HomeActions />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-purple-200">
                Certified Instructors
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-purple-200">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-purple-200">Live Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-purple-200">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-white">
            Why Train With WSF Live?
          </h2>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Experience the future of martial arts training with our
            comprehensive live streaming platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-lg">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-purple-200">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-white">
            Upcoming Live Sessions
          </h2>
          <p className="text-purple-200">
            Join these upcoming training sessions and events
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Black Belt Techniques
              </CardTitle>
              <CardDescription className="text-purple-200">
                Master Chen - Today, 7:00 PM EST
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Join Session
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Beginner Forms</CardTitle>
              <CardDescription className="text-purple-200">
                Instructor Lee - Tomorrow, 6:00 PM EST
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-white/20">
                Set Reminder
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Weapons Training</CardTitle>
              <CardDescription className="text-purple-200">
                Master Rodriguez - Friday, 8:00 PM EST
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-white/20">
                Set Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 transition-all duration-300">
                <Image
                  src={"/favicon-16x16.png"}
                  height={16}
                  width={16}
                  alt="logo"
                  color="white"
                />
              </div>
              <div>
                <p className="text-white font-semibold">
                  World Samma Federation
                </p>
                <p className="text-purple-200 text-sm">Live Training Portal</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-purple-200 text-sm">
                © {year} World Samma Federation. All rights reserved.
              </p>
              <p className="text-purple-300 text-xs">
                Connecting martial artists worldwide through traditional Samma
                values
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
