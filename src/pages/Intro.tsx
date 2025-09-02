import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Intro = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";
  const [isVisible, setIsVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/windmilll.mp4");

  const handleNavigate = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => navigate(from, { replace: true }), 800);
  }, [navigate, from]);

  const hasNavigatedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const safeNavigate = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    handleNavigate();
  }, [handleNavigate]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onEnded = () => safeNavigate();
    const onPlay = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        try { v.pause(); } catch { /* noop */ }
        safeNavigate();
      }, 7000);
    };

    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [safeNavigate]);

  return (
    <div className={`fixed inset-0 bg-black transition-opacity duration-[800ms] ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onCanPlay={() => setIsVisible(true)}
        onError={() => setVideoSrc("/auto-future.mp4")}
      />
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <Button
          variant="outline"
          className="bg-black/50 text-white border-white/30 hover:bg-black/60"
          onClick={handleNavigate}
        >
          Pular Intro
        </Button>
      </div>
    </div>
  );
};

export default Intro;
