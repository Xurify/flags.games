"use client";

import { useRouter } from "next/navigation";
import MultiplayerRoom from "@/components/multiplayer/MultiplayerRoom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

interface MultiplayerPageContentProps {
  randomUsername: string;
}

export function MultiplayerPageContent({
  randomUsername,
}: MultiplayerPageContentProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
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
        <MultiplayerRoom randomUsername={randomUsername} />
      </div>
    </div>
  );
}
