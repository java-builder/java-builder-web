'use client';

import { useState } from 'react';

interface DateRangePickerProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function DateRangePicker({ value, onChange, disabled = false }: DateRangePickerProps) {
    const [showCustom, setShowCustom] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const presetRanges = [
        { value: '7days', label: '7 ngày qua', icon: '📅' },
        { value: '30days', label: '30 ngày qua', icon: '📆' },
        { value: '3months', label: '3 tháng qua', icon: '🗓️' },
        { value: '6months', label: '6 tháng qua', icon: '📊' },
        { value: '1year', label: '1 năm qua', icon: '📈' },
        { value: 'custom', label: 'Tùy chỉnh', icon: '⚙️' }
    ];

    const handlePresetChange = (newValue: string) => {
        if (newValue === 'custom') {
            setShowCustom(true);
        } else {
            setShowCustom(false);
            onChange(newValue);
        }
    };

    const handleCustomApply = () => {
        if (customStartDate && customEndDate) {
            onChange(`custom:${customStartDate}:${customEndDate}`);
            setShowCustom(false);
        }
    };

    const getCurrentLabel = () => {
        if (value.startsWith('custom:')) {
            const [, start, end] = value.split(':');
            return `${new Date(start).toLocaleDateString('vi-VN')} - ${new Date(end).toLocaleDateString('vi-VN')}`;
        }
        return presetRanges.find(range => range.value === value)?.label || '7 ngày qua';
    };

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                <select
                    value={value.startsWith('custom:') ? 'custom' : value}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    disabled={disabled}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {presetRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.icon} {range.label}
                        </option>
                    ))}
                </select>

                {value.startsWith('custom:') && (
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                        {getCurrentLabel()}
                    </div>
                )}
            </div>

            {/* Custom Date Range Modal */}
            {showCustom && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCustom(false)} />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Chọn khoảng thời gian tùy chỉnh</h4>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Từ ngày
                                    </label>
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Đến ngày
                                    </label>
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        min={customStartDate}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowCustom(false)}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCustomApply}
                                disabled={!customStartDate || !customEndDate}
                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}