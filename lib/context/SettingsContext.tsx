"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AUDIO_URLS, AUDIO_URLS_KEYS, SETTINGS_STORAGE_KEY, TIME_PER_QUESTION_OPTIONS } from "../constants";
import { audioManager } from "../utils/audio-manager";

export interface GameSettings {
  soundEffectsEnabled: boolean;
  autoAdvanceEnabled: boolean;
  darkMode: boolean;
  timedModeEnabled: boolean;
  timePerQuestion: number;
}

export const defaultSettings: GameSettings = {
  soundEffectsEnabled: true,
  autoAdvanceEnabled: true,
  darkMode: false,
  timedModeEnabled: false,
  timePerQuestion: TIME_PER_QUESTION_OPTIONS[0],
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
    audioManager.preloadAudio(AUDIO_URLS.CLOCK_TICK, AUDIO_URLS_KEYS.CLOCK_TICK);
    audioManager.setupAutoResumeOnUserInteraction();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      // Only hydrate app-level preferences; keep gameplay in-memory per session
      setSettings({
        ...defaultSettings,
        soundEffectsEnabled: parsedSettings.soundEffectsEnabled ?? defaultSettings.soundEffectsEnabled,
        darkMode: parsedSettings.darkMode ?? defaultSettings.darkMode,
      });
    }
  }, []);

  const updateSetting = (key: keyof GameSettings, value: any) => {
    audioManager.playButtonClickSound();
    setSettings((prev) => {
      const next = { ...prev, [key]: value } as GameSettings;
      const persisted = {
        soundEffectsEnabled: next.soundEffectsEnabled,
        darkMode: next.darkMode,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(persisted));
      return next;
    });
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