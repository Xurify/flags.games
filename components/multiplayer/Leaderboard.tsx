"use client";

import React from "react";
import { CrownIcon, CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GameStateLeaderboard, User } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";

interface LeaderboardProps {
  members: User[];
  leaderboard: GameStateLeaderboard[];
  currentUser: User | null;
  hostId: string;
  isGameActive: boolean;
  variant?: "sidebar" | "inline";
}

export default function Leaderboard({
  members,
  leaderboard,
  currentUser,
  hostId,
  isGameActive,
  variant = "sidebar",
}: LeaderboardProps) {
  const previousOrderRef = React.useRef<string[]>([]);
  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const positionsRef = React.useRef<Record<string, number>>({});

  const scoreByUserId = React.useMemo(() => {
    const map: Record<string, number> = {};
    leaderboard.forEach((entry) => {
      map[entry.userId] = entry.score;
    });
    return map;
  }, [leaderboard]);

  const sortedMembers = [...members].sort((a, b) => {
    const aScore = scoreByUserId[a.id] ?? 0;
    const bScore = scoreByUserId[b.id] ?? 0;
    if (bScore !== aScore) {
      return bScore - aScore;
    }
    return a.username.localeCompare(b.username);
  });

  const currentOrder = sortedMembers.map((member) => member.id);

  React.useEffect(() => {
    previousOrderRef.current = currentOrder;
  }, [leaderboard.map((user) => `${user.userId}:${user.score}`).join("|")]);

  // Determine rank delta per user
  const rankDelta: Record<string, number> = {};
  previousOrderRef.current.forEach((id, prevIndex) => {
    const newIndex = currentOrder.indexOf(id);
    if (newIndex !== -1) {
      rankDelta[id] = prevIndex - newIndex; // positive -> moved up
    }
  });

  // FLIP: animate vertical movement on re-rank
  React.useLayoutEffect(() => {
    const newPositions: Record<string, number> = {};
    sortedMembers.forEach((m) => {
      const element = rowRefs.current[m.id];
      if (element) newPositions[m.id] = element.getBoundingClientRect().top;
    });
    // Apply transforms from previous to new
    requestAnimationFrame(() => {
      sortedMembers.forEach((m) => {
        const element = rowRefs.current[m.id];
        if (!element) return;
        const prevTop = positionsRef.current[m.id];
        const newTop = newPositions[m.id];
        if (prevTop === undefined || newTop === undefined) return;
        const deltaY = prevTop - newTop;
        if (Math.abs(deltaY) < 1) return;
        element.style.transform = `translateY(${deltaY}px) scale(0.98)`;
        element.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
        element.style.willChange = "transform";
        // next frame: reset transform to animate to natural position
        requestAnimationFrame(() => {
          element.style.transform = "";
        });
        const handleEnd = () => {
          element.style.transition = "";
          element.style.willChange = "";
          element.removeEventListener("transitionend", handleEnd);
        };
        element.addEventListener("transitionend", handleEnd);
      });
      positionsRef.current = newPositions;
    });
    // Capture initial positions
    if (Object.keys(positionsRef.current).length === 0) {
      positionsRef.current = newPositions;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedMembers.map((member) => `${member.id}:${scoreByUserId[member.id] ?? 0}`).join("|")]);

  return (
    <div
      className={cn(
        variant === "sidebar" && "hidden lg:block w-64",
        variant === "inline" && "w-full lg:w-64 lg:border-l lg:border-border/50 lg:pl-4"
      )}
    >
      <div className={cn("px-3 py-2 flex items-center justify-between", variant === "inline" && "px-0 pb-2")}> 
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Leaderboard</div>
        <Badge size="sm" variant={isGameActive ? "success" : "outline"}>
          {isGameActive ? "Live" : "Waiting"}
        </Badge>
      </div>

      <div className={cn("max-h-[500px] overflow-y-auto divide-y divide-border/50", variant === "inline" && "max-h-none")}> 
        {sortedMembers.map((member, index) => {
          const isCurrentUser = currentUser?.id === member.id;
          const isHost = member.id === hostId;
          const hasAnswered = isGameActive && member.currentAnswer !== undefined;

          const delta = rankDelta[member.id] ?? 0;
          const movementClass = delta > 0 ? "animate-rank-up" : delta < 0 ? "animate-rank-down" : "";

          return (
            <div
              key={member.id}
              className={cn(
                "grid grid-cols-[2ch_1fr_auto] items-center gap-3 px-3 py-2",
                isCurrentUser && "[&>*:nth-child(2)>span:first-child]:font-semibold",
                variant === "inline" && "px-0"
              )}
              ref={(element) => {
                rowRefs.current[member.id] = element;
              }}
            >
              <div className={cn("text-xs tabular-nums text-muted-foreground", movementClass)}>
                {index + 1}
              </div>
              <div className={cn("min-w-0 flex items-center gap-1", movementClass)}>
                <span className={cn("truncate", isCurrentUser ? "font-semibold" : "font-medium")}>{member.username}</span>
                {isHost && <CrownIcon className="w-3.5 h-3.5 text-chart-5" />}
                {hasAnswered && <CheckIcon className="w-3.5 h-3.5 text-chart-2" />}
                {isCurrentUser && (
                  <span className="text-[11px] font-semibold text-primary">(You)</span>
                )}
              </div>
              <div className={cn("text-xs font-semibold tabular-nums text-foreground", movementClass)}>
                {scoreByUserId[member.id] ?? 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
