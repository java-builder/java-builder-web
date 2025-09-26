'use client';

import { useState, useEffect } from 'react';
import { SettingsData } from '@/types/settings';
import { settingsService } from '@/services/settings.service';

export function useSettings() {
    const [settings, setSettings] = useState<SettingsData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const loadedSettings = await settingsService.loadSettings();
            setSettings(loadedSettings);
        } catch (err) {
            setError('Không thể tải cài đặt');
            console.error('Error loading settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = async (tabId: string, sectionId: string, fieldId: string, value: unknown) => {
        try {
            const newSettings = settingsService.setSetting(settings, tabId, sectionId, fieldId, value);
            setSettings(newSettings);
            await settingsService.saveSettings(newSettings);
            return true;
        } catch (err) {
            setError('Không thể lưu cài đặt');
            console.error('Error updating setting:', err);
            return false;
        }
    };

    const getSetting = <T = unknown>(tabId: string, sectionId: string, fieldId: string, defaultValue?: T) => {
        return (settingsService.getSetting<T>(settings, tabId, sectionId, fieldId) ?? defaultValue) as T;
    };

    const resetSettings = async () => {
        try {
            localStorage.removeItem('f-learning-settings');
            await loadSettings();
            return true;
        } catch {
            setError('Không thể reset cài đặt');
            return false;
        }
    };

    return {
        settings,
        isLoading,
        error,
        getSetting,
        updateSetting,
        loadSettings,
        resetSettings
    };
}