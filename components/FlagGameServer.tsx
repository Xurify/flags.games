import { Country } from "@/lib/data/countries";
import { generateQuestion, getDifficultySettings } from "@/lib/utils/gameLogic";
import FlagGameClient from "./FlagGameClient";

interface InitialGameData {
  currentCountry: Country;
  options: Country[];
  difficulty: "easy" | "medium" | "hard" | "expert";
  totalQuestions: number;
}

const generateInitialQuestion = (difficulty: "easy" | "medium" | "hard" | "expert" = "easy"): InitialGameData => {
  const questionData = generateQuestion(difficulty) as InitialGameData;

  return {
    currentCountry: questionData.currentCountry,
    options: questionData.options,
    difficulty,
    totalQuestions: getDifficultySettings(difficulty).count,
  };
};

export default function FlagGameServer() {
  const initialGameData = generateInitialQuestion();
  
  return <FlagGameClient initialGameData={initialGameData} />;
}
