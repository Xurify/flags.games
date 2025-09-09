import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SettingsIcon,
  Volume2Icon,
  VolumeXIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  UsersIcon,
  ChartNoAxesColumnIncreasingIcon,
  Gamepad2Icon,
} from "lucide-react";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SettingsMenuProps {
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  setShowDifficultyDialog: (open: boolean) => void;
  setShowModesDialog?: (open: boolean) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
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
  setShowModesDialog,
  toggleSound,
  toggleDarkMode,
  showDifficultyOption = true,
  settings,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Select open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SelectTrigger
        aria-label="Settings"
        className="w-auto border-none bg-transparent shadow-none p-0 h-auto"
      >
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
                    Gameplay
                  </h4>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        setSettingsOpen(false);
                        setShowDifficultyDialog(true);
                      }}
                      size="sm"
                      className="w-full justify-start"
                      variant="neutral"
                    >
                      <ChartNoAxesColumnIncreasingIcon className="w-4 h-4 mr-2" />
                      Change Difficulty
                    </Button>
                    <Button
                      onClick={() => {
                        setSettingsOpen(false);
                        setShowModesDialog && setShowModesDialog(true);
                      }}
                      size="sm"
                      className="w-full justify-start"
                      variant="neutral"
                    >
                      <Gamepad2Icon className="w-4 h-4 mr-2" />
                      Change Modes
                    </Button>
                  </div>
                </div>

                <div className="w-full h-px bg-border"></div>
              </>
            )}

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Game Modes
              </h4>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => {
                  setSettingsOpen(false);
                  router.push("/");
                }}
                className="w-full justify-start mb-2"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Singleplayer
              </Button>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => {
                  setSettingsOpen(false);
                  if (pathname.includes("/lobby")) {
                    window.location.href = "/lobby";
                  } else {
                    router.push("/lobby");
                  }
                }}
                className="w-full justify-start"
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                Multiplayer (Beta)
              </Button>
            </div>

            <div className="w-full h-px bg-border"></div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Preferences
              </h4>
              <div className="flex flex-col gap-2">
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
                  {settings.darkMode ? "Dark Mode: On" : "Dark Mode: Off"}
                </Button>
              </div>
            </div>

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
