import { redirect } from "next/navigation";

export default async function LobbyInvitePage({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  const inviteCode = (await params).inviteCode;
  redirect(`/lobby?c=${inviteCode}`);
}
