import React from "react";
import { Button } from "@/components/ui/button";
import { Country } from "@/lib/data/countries";

interface AnswerOptionsProps {
  options: Country[];
  showResult: boolean;
  handleAnswer: (country: Country) => void;
  selectedAnswer: string | null;
  disabled: boolean;
  correctAnswer: string;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  showResult,
  handleAnswer,
  selectedAnswer,
  disabled,
  correctAnswer,
}) => {
  const getButtonClass = (country: Country) => {
    if (!showResult) {
      return "border-border hover:border-primary/50 hover:bg-primary/5 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10 transition-all duration-200";
    }

    if (country.code === correctAnswer) {
      return "bg-green-100 border-green-500 text-green-700 dark:bg-green-700/40 dark:border-green-500 dark:text-white dark:shadow-lg hover:text-green-700 focus:text-green-700 dark:hover:text-white dark:focus:text-white disabled:bg-green-100 disabled:text-green-700 disabled:dark:bg-green-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    if (country.code === selectedAnswer && country.code !== correctAnswer) {
      return "bg-red-50 border-red-400 text-red-700 dark:bg-red-700/40 dark:border-red-500 dark:text-white dark:shadow-lg hover:text-red-700 focus:text-red-700 dark:hover:text-white dark:focus:text-white disabled:bg-red-50 disabled:text-red-700 disabled:dark:bg-red-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    return "!opacity-40 border-border/50 !grayscale-0";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
      {options.map((country, index) => (
        <Button
          key={`${country.code}-${index}`}
          onClick={() => !showResult && handleAnswer(country)}
          disabled={disabled}
          className={`h-12 sm:h-14 text-sm sm:text-base rounded-xl font-medium justify-start px-4 sm:px-6 ${getButtonClass(
            country
          )}`}
          variant="outline"
        >
          {country.name}
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
