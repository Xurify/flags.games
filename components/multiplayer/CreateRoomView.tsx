"use client";

import React, { useState } from "react";
import { UsersIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomSettings } from "@/lib/types/multiplayer";
import { Difficulty } from "@/lib/constants";

interface CreateRoomViewProps {
  onCreateRoom: (roomName: string, settings: RoomSettings) => void;
  isCreating?: boolean;
  onSwitchView: () => void;
}

const CreateRoomView: React.FC<CreateRoomViewProps> = ({
  onCreateRoom,
  isCreating = false,
  onSwitchView,
}) => {
  const [roomName, setRoomName] = useState("");
  const [settings, setSettings] = useState<RoomSettings>({
    maxRoomSize: 4,
    difficulty: "easy",
    gameMode: "classic",
    timeLimit: 30,
  });
  const router = require("next/navigation").useRouter();

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      onCreateRoom(roomName.trim(), settings);
    }
  };

  const isFormValid = roomName.trim().length >= 3;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary" />
              Create New Room
            </CardTitle>
            <CardDescription className="text-center">
              Set up a new multiplayer game room for you and your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-sm font-medium">
                Room Name
              </Label>
              <Input
                id="roomName"
                placeholder="Enter room name (min. 3 characters)"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="h-11 rounded-xl"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">
                {roomName.length}/30 characters
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Game Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers" className="text-sm font-medium">
                    Max Players
                  </Label>
                  <Select
                    value={settings.maxRoomSize.toString()}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        maxRoomSize: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Players</SelectItem>
                      <SelectItem value="3">3 Players</SelectItem>
                      <SelectItem value="4">4 Players</SelectItem>
                      <SelectItem value="6">6 Players</SelectItem>
                      <SelectItem value="8">8 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </Label>
                  <Select
                    value={settings.difficulty}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        difficulty: value as Difficulty,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-sm font-medium">
                    Time per Question (seconds)
                  </Label>
                  <Select
                    value={settings.timeLimit?.toString() || "30"}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        timeLimit: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="20">20 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="45">45 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameMode" className="text-sm font-medium">
                    Game Mode
                  </Label>
                  <Select
                    value={settings.gameMode}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        gameMode: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="speed">Speed Round</SelectItem>
                      <SelectItem value="elimination">Elimination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleCreateRoom}
                disabled={!isFormValid || isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating Room...
                  </>
                ) : (
                  <>Create Room</>
                )}
              </Button>
              <div className="flex justify-center mt-2">
                <Button variant="link" onClick={onSwitchView} type="button">
                  Switch to Join Room
                </Button>
              </div>
            </div>
            <div className="bg-muted/70 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                You'll be the room host and can start the game when everyone is
                ready
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoomView;
