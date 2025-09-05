'use client';

import { SettingTab as SettingTabType, SettingsData } from '@/types/settings';
import SettingSection from './SettingSection';

interface SettingTabProps {
    tab: SettingTabType;
    settings: SettingsData;
    onSettingChange: (tabId: string, sectionId: string, fieldId: string, value: any) => void;
    onSave: () => void;
    isSaving: boolean;
}

export default function SettingTab({
    tab,
    settings,
    onSettingChange,
    onSave,
    isSaving
}: SettingTabProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {tab.icon} {tab.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Quản lý cài đặt {tab.name.toLowerCase()}
                    </p>
                </div>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>

            <div className="space-y-6">
                {tab.sections.map((section) => (
                    <SettingSection
                        key={section.id}
                        section={section}
                        tabId={tab.id}
                        settings={settings}
                        onSettingChange={onSettingChange}
                    />
                ))}
            </div>
        </div>
    );
}