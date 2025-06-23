import React from "react";
import { Heart } from "lucide-react";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  enabled: boolean;
}

const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
  hearts,
  maxHearts,
  enabled,
}) => {
  if (!enabled) return null;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }, (_, index) => (
        <Heart
          key={index}
          className={`w-5 h-5 ${
            index < hearts
              ? "text-red-500 fill-red-500"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

export default HeartsDisplay; 