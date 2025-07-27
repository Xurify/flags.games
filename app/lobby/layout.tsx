import { cookies } from "next/headers";
import { SocketProvider } from "@/lib/context/SocketContext";

export default async function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionToken = (await cookies()).get("session_token")?.value || null;
  
  return (
    <SocketProvider sessionToken={sessionToken}>
      {children}
    </SocketProvider>
  );
} 