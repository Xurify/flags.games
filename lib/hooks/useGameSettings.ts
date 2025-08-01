import { useState, useEffect } from 'react';
import { SETTINGS_STORAGE_KEY } from '../constants';

export interface GameSettings {
  soundEffectsEnabled: boolean;
  autoAdvanceEnabled: boolean;
  darkMode: boolean;
}

const defaultSettings: GameSettings = {
  soundEffectsEnabled: true,
  autoAdvanceEnabled: true,
  darkMode: false
};

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

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
        darkMode: parsedSettings.darkMode ?? defaultSettings.darkMode
      });
    }
  }, []);

  const updateSetting = (key: keyof GameSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  };

  return { settings, updateSetting };
};
