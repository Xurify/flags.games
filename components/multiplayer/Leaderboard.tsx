"use client";

import React from "react";
import { CrownIcon, CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GameStateLeaderboard, RoomMember, User, GameAnswer } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";

interface LeaderboardProps {
  members: RoomMember[];
  leaderboard: GameStateLeaderboard[];
  answers: GameAnswer[];
  currentUser: User | null;
  hostId: string;
  isGameActive: boolean;
  variant?: "sidebar" | "inline";
}

export default function Leaderboard({
  members,
  leaderboard,
  answers,
  currentUser,
  hostId,
  isGameActive,
  variant = "sidebar",
}: LeaderboardProps) {
  const previousOrderRef = React.useRef<string[]>([]);
  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const positionsRef = React.useRef<Record<string, number>>({});
  const highlightTimeoutsRef = React.useRef<Map<string, number>>(new Map());

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
    // Stable tie-breaker: preserve previous visual order when scores are equal
    const prevOrder = previousOrderRef.current;
    const aPrevIndex = prevOrder.indexOf(a.id);
    const bPrevIndex = prevOrder.indexOf(b.id);
    if (aPrevIndex !== -1 && bPrevIndex !== -1 && aPrevIndex !== bPrevIndex) {
      return aPrevIndex - bPrevIndex;
    }
    // Fallback to username for deterministic order if previous order unknown
    return a.username.localeCompare(b.username);
  });

  const currentOrder = sortedMembers.map((member) => member.id);

  // Track previous order so we can compute stable ties and FLIP deltas
  React.useEffect(() => {
    previousOrderRef.current = currentOrder;
  }, [currentOrder.join("|")]);

  // We use FLIP pixel delta to derive movement direction; no rank delta map needed

  // FLIP: animate vertical movement on re-rank
  React.useLayoutEffect(() => {
    highlightTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    highlightTimeoutsRef.current.clear();
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
        // Deterministic highlight on the overlay
        const overlay = element.querySelector<HTMLDivElement>('div[data-role="highlight"]');
        if (overlay) {
          const movedUp = deltaY < 0 ? false : true; // prevTop - newTop; positive means moved up
          // Pull colors from app theme variables for consistency
          const rootVars = getComputedStyle(document.documentElement);
          const upColor = (rootVars.getPropertyValue('--success') || '').trim() || 'oklch(0.65 0.18 140)';
          const downColor = (rootVars.getPropertyValue('--destructive') || '').trim() || 'oklch(0.62 0.21 25)';
          const existing = highlightTimeoutsRef.current.get(m.id);
          if (existing) {
            window.clearTimeout(existing);
            highlightTimeoutsRef.current.delete(m.id);
          }
          overlay.style.backgroundColor = movedUp ? upColor : downColor;
          overlay.style.transition = 'opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)';
          overlay.style.opacity = movedUp ? '0.08' : '0.06';
          overlay.style.borderRadius = '0px';
          const timeoutId = window.setTimeout(() => {
            overlay.style.opacity = '0';
            highlightTimeoutsRef.current.delete(m.id);
          }, 1200);
          highlightTimeoutsRef.current.set(m.id, timeoutId);
        }
        // Invert
        element.style.transition = "transform 0s";
        element.style.transform = `translateY(${deltaY}px)`;
        // Force reflow so the browser picks up the starting transform
        void element.offsetHeight;
        // Play
        element.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
        element.style.transform = "translateY(0)";
        element.style.willChange = "transform";
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
          const hasAnswered = isGameActive && member.hasAnswered === true;

          return (
            <div
              key={member.id}
              className={cn(
                "relative overflow-hidden rounded-none grid grid-cols-[2ch_1fr_auto] items-center gap-3 px-3 py-2 h-[41px] max-h-[41px]",
                isCurrentUser && "[&>*:nth-child(2)>span:first-child]:font-semibold",
                variant === "inline" && "px-0"
              )}
              ref={(element) => {
                rowRefs.current[member.id] = element;
              }}
            >
              <div data-role="highlight" className={cn("absolute inset-0 pointer-events-none z-0 rounded-none")} />
              <div className={cn("text-xs tabular-nums text-muted-foreground z-10")}>
                {index + 1}
              </div>
              <div className={cn("min-w-0 flex items-center gap-1 z-10")}>
                <span className={cn("truncate", isCurrentUser ? "font-semibold" : "font-medium")}>{member.username}</span>
                {isHost && <CrownIcon className="w-3.5 h-3.5 text-chart-5" />}
                {hasAnswered && <CheckIcon className="w-3.5 h-3.5 text-chart-2" />}
                {isCurrentUser && (
                  <span className="text-[11px] font-semibold text-primary">(You)</span>
                )}
              </div>
              <div className={cn("text-xs font-semibold tabular-nums text-foreground z-10")}>
                {scoreByUserId[member.id] ?? 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
