import React from "react";
import { useAuth } from "@/hooks/use-auth";

const BackgroundVideo: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) return null;

  return (
    <video
      className="fixed inset-0 w-full h-full object-cover -z-10 opacity-20 pointer-events-none motion-reduce:hidden"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      src="/auto-future.mp4"
      aria-hidden="true"
    />
  );
};

export default BackgroundVideo;
