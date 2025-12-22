import type { Metadata } from "next";
import FlagGameClient, { type InitialGameData } from "@/components/FlagGameClient";
import { generateQuestion, parseDifficultyFromQuery, parseModeFromQuery } from "@/lib/utils/gameLogic";

interface PlayProps {
  searchParams: Promise<{ difficulty?: string; mode?: string; t?: string }>;
}

export const metadata: Metadata = {
  title: "Play Game | flags.games",
  alternates: {
    canonical: "/play",
  },
};

export default async function PlayPage({ searchParams: _searchParams }: PlayProps) {
  const searchParams = await _searchParams;

  const difficulty = parseDifficultyFromQuery(searchParams?.difficulty);
  const { limitedLifeModeEnabled, timeAttackModeDurationSec } = parseModeFromQuery(searchParams?.mode, searchParams?.t);
  const initialGameData = generateQuestion(difficulty) as InitialGameData;

  return (
    <FlagGameClient
      initialGameData={initialGameData}
      initialLimitedLifeModeEnabled={limitedLifeModeEnabled}
      initialTimeAttackModeDurationSec={timeAttackModeDurationSec}
    />
  );
}
