import { cookies } from "next/headers";
import { SocketProvider } from "@/lib/context/SocketContext";
import { MultiplayerPageContent } from "./PageContent";

export default async function MultiplayerPage() {
  const sessionToken = (await cookies()).get("session_token")?.value || null;
  return (
    <SocketProvider sessionToken={sessionToken}>
      <MultiplayerPageContent />
    </SocketProvider>
  );
} 