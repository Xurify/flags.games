"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/context/SocketContext";
import CreateRoomView from "@/components/multiplayer/CreateRoomView";
import { RoomSettings } from "@/lib/types/multiplayer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export function CreateRoomPageContent() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { createRoom, currentRoom, currentUser } = useSocket();

  useEffect(() => {
    if (currentRoom?.inviteCode && currentUser?.isAdmin) {
      // Room creator (admin) goes to lobby without query params
      router.push("/lobby");
    }
  }, [currentRoom, currentUser, router]);

  const handleCreateRoom = async (username: string, settings: RoomSettings) => {
    setIsCreating(true);
    await createRoom(username, settings.difficulty);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-8">
          <Header
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => router.push("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-foreground">
                  MULTIPLAYER
                </span>
              </div>
            }
          />
        </div>
        <CreateRoomView
          onCreateRoom={handleCreateRoom}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}
