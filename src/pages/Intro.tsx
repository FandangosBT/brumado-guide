import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Intro = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";
  const [isVisible, setIsVisible] = useState(false);

  const handleNavigate = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => navigate(from, { replace: true }), 800);
  }, [navigate, from]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => handleNavigate();
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [handleNavigate]);

  return (
    <div className={`fixed inset-0 bg-black transition-opacity duration-[800ms] ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="/future.mp4"
        autoPlay
        muted
        playsInline
        onCanPlay={() => setIsVisible(true)}
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
