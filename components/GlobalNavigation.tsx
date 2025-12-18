"use client";

import React, { useState } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import Link from "next/link";
import SettingsMenu from "@/components/SettingsMenu";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon, Volume2Icon, VolumeXIcon, SettingsIcon, HomeIcon } from "lucide-react";

export const GlobalNavigation = () => {
    const { settings, updateSetting } = useSettings();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const toggleDarkMode = () => {
        const nextDark = !settings.darkMode;
        updateSetting("darkMode", nextDark);
        document.cookie = `theme=${nextDark ? "dark" : "light"}; path=/; max-age=31536000`;
    };

    const toggleSound = () => {
        updateSetting("soundEffectsEnabled", !settings.soundEffectsEnabled);
    };

    return (
        <div className="fixed bottom-3 right-3 sm:bottom-auto sm:top-6 sm:right-6 z-50">
            <div className="bg-background/95 backdrop-blur-sm border-2 border-foreground p-1 flex items-center gap-1 rounded-sm shadow-retro md:shadow-none">
                <Link href="/">
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
                    className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground border-transparent hover:border-foreground"
                    title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    playClickSound={true}
                >
                    {settings.darkMode ? <SunIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <MoonIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleSound}
                    className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground border-transparent hover:border-foreground"
                    title={settings.soundEffectsEnabled ? "Mute Sound" : "Unmute Sound"}
                    playClickSound={true}
                >
                    {settings.soundEffectsEnabled ? <Volume2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeXIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </Button>

                <div className="h-4 w-px bg-foreground/10 mx-0.5" />

                <div className="px-1 sm:px-2">
                    <SettingsMenu
                        settingsOpen={settingsOpen}
                        setSettingsOpen={setSettingsOpen}
                        setShowDifficultyDialog={() => { }}
                        toggleSound={toggleSound}
                        toggleDarkMode={toggleDarkMode}
                        settings={settings}
                        showDifficultyOption={false}
                    />
                </div>
            </div>
        </div>
    );
};
