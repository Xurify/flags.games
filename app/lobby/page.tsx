import { cookies } from "next/headers";
import { SocketProvider } from "@/lib/context/SocketContext";
import { LobbyPageContent } from "./PageContent";

export default async function LobbyPage() {
  const sessionToken = (await cookies()).get("session_token")?.value || null;
  return (
    <SocketProvider sessionToken={sessionToken}>
      <LobbyPageContent />
    </SocketProvider>
  );
}
