import React from "react";
import { Button } from "@/components/ui/button";
import { Country } from "@/lib/data/countries";
import { cn } from "@/lib/utils/strings";

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
  const getButtonStateClass = (country: Country) => {
    if (!showResult) {
      return "bg-background hover:bg-primary/5 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    }

    if (country.code === correctAnswer) {
      return "bg-green-500 text-white border-foreground shadow-none translate-y-[2px] translate-x-[2px] !opacity-100 !grayscale-0";
    }

    if (country.code === selectedAnswer && country.code !== correctAnswer) {
      return "bg-destructive text-white border-foreground shadow-none translate-y-[2px] translate-x-[2px] !opacity-100 !grayscale-0";
    }

    return "opacity-20 grayscale border-foreground/20 shadow-none translate-y-[2px] translate-x-[2px]";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {options.map((country, index) => (
        <Button
          key={`${country.code}-${index}`}
          onClick={() => !showResult && handleAnswer(country)}
          disabled={disabled}
          className={cn(
            "h-14 sm:h-16 sm:text-base border-2 sm:border-2 font-black justify-start px-3 sm:px-6 uppercase tracking-tight transition-all duration-100 rounded-none",
            getButtonStateClass(country)
          )}
          variant="outline"
        >
          <span className="truncate">{country.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
