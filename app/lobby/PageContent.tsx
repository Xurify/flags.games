"use client";

import { useCallback } from "react";
import { CrownIcon, UserIcon, CheckIcon, PlayIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";

const difficulties = ["easy", "medium", "hard", "expert"];
const timeLimits = [10, 15, 20, 30, 60];
const roomSizes = [2, 3, 4, 5, 6, 7, 8];

export function LobbyPageContent() {
  const {
    currentRoom,
    currentUser,
    isHost,
    canStartGame,
    updateRoomSettings,
  } = useRoomManagement();

  if (!currentRoom || !currentRoom.settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground">Loading lobby...</span>
      </div>
    );
  }

  const members = currentRoom.members;
  const maxPlayers = currentRoom.settings.questionCount;
  const inviteCode = currentRoom.inviteCode || "";
  const inviteLink = typeof window !== "undefined" && inviteCode ? `${window.location.origin}/lobby?c=${inviteCode}` : "";

  const handleSettingChange = useCallback((key: keyof typeof currentRoom.settings, value: any) => {
    if (isHost()) {
      updateRoomSettings({ ...currentRoom.settings, [key]: value });
    }
  }, [isHost, updateRoomSettings, currentRoom]);

  // Ready up logic (assumes a socket action, adjust as needed)
  const handleReady = () => {
    // TODO: Implement ready up logic via socket
    // Example: socket.emit('readyUp', { roomId: currentRoom.id })
  };

  // Start game logic (assumes a socket action, adjust as needed)
  const handleStart = () => {
    // TODO: Implement start game logic via socket
    // Example: socket.emit('startGame', { roomId: currentRoom.id })
  };

  const handleInvite = () => {
    if (inviteLink) navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-card">
        {/* Player List */}
        <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-border flex flex-col items-center p-4 bg-card">
          <CardHeader className="w-full pb-2">
            <CardTitle className="text-base text-foreground text-center">Players {members.length}/{maxPlayers}</CardTitle>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-2 p-0">
            {[...members, ...Array(maxPlayers - members.length).fill(null)].map((player, idx) => (
              <div key={idx} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${player ? "bg-muted" : "bg-muted/50"}`}>
                {player ? (
                  <>
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                      {player.avatar ? <img src={player.avatar} alt={player.name} className="w-9 h-9 rounded-full" /> : <UserIcon className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <span className="font-medium text-foreground flex-1">{player.name || player.username}</span>
                    {currentRoom?.host === player.id && <CrownIcon className="w-4 h-4 text-yellow-400" aria-label="Host" />}
                    {player.isReady && <CheckIcon className="w-4 h-4 text-green-500" aria-label="Ready" />}
                  </>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-2"><UserIcon className="w-4 h-4" /> EMPTY</span>
                )}
              </div>
            ))}
          </CardContent>
        </div>
        {/* Settings & Actions */}
        <div className="md:w-2/3 flex flex-col gap-6 p-4">
          <div className="mb-2">
            <h2 className="text-base font-semibold text-foreground mb-3 text-center md:text-left">Game Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty" className="text-sm font-medium">Difficulty</Label>
                <Select value={currentRoom.settings.difficulty || "easy"} onValueChange={v => handleSettingChange("difficulty", v)} disabled={!isHost()}>
                  <SelectTrigger className="h-11 rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(d => (
                      <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roomSize" className="text-sm font-medium">Max Players</Label>
                <Select value={String(currentRoom.settings.questionCount || 4)} onValueChange={v => handleSettingChange("questionCount", Number(v))} disabled={!isHost()}>
                  <SelectTrigger className="h-11 rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roomSizes.map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeLimit" className="text-sm font-medium">Time per Question (seconds)</Label>
                <Select value={String(currentRoom.settings.timePerQuestion || 30)} onValueChange={v => handleSettingChange("timePerQuestion", Number(v))} disabled={!isHost()}>
                  <SelectTrigger className="h-11 rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeLimits.map(t => (
                      <SelectItem key={t} value={t.toString()}>{t} seconds</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleInvite}>
              <LinkIcon className="w-4 h-4" /> Invite
            </Button>
            <Button variant={currentUser?.isReady ? "default" : "secondary"} className="flex items-center gap-2" onClick={handleReady}>
              <CheckIcon className="w-4 h-4" /> {currentUser?.isReady ? "Ready!" : "Ready Up"}
            </Button>
            {isHost() && (
              <Button variant="default" className="flex items-center gap-2" onClick={handleStart} disabled={!canStartGame()}>
                <PlayIcon className="w-4 h-4" /> Start
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
