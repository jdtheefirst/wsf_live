// components/suggestion-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
} from "lucide-react";
import { programLevels, getCurrentProgram } from "@/lib/programs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface SuggestionData {
  beltLevel: number;
  programSlug: string;
  topicTitle: string;
  topicDescription: string;
}

export function SuggestionDialog() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestionData>({
    beltLevel: profile?.belt_level || 0,
    programSlug: getCurrentProgram(profile?.belt_level || 0).slug,
    topicTitle: "",
    topicDescription: "",
  });

  const steps = [
    {
      title: "Your Belt Level",
      description: "Select your current belt level for context",
    },
    {
      title: "Topic Details",
      description: "What would you like to see presented live?",
    },
    {
      title: "Review & Submit",
      description: "Review your suggestion before submitting",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBeltLevelChange = (level: number) => {
    const program = getCurrentProgram(level);
    setSuggestion((prev) => ({
      ...prev,
      beltLevel: level,
      programSlug: program.slug,
    }));
  };

  const handleSubmit = async () => {
    if (!profile) {
      toast.error("Authentication Required", {
        description: "Please sign in to submit suggestions",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          belt_level: suggestion.beltLevel,
          program_slug: suggestion.programSlug,
          topic_title: suggestion.topicTitle,
          topic_description: suggestion.topicDescription,
          country_code: profile.country_code,
          county_code: profile.county_code,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit suggestion");
      }

      toast.success("Suggestion Submitted!", {
        description:
          "Thank you for your input. Our instructors will review it.",
      });

      setOpen(false);
      setCurrentStep(0);
      setSuggestion({
        beltLevel: profile.belt_level || 0,
        programSlug: getCurrentProgram(profile.belt_level || 0).slug,
        topicTitle: "",
        topicDescription: "",
      });
    } catch (error) {
      toast.error("Submission Failed", {
        description:
          "There was an error submitting your suggestion. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Select Your Belt Level</h3>
              <p className="text-muted-foreground">
                This helps our instructors understand which techniques to focus
                on
              </p>
            </div>

            <div className="grid gap-4">
              {programLevels.map((program, index) => (
                <Card
                  key={program.slug}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    suggestion.beltLevel === index
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => handleBeltLevelChange(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{program.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.belt_range}
                        </p>
                      </div>
                      {suggestion.beltLevel === index && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Topic Details</h3>
              <p className="text-muted-foreground">
                What specific technique or topic would you like to see
                demonstrated?
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topicTitle">Topic Title</Label>
                <Input
                  id="topicTitle"
                  placeholder="e.g., Advanced Blocking Techniques"
                  value={suggestion.topicTitle}
                  onChange={(e) =>
                    setSuggestion((prev) => ({
                      ...prev,
                      topicTitle: e.target.value,
                    }))
                  }
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {suggestion.topicTitle.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topicDescription">Detailed Description</Label>
                <Textarea
                  id="topicDescription"
                  placeholder="Describe what you'd like to learn about this topic, any specific challenges you're facing, or questions you have..."
                  value={suggestion.topicDescription}
                  onChange={(e) =>
                    setSuggestion((prev) => ({
                      ...prev,
                      topicDescription: e.target.value,
                    }))
                  }
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {suggestion.topicDescription.length}/500 characters
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Review Your Suggestion</h3>
              <p className="text-muted-foreground">
                Please review your suggestion before submitting
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggestion Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Belt Level:</span>
                    <p>{programLevels[suggestion.beltLevel]?.title}</p>
                  </div>
                  <div>
                    <span className="font-medium">Belt Range:</span>
                    <p>{programLevels[suggestion.beltLevel]?.belt_range}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Topic:</span>
                    <p className="mt-1">{suggestion.topicTitle}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-muted-foreground">
                      {suggestion.topicDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[96vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            FROM THE SAMMA MARTIAL ART BOOK
          </DialogTitle>
          <DialogDescription className="text-center">
            Suggest a topic to be presented live
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && suggestion.beltLevel === undefined) ||
                (currentStep === 1 &&
                  (!suggestion.topicTitle.trim() ||
                    !suggestion.topicDescription.trim()))
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Suggestion
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
