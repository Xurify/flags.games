"use strict";

import { useMemo, useState } from "react";
import { CrownIcon, ChevronDownIcon, CheckIcon } from "lucide-react";
import { User, RoomMember, GameStateLeaderboard } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";

interface MobileLeaderboardProps {
  members: RoomMember[];
  leaderboard: GameStateLeaderboard[];
  currentUser: User | null;
  hostId: string;
  isGameActive: boolean;
  onExpand?: () => void;
}

export default function MobileLeaderboard({ members, leaderboard, currentUser, hostId, isGameActive }: MobileLeaderboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedLeaderboard = useMemo(() => {
    const leaderboardMap = new Map(leaderboard.map((player) => [player.userId, player]));

    const allPlayers = members.map((member) => {
      const entry = leaderboardMap.get(member.id);
      return {
        userId: member.id,
        username: member.username,
        score: entry?.score ?? 0,
        isCurrentUser: currentUser?.id === member.id,
        isHost: member.id === hostId,
        hasAnswered: member.hasAnswered,
      };
    });

    return allPlayers.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.username.localeCompare(b.username);
    });
  }, [members, leaderboard, currentUser, hostId]);

  const topThree = sortedLeaderboard.slice(0, 3);
  const userInTopThree = topThree.some((p) => p.isCurrentUser);

  return (
    <div className="lg:hidden w-full sticky top-0 z-50">
      <div className="bg-card border-b-2 border-foreground/10 px-4 py-2 flex items-center justify-between gap-4 h-[52px] relative z-20">
        <div className="flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar">
          {topThree.map((player, index) => (
            <div
              key={player.userId}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-full border border-transparent transition-all shrink-0 relative group",
                player.isCurrentUser ? "bg-primary/10 border-primary/20" : "bg-muted/30 dark:bg-foreground/10",
                index === 0 && "pl-1.5"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-foreground/10",
                  index === 0 ? "bg-yellow-400 text-yellow-950" : "bg-background text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <div className="relative max-w-[150px]">
                <span
                  className={cn(
                    "block text-xs font-bold uppercase tracking-tight truncate",
                    player.isCurrentUser ? "text-primary" : "text-foreground"
                  )}
                >
                  {player.username}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {player.isHost && <CrownIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                {isGameActive && (
                  <div className="w-3 flex justify-center">
                    {player.hasAnswered && <CheckIcon className="w-3 h-3 text-success stroke-[3]" />}
                  </div>
                )}
              </div>

              <span className="text-xs font-black tabular-nums text-foreground/70">{player.score}</span>
            </div>
          ))}
        </div>
        {!userInTopThree &&
          currentUser &&
          (() => {
            const userRankIndex = sortedLeaderboard.findIndex((p) => p.isCurrentUser);
            if (userRankIndex === -1) return null;
            const userEntry = sortedLeaderboard[userRankIndex];
            return (
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-px h-6 bg-foreground/10 shrink-0" />
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                  <div className="w-5 h-5 rounded-full bg-background flex items-center justify-center text-[10px] font-black text-muted-foreground border border-foreground/10">
                    {userRankIndex + 1}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight text-primary max-w-[150px] truncate">
                    {userEntry.username}
                  </span>
                  <div className="flex items-center gap-1">
                    {userEntry.isHost && <CrownIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                    {isGameActive && (
                      <div className="w-3 flex justify-center">
                        {userEntry.hasAnswered && <CheckIcon className="w-3 h-3 text-success stroke-[3]" />}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-black tabular-nums text-foreground/70">{userEntry.score}</span>
                </div>
              </div>
            );
          })()}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1.5 hover:bg-foreground/10 rounded-full transition-colors shrink-0"
        >
          <ChevronDownIcon
            className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")}
          />
        </button>
      </div>
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 z-0 bg-background/50 backdrop-blur-[1px] lg:hidden"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-card border-b-2 border-foreground/10 shadow-xl z-20 max-h-[60vh] overflow-y-auto flex flex-col gap-2 p-4 animate-in slide-in-from-top-2 duration-200">
            {sortedLeaderboard.map((player, index) => (
              <div
                key={player.userId}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border transition-all",
                  player.isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-card border-transparent hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border border-foreground/5",
                    index === 0 ? "bg-yellow-400 text-yellow-950" : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-bold uppercase tracking-tight truncate",
                      player.isCurrentUser ? "text-primary" : "text-foreground"
                    )}
                  >
                    {player.username}
                  </span>
                  {player.isHost && <CrownIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                  {isGameActive && (
                    <div className="w-3.5 flex justify-center">
                      {player.hasAnswered && <CheckIcon className="w-3.5 h-3.5 text-success stroke-[3]" />}
                    </div>
                  )}
                </div>
                <span className="text-sm font-black tabular-nums">{player.score}</span>
              </div>
            ))}
            {sortedLeaderboard.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground italic">Waiting for players...</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
