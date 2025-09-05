'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsConfig } from '@/lib/settings-config';
import { settingsService } from '@/services/settings.service';
import { SettingsData, SettingTab as SettingTabType } from '@/types/settings';
import SettingTab from '@/components/admin/settings/SettingTab';
import SettingsManager from '@/components/admin/settings/SettingsManager';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('system');
    const [settings, setSettings] = useState<SettingsData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [configTabs, setConfigTabs] = useState<SettingTabType[]>(settingsConfig.tabs);

    const tabs = configTabs;

    // Load settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const loadedSettings = await settingsService.loadSettings();
            setSettings(loadedSettings);
        } catch (error) {
            console.error('Error loading settings:', error);
            setMessage({ type: 'error', text: 'Không thể tải cài đặt' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettingChange = (tabId: string, sectionId: string, fieldId: string, value: any) => {
        const newSettings = settingsService.setSetting(settings, tabId, sectionId, fieldId, value);
        setSettings(newSettings);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setMessage(null);

            // Validate settings
            const validation = settingsService.validateSettings(settings);
            if (!validation.isValid) {
                setMessage({ type: 'error', text: validation.errors.join(', ') });
                return;
            }

            // Save settings
            await settingsService.saveSettings(settings);
            setMessage({ type: 'success', text: 'Cài đặt đã được lưu thành công!' });

            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Không thể lưu cài đặt' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = () => {
        try {
            const exportData = settingsService.exportSettings(settings);
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `f-learning-settings-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể export cài đặt' });
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedSettings = settingsService.importSettings(content);
                setSettings(importedSettings);
                setMessage({ type: 'success', text: 'Import cài đặt thành công!' });
            } catch (error) {
                setMessage({ type: 'error', text: (error as Error).message });
            }
        };
        reader.readAsText(file);
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải cài đặt...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                            Dashboard
                        </Link>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Cài đặt</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            ⚙️ Cài đặt Hệ thống
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và cấu hình các thiết lập cho hệ thống F-Learning
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 lg:mt-0">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                            id="import-settings"
                        />
                        <label
                            htmlFor="import-settings"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                            📥 Import
                        </label>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            📤 Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation - Desktop */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Danh mục cài đặt</h3>
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-50 border-transparent'
                                            } w-full text-left px-3 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 flex items-center gap-3`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Mobile Tab Navigation */}
                <div className="lg:hidden">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {tabs.map((tab) => (
                                <option key={tab.id} value={tab.id}>
                                    {tab.icon} {tab.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="p-6">
                            {tabs.map((tab) => (
                                activeTab === tab.id && (
                                    <SettingTab
                                        key={tab.id}
                                        tab={tab}
                                        settings={settings}
                                        onSettingChange={handleSettingChange}
                                        onSave={handleSave}
                                        isSaving={isSaving}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Manager */}
            <SettingsManager
                currentConfig={configTabs}
                onConfigChange={setConfigTabs}
            />
        </div>
    );
}