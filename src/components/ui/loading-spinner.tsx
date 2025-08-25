import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size]
      )} 
      role="status" 
      aria-label="Carregando..."
      >
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}

export const LoadingOverlay = ({ isLoading, children, text = "Carregando..." }: LoadingOverlayProps) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground font-medium">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
};