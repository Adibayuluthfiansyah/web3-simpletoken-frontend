"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/80 group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:!border-green-500/20 group-[.toaster]:!bg-green-950/30 group-[.toaster]:text-green-400",
          error:
            "group-[.toaster]:!border-red-500/20 group-[.toaster]:!bg-red-950/30 group-[.toaster]:text-red-400",
          warning:
            "group-[.toaster]:!border-yellow-500/20 group-[.toaster]:!bg-yellow-950/30 group-[.toaster]:text-yellow-400",
          info: "group-[.toaster]:!border-blue-500/20 group-[.toaster]:!bg-blue-950/30 group-[.toaster]:text-blue-400",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
        loading: (
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
