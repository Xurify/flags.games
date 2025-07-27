import { MultiplayerPageContent } from "./PageContent";
import { UsernameGenerator } from "@/lib/utils/usernameGenerator";

export default async function MultiplayerPage() {
  const randomUsername = new UsernameGenerator().generateUsername();
  return <MultiplayerPageContent randomUsername={randomUsername} />;
} 