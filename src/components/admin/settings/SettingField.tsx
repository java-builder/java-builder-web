'use client';

import { SettingField as SettingFieldType } from '@/types/settings';

interface SettingFieldProps {
    field: SettingFieldType;
    value: any;
    onChange: (value: any) => void;
}

export default function SettingField({ field, value, onChange }: SettingFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let newValue: any = e.target.value;

        if (field.type === 'number') {
            newValue = Number(newValue);
        } else if (field.type === 'toggle') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        onChange(newValue);
    };

    const renderField = () => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
                return (
                    <input
                        type={field.type}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.validation?.min}
                        max={field.validation?.max}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Chọn...</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'toggle':
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                );

            case 'file':
                return (
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                // In a real app, you'd upload the file and get a URL
                                onChange(file.name);
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {renderField()}

            {field.description && (
                <p className="text-xs text-gray-500">{field.description}</p>
            )}
        </div>
    );
}