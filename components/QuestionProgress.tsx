import React from "react";
import HeartsDisplay from "./HeartsDisplay";

interface QuestionProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  showScorePopup: boolean;
  CORRECT_POINT_COST: number;
  hearts?: number;
  maxHearts?: number;
  heartsModeEnabled?: boolean;
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentQuestion,
  totalQuestions,
  score,
  showScorePopup,
  CORRECT_POINT_COST,
  hearts,
  maxHearts,
  heartsModeEnabled,
}) => (
  <div className="flex justify-center items-center">
    <div className="relative flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>
      <div className="w-px h-4 bg-border"></div>
      <div className="relative">
        <span className="text-sm font-medium text-muted-foreground">
          Score: {score}
        </span>
        {showScorePopup && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-score-popup">
            <span className="text-green-600 font-bold text-lg">
              +{CORRECT_POINT_COST}
            </span>
          </div>
        )}
      </div>
      {heartsModeEnabled && hearts !== undefined && maxHearts !== undefined && (
        <>
          <div className="w-px h-4 bg-border"></div>
          <HeartsDisplay
            hearts={hearts}
            maxHearts={maxHearts}
            enabled={heartsModeEnabled}
          />
        </>
      )}
    </div>
  </div>
);

export default QuestionProgress;
