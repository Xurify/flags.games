import type { Metadata } from "next";
import { SocketProvider } from "@/lib/context/SocketContext";
import { UsernameGenerator } from "@/lib/utils/usernameGenerator";
import { LobbyPageClient } from "./LobbyPageClient";

export const metadata: Metadata = {
  title: "Multiplayer Lobby | flags.games",
  description: "Join a multiplayer game or create your own room.",
  alternates: {
    canonical: "/lobby",
  },
};

export default function LobbyPage() {
  const randomUsername = new UsernameGenerator().generateUsername();
  return (
    <SocketProvider>
      <LobbyPageClient randomUsername={randomUsername} />
    </SocketProvider>
  );
}
