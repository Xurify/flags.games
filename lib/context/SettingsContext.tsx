"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AUDIO_URLS, AUDIO_URLS_KEYS, SETTINGS_STORAGE_KEY } from "../constants";
import { audioManager } from "../utils/audioUtils";

export interface GameSettings {
  soundEffectsEnabled: boolean;
  autoAdvanceEnabled: boolean;
  darkMode: boolean;
}

const defaultSettings: GameSettings = {
  soundEffectsEnabled: true,
  autoAdvanceEnabled: true,
  darkMode: false,
};

interface SettingsContextType {
  settings: GameSettings;
  updateSetting: (key: keyof GameSettings, value: any) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  useEffect(() => {
    audioManager.preloadAudio(AUDIO_URLS.BUTTON_CLICK, AUDIO_URLS_KEYS.BUTTON_CLICK);
    audioManager.setupAutoResumeOnUserInteraction();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings({
        soundEffectsEnabled: parsedSettings.soundEffectsEnabled ?? defaultSettings.soundEffectsEnabled,
        autoAdvanceEnabled: parsedSettings.autoAdvanceEnabled ?? defaultSettings.autoAdvanceEnabled,
        darkMode: parsedSettings.darkMode ?? defaultSettings.darkMode,
      });
    }
  }, []);

  const updateSetting = (key: keyof GameSettings, value: any) => {
    audioManager.playButtonClickSound();
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}; 