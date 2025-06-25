import React from "react";
import { Button } from "@/components/ui/button";
import { Country } from "@/lib/data/countries";

interface AnswerOptionsProps {
  options: Country[];
  showResult: boolean;
  handleAnswer: (country: Country) => void;
  selectedAnswer: string | null;
  getButtonClass: (country: Country) => string;
  disabled: boolean;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  showResult,
  handleAnswer,
  getButtonClass,
  disabled,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
    {options.map((country) => (
      <Button
        key={country.code}
        onClick={() => !showResult && handleAnswer(country)}
        disabled={disabled}
        className={`h-12 sm:h-14 text-sm sm:text-base font-medium justify-start px-4 sm:px-6 ${getButtonClass(
          country
        )}`}
        variant="outline"
      >
        {country.name}
      </Button>
    ))}
  </div>
);

export default AnswerOptions;
