import React from "react";
import Timer from "@/components/Timer";
import { GamePhase } from "@/lib/types/socket";
import HeartsDisplay from "./HeartsDisplay";
import { CORRECT_POINT_COST } from "@/lib/constants";

interface QuestionProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  showScorePopup: boolean;
  hearts?: number;
  maxHearts?: number;
  limitedLifeModeEnabled?: boolean;
  speedRoundModeEnabled?: boolean;
  speedRoundTimeSec?: number;
  currentPhase?: GamePhase;
  onTimeUp?: () => void;
  startTimeMs?: number;
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentQuestion,
  totalQuestions,
  score,
  showScorePopup,
  hearts,
  maxHearts,
  limitedLifeModeEnabled,
  speedRoundModeEnabled,
  speedRoundTimeSec,
  currentPhase,
  onTimeUp,
  startTimeMs,
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
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-score-popup">
            <span className="text-green-600 font-bold text-lg">
              +{CORRECT_POINT_COST}
            </span>
          </div>
        )}
      </div>
      {limitedLifeModeEnabled && hearts !== undefined && maxHearts !== undefined && (
        <>
          <div className="w-px h-4 bg-border"></div>
          <HeartsDisplay
            hearts={hearts}
            maxHearts={maxHearts}
            enabled={limitedLifeModeEnabled}
          />
        </>
      )}
      {speedRoundModeEnabled &&
        speedRoundTimeSec !== undefined &&
        currentPhase !== undefined && (
          <>
            <div className="w-px h-4 bg-border"></div>
            <Timer
              timePerQuestion={speedRoundTimeSec}
              questionIndex={currentQuestion}
              currentPhase={currentPhase}
              onTimeUp={onTimeUp}
              startTimeMs={startTimeMs}
            />
          </>
        )}
    </div>
  </div>
);

export default QuestionProgress;
