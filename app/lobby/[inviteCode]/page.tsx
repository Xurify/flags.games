import { redirect } from "next/navigation";
import { flagsApi } from "@/lib/api/flags-api";
import RoomPageClient from "./RoomPageClient";

interface RoomPageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { inviteCode } = await params;
  const roomResponse = await flagsApi.getRoomByInviteCode(inviteCode);

  if ("error" in roomResponse) {
    return redirect(`/lobby`);
  }

  return <RoomPageClient />;
}
