import { redirect } from "next/navigation";
import { flagsApi } from "@/lib/api/flags-api";
import RoomPageClient from "./RoomPageClient";

export default async function RoomPage({
  params,
}: {
  params: { inviteCode: string };
}) {
  const { inviteCode } = await params;
  const roomResponse = await flagsApi.getRoomByInviteCode(inviteCode);

  if ("error" in roomResponse) {
    return redirect(`/lobby`);
  }

  return <RoomPageClient />;
}
