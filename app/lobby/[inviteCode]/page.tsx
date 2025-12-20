import { redirect } from "next/navigation";

export default function RoomPage({
  params,
}: {
  params: { inviteCode: string };
}) {
  redirect(`/lobby?c=${params.inviteCode}`);
}
