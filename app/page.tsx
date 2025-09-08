import FlagGameClient, { type InitialGameData } from "@/components/FlagGameClient";
import { generateQuestion, parseDifficultyFromQuery } from "@/lib/utils/gameLogic";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ difficulty?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const difficulty = parseDifficultyFromQuery((await searchParams)?.difficulty);
  const initialGameData = generateQuestion(difficulty) as InitialGameData;
  return <FlagGameClient initialGameData={initialGameData} />;
}
