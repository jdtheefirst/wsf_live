// components/shareable-links.tsx
"use client";

import {
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "next-share";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { toast } from "sonner";

type ShareableLinksProps = {
  event: {
    roomName: string;
    description?: string;
    location?: string;
    startTime: string;
    endTime: string;
  };
};

const ShareableLinks: React.FC<ShareableLinksProps> = ({ event }) => {
  const { roomName, description, startTime, endTime } = event;

  const url = `https://live.worldsamma.org/watch/${encodeURIComponent(
    roomName
  )}`;

  // Professional title and hashtags for WSF
  const title = `World Samma Federation Live Stream: ${roomName}`;
  const hashtags = ["WorldSamma", "MartialArts", "LiveStream", "WSF", "Samma"];

  const shareMessage = `${title}

${
  description ? `${description}\n\n` : ""
}Join us live for this World Samma Federation event!

📅 ${new Date(startTime).toLocaleDateString()}
⏰ ${new Date(startTime).toLocaleTimeString()}

Watch here: ${url}

#${hashtags.join(" #")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    toast("Copied to clipboard!");
  };

  const shareButtons = [
    {
      component: WhatsappShareButton,
      icon: WhatsappIcon,
      label: "Share on WhatsApp",
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    {
      component: FacebookShareButton,
      icon: FacebookIcon,
      label: "Share on Facebook",
      className: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      component: TwitterShareButton,
      icon: TwitterIcon,
      label: "Share on Twitter",
      className: "bg-blue-400 hover:bg-blue-500 text-white",
    },
    {
      component: LinkedinShareButton,
      icon: LinkedinIcon,
      label: "Share on LinkedIn",
      className: "bg-blue-700 hover:bg-blue-800 text-white",
    },
  ];

  return (
    <div className="flex gap-3 justify-center items-center bg-muted/50 h-14 px-4">
      {shareButtons.map(
        ({ component: ShareButton, icon: Icon, label, className }) => (
          <ShareButton
            key={label}
            url={url}
            title={shareMessage}
            separator=" :: "
          >
            <Button
              size="icon"
              className={`h-10 w-10 rounded-full ${className}`}
              aria-label={label}
            >
              <Icon size={18} />
            </Button>
          </ShareButton>
        )
      )}

      <Button
        size="icon"
        className="h-10 w-10 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
        onClick={handleCopy}
        aria-label="Copy event details"
      >
        <Link size={18} />
      </Button>
    </div>
  );
};

export default ShareableLinks;
