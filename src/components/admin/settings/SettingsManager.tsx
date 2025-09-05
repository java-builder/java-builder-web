'use client';

import { useState } from 'react';
import { SettingTab, SettingSection, SettingField } from '@/types/settings';

interface SettingsManagerProps {
    onConfigChange: (newConfig: SettingTab[]) => void;
    currentConfig: SettingTab[];
}

export default function SettingsManager({ onConfigChange, currentConfig }: SettingsManagerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const addNewTab = () => {
        const newTab: SettingTab = {
            id: `custom-${Date.now()}`,
            name: 'Tab mới',
            icon: '⚙️',
            sections: []
        };

        onConfigChange([...currentConfig, newTab]);
    };

    const addNewSection = (tabId: string) => {
        const newSection: SettingSection = {
            id: `section-${Date.now()}`,
            title: 'Section mới',
            fields: []
        };

        const updatedConfig = currentConfig.map(tab =>
            tab.id === tabId
                ? { ...tab, sections: [...tab.sections, newSection] }
                : tab
        );

        onConfigChange(updatedConfig);
    };

    const addNewField = (tabId: string, sectionId: string) => {
        const newField: SettingField = {
            id: `field-${Date.now()}`,
            type: 'text',
            label: 'Field mới',
            defaultValue: ''
        };

        const updatedConfig = currentConfig.map(tab =>
            tab.id === tabId
                ? {
                    ...tab,
                    sections: tab.sections.map(section =>
                        section.id === sectionId
                            ? { ...section, fields: [...section.fields, newField] }
                            : section
                    )
                }
                : tab
        );

        onConfigChange(updatedConfig);
    };

    const deleteTab = (tabId: string) => {
        const updatedConfig = currentConfig.filter(tab => tab.id !== tabId);
        onConfigChange(updatedConfig);
    };

    const deleteSection = (tabId: string, sectionId: string) => {
        const updatedConfig = currentConfig.map(tab =>
            tab.id === tabId
                ? {
                    ...tab,
                    sections: tab.sections.filter(section => section.id !== sectionId)
                }
                : tab
        );

        onConfigChange(updatedConfig);
    };

    const deleteField = (tabId: string, sectionId: string, fieldId: string) => {
        const updatedConfig = currentConfig.map(tab =>
            tab.id === tabId
                ? {
                    ...tab,
                    sections: tab.sections.map(section =>
                        section.id === sectionId
                            ? { ...section, fields: section.fields.filter(field => field.id !== fieldId) }
                            : section
                    )
                }
                : tab
        );

        onConfigChange(updatedConfig);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50"
                title="Quản lý cấu hình Settings"
            >
                ⚙️
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Quản lý cấu hình Settings
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {currentConfig.map((tab) => (
                            <div key={tab.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{tab.icon}</span>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{tab.name}</h3>
                                            <p className="text-sm text-gray-500">ID: {tab.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => addNewSection(tab.id)}
                                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                        >
                                            + Section
                                        </button>
                                        <button
                                            onClick={() => deleteTab(tab.id)}
                                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        >
                                            Xóa Tab
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 ml-8">
                                    {tab.sections.map((section) => (
                                        <div key={section.id} className="border-l-2 border-gray-200 pl-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{section.title}</h4>
                                                    <p className="text-xs text-gray-500">ID: {section.id}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => addNewField(tab.id, section.id)}
                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                    >
                                                        + Field
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSection(tab.id, section.id)}
                                                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2 ml-4">
                                                {section.fields.map((field) => (
                                                    <div key={field.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                                {field.type}
                                                            </span>
                                                            <span className="text-sm">{field.label}</span>
                                                            <span className="text-xs text-gray-500">({field.id})</span>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteField(tab.id, section.id, field.id)}
                                                            className="text-red-600 hover:text-red-800 text-xs"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addNewTab}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors duration-200"
                        >
                            + Thêm Tab mới
                        </button>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => {
                                // Export config to console for development
                                console.log('Current config:', JSON.stringify(currentConfig, null, 2));
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}