import { LobbyPageClient } from "./LobbyPageClient";
import { UsernameGenerator } from "@/lib/utils/usernameGenerator";

export default async function MultiplayerPage() {
  const randomUsername = new UsernameGenerator().generateUsername();
  return <LobbyPageClient randomUsername={randomUsername} />;
} 