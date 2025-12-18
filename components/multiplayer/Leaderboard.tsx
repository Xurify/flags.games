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
        "border-2 border-foreground shadow-retro bg-card overflow-hidden",
        variant === "sidebar" && "hidden lg:block w-72",
        variant === "inline" && "w-full lg:w-72"
      )}
    >
      <div className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase">Rankings</div>
        <div className="flex items-center gap-2">
          {isGameActive && <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse" />}
          <span className="text-[10px] font-black uppercase tracking-tighter">
            {isGameActive ? "LIVE" : "READY"}
          </span>
        </div>
      </div>

      <div className={cn("max-h-[500px] overflow-y-auto", variant === "inline" && "max-h-none")}>
        <div className="divide-y-2 divide-foreground/10">
          {sortedMembers.map((member, index) => {
            const isCurrentUser = currentUser?.id === member.id;
            const isHost = member.id === hostId;
            const hasAnswered = isGameActive && member.hasAnswered === true;

            return (
              <div
                key={member.id}
                className={cn(
                  "relative group grid grid-cols-[3ch_1fr_auto] items-center gap-4 px-4 py-3 transition-colors",
                  isCurrentUser ? "bg-primary/5" : "bg-transparent",
                  hasAnswered && "bg-success/5"
                )}
                ref={(element) => {
                  rowRefs.current[member.id] = element;
                }}
              >
                <div data-role="highlight" className="absolute inset-0 pointer-events-none z-0" />

                <div className="text-xl font-black italic tracking-tighter text-foreground/20 group-hover:text-foreground/40 transition-colors z-10">
                  {index + 1}
                </div>

                <div className="min-w-0 flex items-center gap-2 z-10">
                  <span className={cn(
                    "truncate leading-tight",
                    isCurrentUser ? "font-black text-primary" : "font-bold text-foreground"
                  )}>
                    {member.username}
                  </span>
                  {isHost && <CrownIcon className="w-3 h-3 text-warning fill-warning" />}
                  {hasAnswered && <CheckIcon className="w-3 h-3 text-success stroke-[3]" />}
                </div>

                <div className="text-lg font-black tabular-nums tracking-tighter text-foreground z-10">
                  {scoreByUserId[member.id] ?? 0}
                </div>

                {isCurrentUser && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!isGameActive && members.length < 2 && (
        <div className="p-4 bg-muted/20 border-t-2 border-foreground/10 text-center">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Waiting for more players...
          </p>
        </div>
      )}
    </div>
  );
}
