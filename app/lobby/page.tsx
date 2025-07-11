import { cookies } from "next/headers";
import { SocketProvider } from "@/lib/context/SocketContext";
import { MultiplayerPageContent } from "./PageContent";
import { UsernameGenerator } from "@/lib/utils/usernameGenerator";

export default async function MultiplayerPage() {
  const sessionToken = (await cookies()).get("session_token")?.value || null;
  const randomUsername = new UsernameGenerator().generateUsername();
  return (
    <SocketProvider sessionToken={sessionToken}>
      <MultiplayerPageContent randomUsername={randomUsername} />
    </SocketProvider>
  );
} 