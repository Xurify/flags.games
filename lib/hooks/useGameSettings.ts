import { useState, useEffect } from 'react';

export interface GameSettings {
  soundEffects: boolean;
  autoAdvance: boolean;
  darkMode: boolean;
}

const defaultSettings: GameSettings = {
  soundEffects: true,
  autoAdvance: true,
  darkMode: false
};

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('flagGameSettings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings({
        soundEffects: parsedSettings.soundEffects ?? defaultSettings.soundEffects,
        autoAdvance: parsedSettings.autoAdvance ?? defaultSettings.autoAdvance,
        darkMode: parsedSettings.darkMode ?? defaultSettings.darkMode
      });
    }
  }, []);

  const updateSetting = (key: keyof GameSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('flagGameSettings', JSON.stringify(newSettings));
  };

  return { settings, updateSetting };
};
