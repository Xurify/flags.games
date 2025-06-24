import React from "react";

interface FlagDisplayProps {
  flag?: string;
  countryName: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ flag, countryName }) => {
  const isNepal = countryName.trim().toLowerCase() === "nepal";
  const flagClass = isNepal
    ? "max-w-full max-h-42 sm:max-h-36 object-contain"
    : "max-w-full max-h-42 sm:max-h-36 object-contain rounded-sm shadow-flag";

  return (
    <div className="bg-muted/80 dark:bg-transparent rounded-2xl p-12 flex justify-center items-center min-h-[160px] sm:min-h-[200px]">
      {flag ? (
        <img
          src={flag}
          alt={`Flag of ${countryName}`}
          className={flagClass}
          fetchPriority="high"
        />
      ) : (
        <div className="w-40 h-24 sm:w-48 sm:h-32 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default FlagDisplay;
