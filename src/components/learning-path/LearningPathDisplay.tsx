'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LearningPathPlan } from '@/types/learning-path';
import { LearningPathService } from '@/services/learning-path.service';

interface LearningPathDisplayProps {
    learningPath: LearningPathPlan;
    answer: string;
    onCreateNew?: () => void;
    onStartLearning?: () => void;
}

export default function LearningPathDisplay({ learningPath, answer, onCreateNew, onStartLearning }: LearningPathDisplayProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Local progress states (UI only)
    type ItemStatus = 'todo' | 'progress' | 'done';


    const getTimeUnitText = (timeUnit: string) => {
        switch (timeUnit) {
            case 'DAY': return 'ngày';
            case 'WEEK': return 'tuần';
            case 'MONTH': return 'tháng';
            case 'YEAR': return 'năm';
            default: return timeUnit.toLowerCase();
        }
    };

    const handleStartLearning = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            // Call the save API
            const response = await LearningPathService.saveLearningPath({
                learningPathPlan: learningPath
            });

            if (response.code === 200) {
                setSaveSuccess(true);

                // Call the optional callback if provided
                if (onStartLearning) {
                    onStartLearning();
                }

                // Show success message briefly then redirect
                setTimeout(() => {
                    setSaveSuccess(false);
                    // Redirect to my learning paths page
                    router.push('/my-learning-path');
                }, 2000);
            } else {
                throw new Error('Không thể lưu lộ trình học tập.');
            }
        } catch (error) {
            console.error('Error saving learning path:', error);
            setSaveError(
                error instanceof Error
                    ? error.message
                    : 'Có lỗi xảy ra khi lưu lộ trình. Vui lòng thử lại.'
            );
        } finally {
            setIsSaving(false);
        }
    };


    if (!learningPath) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {learningPath.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">⏱️</span>
                                <span>{learningPath.duration} {getTimeUnitText(learningPath.timeUnit)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">📚</span>
                                <span>{learningPath.periods?.length || 0} giai đoạn</span>
                            </div>
                        </div>

                        {answer && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left max-w-4xl mx-auto mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">AI</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{answer}</p>
                                </div>
                            </div>
                        )}

                        {/* Success/Error Messages */}
                        {saveSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-4xl mx-auto mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-green-500">✓</span>
                                    <p className="text-green-800 font-medium">Lộ trình học tập đã được lưu thành công!</p>
                                </div>
                            </div>
                        )}

                        {saveError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-4xl mx-auto mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-red-500">⚠️</span>
                                    <div>
                                        <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
                                        <p className="text-red-700 text-sm">{saveError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-4">
                            {onCreateNew && (
                                <button
                                    onClick={onCreateNew}
                                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-full transition-colors shadow-md hover:shadow-lg cursor-pointer"
                                >
                                    Tạo lộ trình mới
                                </button>
                            )}
                            <button
                                onClick={handleStartLearning}
                                disabled={isSaving || saveSuccess}
                                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang lưu...
                                    </>
                                ) : (
                                    'Lưu lộ trình'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Path Content */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="space-y-6">
                    {learningPath.periods && learningPath.periods.length > 0 ? (
                        learningPath.periods.map((period) => (
                            <div key={period.periodNumber} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {/* Period Header */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {period.periodNumber}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{period.title}</h2>
                                            <p className="text-sm text-gray-600">{period.topics?.length || 0} chủ đề</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Period Content */}
                                <div className="p-6">
                                    {period.topics && period.topics.length > 0 ? (
                                        <div className="space-y-4">
                                            {period.topics.map((topic, topicIndex) => (
                                                <div key={`${period.periodNumber}-${topicIndex}`} className="border border-gray-200 rounded-lg">
                                                    {/* Topic Header */}
                                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 border-b border-orange-200">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{topic.title}</h3>
                                                        {topic.explanation && (
                                                            <p className="text-sm text-gray-600">{topic.explanation}</p>
                                                        )}
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                                                            {topic.lessons && topic.lessons.length > 0 && (
                                                                <span className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                                                    <span>📖</span>
                                                                    <span>{topic.lessons.length} bài học</span>
                                                                </span>
                                                            )}
                                                            {topic.exercises && topic.exercises.length > 0 && (
                                                                <span className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                                                    <span>💪</span>
                                                                    <span>{topic.exercises.length} bài tập</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Lessons */}
                                                    {topic.lessons && topic.lessons.length > 0 && (
                                                        <div className="p-4 bg-orange-50/30">
                                                            <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                                                <span className="text-orange-600">📖</span>
                                                                <span>Bài học</span>
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {topic.lessons.map((lesson, lessonIndex) => (
                                                                    <div key={`${period.periodNumber}-${topicIndex}-lesson-${lessonIndex}`} className="bg-white border-l-4 border-orange-400 rounded-r p-3 shadow-sm">
                                                                        <h5 className="font-medium text-gray-900 mb-2">{lesson.name}</h5>
                                                                        <p className="text-gray-600 text-sm mb-3">{lesson.explanation}</p>
                                                                        {lesson.keywords && lesson.keywords.length > 0 && (
                                                                            <div>
                                                                                <h6 className="font-medium text-orange-700 text-sm mb-2">Khái niệm chính:</h6>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                    {lesson.keywords.map((keyword, keywordIndex) => (
                                                                                        <div key={keywordIndex} className="p-2 bg-orange-50 border border-orange-200 rounded">
                                                                                            <div className="font-medium text-orange-900 text-sm">{keyword.term}</div>
                                                                                            <div className="text-orange-700 text-xs mt-1">{keyword.explanation}</div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Exercises */}
                                                    {topic.exercises && topic.exercises.length > 0 && (
                                                        <div className="p-4 bg-orange-50/30 border-t border-orange-200">
                                                            <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                                                <span className="text-orange-600">💪</span>
                                                                <span>Bài tập thực hành</span>
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {topic.exercises.map((exercise, exerciseIndex) => (
                                                                    <div key={`${period.periodNumber}-${topicIndex}-exercise-${exerciseIndex}`} className="bg-white border-l-4 border-orange-400 rounded-r p-3 shadow-sm">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <h5 className="font-medium text-gray-900">{exercise.title}</h5>
                                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                                                                {exercise.type}
                                                                            </span>
                                                                        </div>
                                                                        {exercise.instructions && exercise.instructions.length > 0 && (
                                                                            <div>
                                                                                <h6 className="font-medium text-orange-700 text-sm mb-2">Hướng dẫn thực hiện:</h6>
                                                                                <div className="space-y-2">
                                                                                    {exercise.instructions.map((step, stepIndex) => (
                                                                                        <div key={stepIndex} className="flex gap-3">
                                                                                            <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                                                                {step.stepNumber}
                                                                                            </div>
                                                                                            <div className="flex-1">
                                                                                                <p className="text-gray-700 text-sm">{step.description}</p>
                                                                                                {step.command && (
                                                                                                    <div className="mt-1 p-2 bg-orange-50 border border-orange-200 rounded font-mono text-xs">
                                                                                                        {step.command}
                                                                                                    </div>
                                                                                                )}
                                                                                                {step.codeBlock && (
                                                                                                    <div className="mt-1 p-2 bg-gray-900 text-gray-300 rounded font-mono text-xs overflow-x-auto">
                                                                                                        <pre>{step.codeBlock}</pre>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 py-8">
                                            Chưa có chủ đề nào cho giai đoạn này
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có giai đoạn học tập</h3>
                            <p className="text-gray-600">Lộ trình học tập chưa có giai đoạn nào được định nghĩa.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

