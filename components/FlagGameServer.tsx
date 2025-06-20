import { Country } from "@/lib/data/countries";
import { generateQuestion, getDifficultySettings } from "@/lib/utils/gameLogic";
import FlagGameClient from "./FlagGameClient";

export type Difficulty = "easy" | "medium" | "hard" | "expert";

interface InitialGameData {
  currentCountry: Country;
  options: Country[];
  difficulty: Difficulty;
  totalQuestions: number;
}

const generateInitialQuestion = (difficulty: Difficulty): InitialGameData => {
  const questionData = generateQuestion(difficulty) as InitialGameData;

  return {
    currentCountry: questionData.currentCountry,
    options: questionData.options,
    difficulty,
    totalQuestions: getDifficultySettings(difficulty).count,
  };
};

interface FlagGameServerProps {
  difficulty: Difficulty;
}

export default function FlagGameServer({ difficulty }: FlagGameServerProps) {
  const initialGameData = generateInitialQuestion(difficulty);
  return <FlagGameClient initialGameData={initialGameData} />;
}
