import { SocketProvider } from "@/lib/context/SocketContext";

export default async function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
} 