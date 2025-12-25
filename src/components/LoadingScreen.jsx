import { LoaderCircle } from "lucide-react";

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center text-text-dark-disabled">
    <LoaderCircle className="animate-spin text-main-secondary" size={32} />
    <span className="ml-3 text-lg font-medium text-text-dark-disabled">
      Loading...
    </span>
  </div>
);

export default LoadingScreen;
