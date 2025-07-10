import { cookies } from "next/headers";
import { SocketProvider } from "@/lib/context/SocketContext";
import { CreateRoomPageContent } from "./PageContent";

export default async function CreateRoomPage() {
  const sessionToken = (await cookies()).get("session_token")?.value || null;
  return (
    <SocketProvider sessionToken={sessionToken}>
      <CreateRoomPageContent />
    </SocketProvider>
  );
}
