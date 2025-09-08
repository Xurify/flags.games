import React from "react";
import Image from "next/image";

interface FlagDisplayProps {
  countryCode: string;
  countryName?: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ countryName, countryCode }) => {
  const isNepal = countryCode.trim().toLowerCase() === "np";
  const flagClass = "max-w-full min-h-36 max-h-36 h-36 object-cover" + (isNepal ? "" : " rounded border");

  return (
    <div className="bg-muted/70 dark:bg-transparent p-6 sm:p-10 flex justify-center items-center h-[192px] sm:h-[200px]">
      <Image
        src={`/images/flags/${countryCode.toLowerCase()}.svg`}
        alt={countryName ? `Flag of ${countryName}` : ""}
        className={flagClass}
        fetchPriority="high"
        priority={true}
        sizes="100vw"
        style={{
          width: 'auto',
          height: 'auto',
        }}
        width={200}
        height={200}
        loading="eager"
      />
    </div>
  );
};

export default FlagDisplay;
