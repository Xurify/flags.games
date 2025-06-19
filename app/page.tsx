import FlagGameServer from "@/components/FlagGameServer";
import { parseDifficultyFromQuery } from "@/lib/utils/gameLogic";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const difficulty = parseDifficultyFromQuery((await searchParams)?.difficulty);
  return <FlagGameServer difficulty={difficulty} />;
}
