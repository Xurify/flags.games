import React from "react";
import Image from "next/image";
import { getCountryFlagUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils/strings";

interface FlagDisplayProps {
  countryCode: string;
  countryName?: string;
  colorOffset?: boolean;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ countryName, countryCode, colorOffset = true }) => {
  const isNepal = countryCode.trim().toLowerCase() === "np";
  const flagClass = "max-w-full min-h-36 max-h-36 h-36 object-cover" + (isNepal ? "" : " rounded border");

  return (
    <div className={cn("flex justify-center items-center rounded dark:bg-transparent p-2 h-[192px] sm:h-[200px]", colorOffset ? `bg-muted/70 dark:bg-transparent ${colorOffset}` : "")}>
      <Image
        src={getCountryFlagUrl(countryCode)}
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
