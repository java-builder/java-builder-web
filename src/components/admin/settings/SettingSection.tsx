'use client';

import { SettingSection as SettingSectionType, SettingsData } from '@/types/settings';
import SettingField from './SettingField';
import { settingsService } from '@/services/settings.service';

interface SettingSectionProps {
    section: SettingSectionType;
    tabId: string;
    settings: SettingsData;
    onSettingChange: (tabId: string, sectionId: string, fieldId: string, value: any) => void;
}

export default function SettingSection({
    section,
    tabId,
    settings,
    onSettingChange
}: SettingSectionProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
            {section.description && (
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => {
                    const value = settingsService.getSetting(settings, tabId, section.id, field.id);

                    return (
                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <SettingField
                                field={field}
                                value={value}
                                onChange={(newValue) => onSettingChange(tabId, section.id, field.id, newValue)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}