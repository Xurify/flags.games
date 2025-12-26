import type { Metadata } from "next";
import FlagDisplay from "../../components/FlagDisplay";
import { countries } from "../../lib/data/countries";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "All Flags | flags.games",
  description: "Browse the complete list of country flags available in the game.",
  alternates: {
    canonical: "/flags",
  },
};

const FlagsPage = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mt-4 mb-8 text-center">Flags</h1>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
            <div key={country.code} className="space-y-2">
              <div className="text-sm font-medium text-center">
                {country.name}
              </div>
              <FlagDisplay
                countryCode={country.code}
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
