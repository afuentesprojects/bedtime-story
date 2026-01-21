import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
  language: string;
  defaultLength: string;
  selectedThemes: string[];
  selectedTopics: string[];
  customTheme: string;
  customTopic: string;
  childName: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'English',
  defaultLength: '5 minutes',
  selectedThemes: [],
  selectedTopics: [],
  customTheme: '',
  customTopic: '',
  childName: '',
};

const STORAGE_KEY = 'bedtime_story_settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored) as UserSettings;
        // Merge with defaults to handle new settings keys
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: UserSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      setError(null);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    }
  };

  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  const resetSettings = async () => {
    await saveSettings(DEFAULT_SETTINGS);
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSettings(DEFAULT_SETTINGS);
      setError(null);
    } catch (err) {
      console.error('Error clearing settings:', err);
      setError('Failed to clear settings');
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    resetSettings,
    clearStorage,
    saveSettings,
  };
}