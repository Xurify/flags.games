import React from "react";
import Image from "next/image";

interface FlagDisplayProps {
  flag?: string;
  countryName: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ flag, countryName }) => {
  const isNepal = countryName.trim().toLowerCase() === "nepal";
  const flagClass = "max-w-full min-h-36 max-h-36 h-36 object-cover" + (isNepal ? "" : " rounded-sm shadow-flag");

  if (!flag) return null;

  return (
    <div className="bg-muted/80 dark:bg-transparent rounded-2xl p-6 sm:p-12 flex justify-center items-center h-[192px] sm:h-[200px]">
      <Image
        src={flag}
        alt={`Flag of ${countryName}`}
        className={flagClass}
        fetchPriority="high"
        sizes="100vw"
        style={{
          width: 'auto',
          height: 'auto',
        }}
        width={200}
        height={200}
      />
    </div>
  );
};

export default FlagDisplay;
