import React from "react";
import Image from "next/image";
import { getCountryFlagUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils/strings";

interface FlagDisplayProps {
  countryCode: string;
  countryName?: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ countryName, countryCode }) => {
  const isNepal = countryCode.trim().toLowerCase() === "np";
  const flagClass = "max-w-full min-h-[110px] max-h-[110px] h-[110px] sm:min-h-36 sm:max-h-36 sm:h-36 md:min-h-40 md:max-h-40 md:h-40 object-cover" + (isNepal ? "" : " rounded border shadow-retro");

  return (
    <div className="flex justify-center items-center rounded p-1 sm:p-2 h-[130px] sm:h-[160px] md:h-[200px]">
      <Image
        src={getCountryFlagUrl(countryCode)}
        alt={countryName ? `Flag of ${countryName}` : ""}
        className={flagClass}
        fetchPriority="high"
        priority={true}
        sizes="(max-width: 768px) 100vw, 400px"
        style={{
          width: 'auto',
          height: 'auto',
        }}
        width={300}
        height={200}
        loading="eager"
      />
    </div>
  );
};

export default FlagDisplay;
