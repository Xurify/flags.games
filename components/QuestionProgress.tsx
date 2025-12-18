import React from "react";
import Timer from "@/components/Timer";
import { GamePhase } from "@/lib/types/socket";
import HeartsDisplay from "./HeartsDisplay";
import { CORRECT_POINT_COST } from "@/lib/constants";

interface QuestionProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  hearts?: number;
  maxHearts?: number;
  limitedLifeModeEnabled?: boolean;
  timeAttackModeEnabled?: boolean;
  timeAttackTimeSec?: number;
  currentPhase?: GamePhase;
  onTimeUp?: () => void;
  startTimeMs?: number;
  minimal?: boolean;
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentQuestion,
  totalQuestions,
  score,
  hearts,
  maxHearts,
  limitedLifeModeEnabled,
  timeAttackModeEnabled,
  timeAttackTimeSec,
  currentPhase,
  onTimeUp,
  startTimeMs,
}) => (
  <div className="flex justify-center items-center">
    <div className="relative flex items-center gap-4">

      {limitedLifeModeEnabled && hearts !== undefined && maxHearts !== undefined && (
        <div className="flex items-center gap-4">
          <HeartsDisplay
            hearts={hearts}
            maxHearts={maxHearts}
            enabled={limitedLifeModeEnabled}
          />
        </div>
      )}

      {timeAttackModeEnabled &&
        timeAttackTimeSec !== undefined &&
        currentPhase !== undefined && (
          <div className="flex items-center gap-4">
            <Timer
              timePerQuestion={timeAttackTimeSec}
              questionIndex={currentQuestion}
              currentPhase={currentPhase}
              onTimeUp={onTimeUp}
              startTimeMs={startTimeMs}
            />
          </div>
        )}
    </div>
  </div>
);

export default QuestionProgress;
