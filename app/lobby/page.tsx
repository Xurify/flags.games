import type { Metadata } from "next";
import { LobbyPageClient } from "./LobbyPageClient";
import { UsernameGenerator } from "@/lib/utils/usernameGenerator";

export const metadata: Metadata = {
  title: "Multiplayer Lobby | flags.games",
  description: "Join a multiplayer game or create your own room.",
  alternates: {
    canonical: "/lobby",
  },
};

export default async function LobbyPage() {
  const randomUsername = new UsernameGenerator().generateUsername();
  return <LobbyPageClient randomUsername={randomUsername} />;
} 