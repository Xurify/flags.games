import React from "react";

interface FlagDisplayProps {
  flag?: string;
  countryName: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ flag, countryName }) => {
  const isNepal = true;
  const flagClass = "max-w-full min-h-36 max-h-36 h-36 object-contain" + (isNepal ? "" : " rounded-sm shadow-flag");

  if (!flag) return null;

  return (
    <div className="bg-muted/80 dark:bg-transparent rounded-2xl p-6 sm:p-12 flex justify-center items-center h-[192px] sm:h-[200px]">
      <img
        src={flag}
        alt={`Flag of ${countryName}`}
        className={flagClass}
        fetchPriority="high"
      />
    </div>
  );
};

export default FlagDisplay;
