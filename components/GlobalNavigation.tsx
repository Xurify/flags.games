"use client";

import { useState } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/context/SettingsContext";
import { useGameNavigation } from "@/lib/context/GameNavigationContext";
import { useRouter } from "next/navigation";
import SettingsMenu from "@/components/SettingsMenu";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon, Volume2Icon, VolumeXIcon, HomeIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const GlobalNavigation = () => {
  const { settings, updateSetting } = useSettings();
  const { isHomeNavigationConfirmationRequired } = useGameNavigation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    const nextDark = !settings.darkMode;
    updateSetting("darkMode", nextDark);
    document.cookie = `theme=${nextDark ? "dark" : "light"}; path=/; max-age=31536000`;
  };

  const toggleSound = () => {
    updateSetting("soundEffectsEnabled", !settings.soundEffectsEnabled);
  };

  const confirmHomeNavigation = () => {
    setShowHomeConfirm(false);
    router.push("/");
  };

  return (
    <>
      <div className="fixed bottom-3 right-3 sm:bottom-auto sm:top-6 sm:right-6 z-50">
        <div className="bg-background/95 backdrop-blur-sm border-2 border-foreground p-1 flex items-center gap-1 rounded-sm shadow-retro">
          <Link
            href="/"
            onClick={(e) => {
              if (isHomeNavigationConfirmationRequired) {
                e.preventDefault();
                setShowHomeConfirm(true);
              }
            }}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground border-transparent hover:border-foreground"
              title="Return to Home"
              playClickSound={true}
            >
              <HomeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-foreground/10 mx-0.5" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleDarkMode}
            className="group h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary border-transparent hover:border-foreground"
            title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            playClickSound={true}
          >
            {settings.darkMode ? (
              <SunIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 group-hover:text-black fill-current" />
            ) : (
              <MoonIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-black" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSound}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground border-transparent hover:border-foreground"
            title={settings.soundEffectsEnabled ? "Mute Sound" : "Unmute Sound"}
            playClickSound={true}
          >
            {settings.soundEffectsEnabled ? (
              <Volume2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <VolumeXIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </Button>
          <div className="h-4 w-px bg-foreground/10 mx-0.5" />
          <div className="px-1 sm:px-2">
            <SettingsMenu
              settingsOpen={settingsOpen}
              setSettingsOpen={setSettingsOpen}
              setShowDifficultyDialog={() => {}}
              toggleSound={toggleSound}
              toggleDarkMode={toggleDarkMode}
              settings={settings}
              showDifficultyOption={false}
            />
          </div>
        </div>
      </div>
      <AlertDialog open={showHomeConfirm} onOpenChange={setShowHomeConfirm}>
        <AlertDialogContent className="max-w-[92vw] sm:max-w-md p-4 sm:p-8 max-h-[85vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-destructive">
              Return to Home?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium pt-2">
              Are you sure you want to leave? Your current game progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold uppercase tracking-wide">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmHomeNavigation}
              className="font-black uppercase tracking-wide"
            >
              Leave Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
