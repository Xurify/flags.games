import React, { ReactNode, useState } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import SettingsMenu from "@/components/SettingsMenu";

interface HeaderProps {
  leftContent: ReactNode;
  showDifficultyDialog?: boolean;
  setShowDifficultyDialog?: (open: boolean) => void;
  setShowModesDialog?: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ leftContent, showDifficultyDialog, setShowDifficultyDialog, setShowModesDialog }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, updateSetting } = useSettings();

  const toggleDarkMode = () => {
    const nextDark = !settings.darkMode;
    updateSetting("darkMode", nextDark);
    document.cookie = `theme=${nextDark ? "dark" : "light"}; path=/; max-age=31536000`;
  };

  const toggleSound = () => {
    updateSetting("soundEffectsEnabled", !settings.soundEffectsEnabled);
  };

  return (
    <div className="flex items-center justify-center mb-3 sm:mb-6">
      <div className="bg-card rounded-2xl px-4 py-2 border">
        <div className="flex items-center gap-4">
          {leftContent}
          <div className="w-px h-6 bg-border"></div>
          <SettingsMenu
            settingsOpen={settingsOpen}
            setSettingsOpen={setSettingsOpen}
            setShowDifficultyDialog={setShowDifficultyDialog || (() => {})}
            setShowModesDialog={setShowModesDialog}
            toggleSound={toggleSound}
            toggleDarkMode={toggleDarkMode}
            settings={settings}
            showDifficultyOption={!!setShowDifficultyDialog}
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 