"use client";

import React from "react";
import { CrownIcon, CheckIcon } from "lucide-react";
import { User } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";

interface LeaderboardProps {
  members: User[];
  currentUser: User | null;
  hostId: string;
  isGameActive: boolean;
  variant?: "sidebar" | "inline";
}

export default function Leaderboard({
  members,
  currentUser,
  hostId,
  isGameActive,
  variant = "sidebar",
}: LeaderboardProps) {
  const sortedMembers = [...members].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.username.localeCompare(b.username);
  });

  return (
    <div
      className={cn(
        variant === "sidebar" && "hidden lg:block w-72",
        variant === "inline" && "w-full lg:w-64 lg:border-l lg:border-border/50 lg:pl-4"
      )}
    >
      <div className={cn("px-3 py-2", variant === "inline" && "px-0 pb-2")}> 
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Leaderboard
        </div>
        <div className="text-[11px] text-muted-foreground/80">
          {isGameActive ? "Live" : "Waiting"}
        </div>
      </div>

      <div className={cn("max-h-[500px] overflow-y-auto divide-y divide-border/50", variant === "inline" && "max-h-none")}> 
        {sortedMembers.map((member, index) => {
          const isCurrentUser = currentUser?.id === member.id;
          const isHost = member.id === hostId;
          const hasAnswered = isGameActive && member.currentAnswer !== undefined;

          return (
            <div
              key={member.id}
              className={cn(
                "grid grid-cols-[2ch_1fr_auto] items-center gap-3 px-3 py-2",
                isCurrentUser && "[&>*:nth-child(2)>span:first-child]:font-semibold",
                variant === "inline" && "px-0"
              )}
            >
              <div className="text-xs tabular-nums text-muted-foreground">
                {index + 1}
              </div>
              <div className="min-w-0 flex items-center gap-1">
                <span className={cn("truncate", isCurrentUser ? "font-semibold" : "font-medium")}>{member.username}</span>
                {isHost && <CrownIcon className="w-3 h-3 text-muted-foreground" />}
                {hasAnswered && <CheckIcon className="w-3 h-3 text-muted-foreground/70" />}
                {isCurrentUser && (
                  <span className="text-[11px] text-muted-foreground">(You)</span>
                )}
              </div>
              <div className="text-xs font-semibold tabular-nums text-foreground">
                {member.score}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
