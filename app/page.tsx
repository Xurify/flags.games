import FlagGameClient, { type InitialGameData } from "@/components/FlagGameClient";
import { generateQuestion, parseDifficultyFromQuery, parseModeFromQuery } from "@/lib/utils/gameLogic";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ difficulty?: string; mode?: string; t?: string }>;
}

export default async function Home({ searchParams: _searchParams }: HomeProps) {
  const searchParams = await _searchParams;
  const difficulty = parseDifficultyFromQuery(searchParams?.difficulty);
  const { limitedLifeModeEnabled, speedRoundModeDurationSec } = parseModeFromQuery(searchParams?.mode, searchParams?.t);
  const initialGameData = generateQuestion(difficulty) as InitialGameData;
  return (
    <FlagGameClient
      initialGameData={initialGameData}
      initialLimitedLifeModeEnabled={limitedLifeModeEnabled}
      initialSpeedRoundModeDurationSec={speedRoundModeDurationSec}
    />
  );
}
