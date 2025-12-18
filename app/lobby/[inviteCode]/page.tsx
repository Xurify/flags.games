import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { flagsApi } from "@/lib/api/flags-api";
import { logger } from "@/lib/utils/logger";
import RoomPageClient from "./RoomPageClient";

interface RoomPageProps {
  params: Promise<{ inviteCode: string }>;
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { inviteCode } = await params;
  return {
    title: "Multiplayer Game | flags.games",
    alternates: {
      canonical: `/lobby/${inviteCode}`,
    },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { inviteCode } = await params;
  const roomResponse = await flagsApi.getRoomByInviteCode(inviteCode);

  if ("error" in roomResponse) {
    logger.error(`Error getting room by invite code: ${roomResponse.error}`);
    return redirect(`/lobby`);
  }

  return <RoomPageClient />;
}
