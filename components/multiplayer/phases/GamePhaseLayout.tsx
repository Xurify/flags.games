"use client";

import { useRouter } from "next/navigation";
import { HomeIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { useSocket } from "@/lib/context/SocketContext";
import { Room } from "@/lib/types/socket";

interface GamePhaseLayoutProps {
  room: Room;
  children: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
}

export default function GamePhaseLayout({ 
  room, 
  children, 
  additionalHeaderContent 
}: GamePhaseLayoutProps) {
  const router = useRouter();
  const { leaveRoom } = useSocket();

  const handleLeaveGame = async () => {
    await leaveRoom();
    router.push("/lobby");
  };

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4">
          <Header
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleLeaveGame}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium text-foreground">MULTIPLAYER</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <UsersIcon className="w-3 h-3" />
                  {room.members.length}
                </Badge>
                {additionalHeaderContent}
              </div>
            }
          />
        </div>

        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6">
          <CardContent className="p-3 sm:p-4">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 