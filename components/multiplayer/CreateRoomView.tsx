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
import { Difficulty, ROOM_SIZES } from "@/lib/constants";

interface CreateRoomViewProps {
  onCreateRoom: (username: string, settings: RoomSettings) => void;
  isCreating?: boolean;
}

const CreateRoomView: React.FC<CreateRoomViewProps> = ({
  onCreateRoom,
  isCreating = false,
}) => {
  const [username, setUsername] = useState("");
  const [settings, setSettings] = useState<RoomSettings>({
    maxRoomSize: 2,
    difficulty: "easy",
    gameMode: "classic",
    timeLimit: 30,
  });

  const handleCreateRoom = () => {
    if (username.trim().length >= 3) {
      onCreateRoom(username.trim(), settings);
    }
  };

  const isFormValid = username.trim().length >= 3;

  return (
    <div className="max-w-4xl w-full mx-auto">
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
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your name (min. 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl"
              maxLength={24}
            />
            <p className="text-xs text-muted-foreground">
              {username.length}/24 characters
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
                    {ROOM_SIZES.map((roomSize) => (
                      <SelectItem
                        key={`room-sizes-${roomSize}`}
                        value={roomSize.toString()}
                      >
                        {roomSize} Players
                      </SelectItem>
                    ))}
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
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
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
                    <SelectItem disabled={true} value="speed">
                      Speed Round
                    </SelectItem>
                    <SelectItem disabled={true} value="elimination">
                      Elimination
                    </SelectItem>
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
                "Create Room"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoomView;
