import React from "react";
import FlagDisplay from "../../components/FlagDisplay";
import { countries } from "../../lib/data/countries";

const FlagsPage = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.map((country) => (
            <div key={country.code} className="space-y-2">
              <div className="text-sm font-medium text-center">
                {country.name}
              </div>
              <FlagDisplay
                flag={`/images/flags/${country.code.toLowerCase()}.svg`}
                countryName={country.name}
              />
              <div className="text-xs text-muted-foreground text-center">
                Code: {country.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagsPage;
