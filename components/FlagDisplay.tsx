import React from "react";
import Image from "next/image";
import { getCountryFlagUrl } from "@/lib/utils/image";

interface FlagDisplayProps {
  countryCode: string;
  countryName?: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ countryName, countryCode }) => {
  const isNepal = countryCode.trim().toLowerCase() === "np";
  const flagClass =
    "max-w-full min-h-[160px] max-h-[160px] h-[160px] sm:min-h-40 sm:max-h-40 sm:h-40 md:min-h-48 md:max-h-48 md:h-48 object-cover" +
    (isNepal
      ? " drop-shadow-[4px_4px_0_var(--foreground)]"
      : " rounded-none border-2 border-foreground shadow-retro");

  return (
    <div className="flex justify-center items-center rounded-none p-1 sm:p-2 h-[180px] sm:h-[180px] md:h-[220px]">
      <Image
        src={getCountryFlagUrl(countryCode)}
        alt={countryName ? `Flag of ${countryName}` : ""}
        className={flagClass}
        fetchPriority="high"
        preload={true}
        sizes="(max-width: 768px) 100vw, 400px"
        style={{
          width: "auto",
          height: "auto",
        }}
        width={300}
        height={200}
        loading="eager"
      />
    </div>
  );
};

export default FlagDisplay;
