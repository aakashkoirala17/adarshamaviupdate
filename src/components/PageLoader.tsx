import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-secondary/10">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-primary font-bold tracking-widest uppercase text-sm animate-pulse">Loading...</p>
    </div>
  );
};

export default PageLoader;
