import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SettingsIcon, Volume2Icon, VolumeXIcon, SunIcon, MoonIcon, UsersIcon } from "lucide-react";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SettingsMenuProps {
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  setShowDifficultyDialog: (open: boolean) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
  onNavigateToMultiplayer?: () => void;
  showDifficultyOption?: boolean;
  settings: {
    soundEffectsEnabled: boolean;
    darkMode: boolean;
  };
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  settingsOpen,
  setSettingsOpen,
  setShowDifficultyDialog,
  toggleSound,
  toggleDarkMode,
  onNavigateToMultiplayer,
  showDifficultyOption = true,
  settings,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const showMultiplayer = process.env.NODE_ENV === "development";
  //pathname !== "/multiplayer"
  return (
    <Select open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SelectTrigger aria-label="Settings" className="w-auto border-none bg-transparent shadow-none p-0 h-auto">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground dark:text-foreground transition-colors">
          <SettingsIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </SelectTrigger>
      <SelectContent className="w-64">
        <div className="p-3">
          <div className="space-y-4">
            {showDifficultyOption && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Difficulty Level
                  </h4>
                  <Button
                    onClick={() => {
                      setSettingsOpen(false);
                      setShowDifficultyDialog(true);
                    }}
                    size="sm"
                    className="w-full mt-2"
                    variant="neutral"
                  >
                    Change Difficulty
                  </Button>
                </div>

                <div className="w-full h-px bg-border"></div>
              </>
            )}

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Sound Effects
              </h4>
              <Button
                variant="neutral"
                size="sm"
                onClick={toggleSound}
                className="w-full justify-start"
              >
                {settings.soundEffectsEnabled ? (
                  <Volume2Icon className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeXIcon className="w-4 h-4 mr-2" />
                )}
                {settings.soundEffectsEnabled ? "Sound On" : "Sound Off"}
              </Button>
            </div>

            <div className="w-full h-px bg-border"></div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Dark Mode
              </h4>
              <Button
                variant="neutral"
                size="sm"
                onClick={toggleDarkMode}
                className="w-full justify-start"
                aria-pressed={settings.darkMode}
              >
                {settings.darkMode ? (
                  <SunIcon className="w-4 h-4 mr-2" />
                ) : (
                  <MoonIcon className="w-4 h-4 mr-2" />
                )}
                {settings.darkMode ? "On" : "Off"}
              </Button>
            </div>

            {showMultiplayer && (
              <>
                <div className="w-full h-px bg-border"></div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Game Modes
                  </h4>
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => {
                      setSettingsOpen(false);
                      router.push("/lobby");
                    }}
                    className="w-full justify-start"
                  >
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Multiplayer
                  </Button>
                </div>
              </>
            )}

            <div className="w-full h-px bg-border"></div>

            <div>
              <a
                href="https://github.com/Xurify/flags.games"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-center w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <img
                  src="/icon.svg"
                  alt="Guess the Country Icon"
                  className="w-6 h-6 rounded"
                />
                Made with ❤️ by Xurify
              </a>
            </div>
          </div>
        </div>
      </SelectContent>
    </Select>
  );
};

export default SettingsMenu;
