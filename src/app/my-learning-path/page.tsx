'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { LearningPathService } from '@/services/learning-path.service';
import {
    LearningPathDetailResponse,
    LessonDetailResponse,
    ExerciseDetailResponse,
    QuizItemDetailResponse,
    KeyConceptDetailResponse,
    GuideStepDetailResponse,
} from '@/types/learning-path';

export default function MyLearningPathPage() {
    const [learningPaths, setLearningPaths] = useState<LearningPathDetailResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPath, setSelectedPath] = useState<LearningPathDetailResponse | null>(null);
    const [expandedContent, setExpandedContent] = useState<{ [key: string]: string | null }>({});
    const [selectedLesson, setSelectedLesson] = useState<(LessonDetailResponse & { topicTitle: string }) | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<(ExerciseDetailResponse & { topicTitle: string }) | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<(QuizItemDetailResponse & { topicTitle: string }) | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: string }>({});
    const [submittedQuizzes, setSubmittedQuizzes] = useState<{ [quizId: string]: boolean }>({});
    const [showQuizExplanations, setShowQuizExplanations] = useState<{ [quizId: string]: boolean }>({});

    useEffect(() => {
        loadLearningPaths();
    }, []);

    const loadLearningPaths = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await LearningPathService.getUserLearningPaths();

            if (response.code === 200 && response.result) {
                setLearningPaths(response.result);
            } else {
                throw new Error('Không thể tải danh sách lộ trình học tập.');
            }
        } catch (err) {
            console.error('Error loading learning paths:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi tải danh sách lộ trình.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa lộ trình này?')) return;

        try {
            await LearningPathService.deleteLearningPath(id);
            setLearningPaths(prev => prev.filter(path => path.id !== id));
            setSelectedPath(null);
        } catch {
            alert('Không thể xóa lộ trình. Vui lòng thử lại.');
        }
    };

    const handleViewDetails = (path: LearningPathDetailResponse) => {
        console.log('handleViewDetails called with:', path);
        console.log('Path periods:', path.learningPathPlan?.periods);
        setSelectedPath(path);
        setExpandedContent({});
        console.log('selectedPath state updated');
    };

    const toggleContentSection = (topicId: string, contentType: 'lessons' | 'exercises' | 'quizzes') => {
        const key = `${topicId}-${contentType}`;
        setExpandedContent(prev => ({
            ...prev,
            [key]: prev[key] ? null : contentType
        }));
    };

    const handleLessonClick = (lesson: LessonDetailResponse, topicTitle: string) => {
        setSelectedLesson({ ...lesson, topicTitle });
    };

    const handleExerciseClick = (exercise: ExerciseDetailResponse, topicTitle: string) => {
        setSelectedExercise({ ...exercise, topicTitle });
    };

    const handleQuizClick = (quiz: QuizItemDetailResponse, topicTitle: string) => {
        setSelectedQuiz({ ...quiz, topicTitle });
    };

    const closeDetailView = () => {
        setSelectedLesson(null);
        setSelectedExercise(null);
        setSelectedQuiz(null);
    };

    const handleQuizAnswerSelect = (quizId: string, answer: string) => {
        setQuizAnswers(prev => ({ ...prev, [quizId]: answer }));
    };

    const submitQuiz = (quizId: string) => {
        setSubmittedQuizzes(prev => ({ ...prev, [quizId]: true }));
        setShowQuizExplanations(prev => ({ ...prev, [quizId]: true }));
    };

    const resetQuiz = (quizId: string) => {
        setQuizAnswers(prev => { const newState = { ...prev }; delete newState[quizId]; return newState; });
        setShowQuizExplanations(prev => { const newState = { ...prev }; delete newState[quizId]; return newState; });
        setSubmittedQuizzes(prev => { const newState = { ...prev }; delete newState[quizId]; return newState; });
    };

    const getTimeUnitText = (timeUnit: string) => {
        switch (timeUnit) {
            case 'DAY': return 'ngày';
            case 'WEEK': return 'tuần';
            case 'MONTH': return 'tháng';
            case 'YEAR': return 'năm';
            default: return timeUnit.toLowerCase();
        }
    };

    // removed unused formatDate

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100">
            <Header />

            {/* Simple Header */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎯</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Lộ trình học tập của tôi
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Quản lý và theo dõi tiến độ các lộ trình học tập đã tạo
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Đang tải lộ trình học tập</h3>
                        <p className="text-gray-600">Vui lòng đợi một chút...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <div className="text-red-600 text-4xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-red-900 mb-2">Có lỗi xảy ra</h3>
                            <p className="text-red-700 mb-4">{error}</p>
                            <button
                                onClick={loadLearningPaths}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && learningPaths.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">📚</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Bắt đầu hành trình học tập!
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                            Tạo lộ trình học tập đầu tiên và khám phá thế giới kiến thức rộng lớn đang chờ đón bạn
                        </p>
                        <Link
                            href="/create-learning-path"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Tạo lộ trình đầu tiên</span>
                        </Link>
                    </div>
                )}

                {/* Simple Learning Paths List */}
                {!isLoading && !error && learningPaths.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">Hiển thị {learningPaths.length} lộ trình học tập</p>
                        </div>

                        {learningPaths.map((path) => (
                            <div key={path.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                                {/* Card Header */}
                                <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                                {path.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span>⏱️</span>
                                                    <span>{path.duration} {getTimeUnitText(path.timeUnit)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>📚</span>
                                                    <span>{path.periods?.length || 0} giai đoạn</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(path.id)}
                                            className="ml-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                            title="Xóa lộ trình"
                                        >
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                                            <span className="text-sm font-bold text-emerald-600">0%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>

                                    {/* Periods Preview */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Các giai đoạn học tập:</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {path.periods?.slice(0, 6).map((period, periodIndex) => (
                                                <div key={period.id || periodIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                        {period.periodNumber}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate" title={period.title}>
                                                            {period.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {period.topics?.length || 0} chủ đề
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {(path.periods?.length || 0) > 6 && (
                                                <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-500 text-sm">
                                                    +{(path.periods?.length || 0) - 6} giai đoạn khác
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handleViewDetails(path)}
                                            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Xem chi tiết
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                            </svg>
                                            Tiếp tục học
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedPath && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="flex-shrink-0 p-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{selectedPath.title}</h3>
                                        <div className="flex items-center gap-4 text-white/90 text-sm">
                                            <span>⏱️ {selectedPath.duration} {getTimeUnitText(selectedPath.timeUnit)}</span>
                                            <span>📚 {selectedPath.periods?.length || 0} giai đoạn</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPath(null)}
                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    {selectedPath.periods?.map((period) => (
                                        <div key={period.id || period.periodNumber} className="bg-gray-50 rounded-xl p-5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                                    {period.periodNumber}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">{period.title}</h4>
                                                    <p className="text-sm text-gray-600">{period.topics?.length || 0} chủ đề học tập</p>
                                                </div>
                                            </div>

                                            {period.topics && period.topics.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {period.topics.map((topic, topicIndex) => {
                                                        const topicKey = topic.id || `${period.periodNumber}-${topicIndex}`;
                                                        return (
                                                            <div key={topicKey} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 transition-colors">
                                                                <h5 className="font-bold text-gray-900 mb-3 text-sm leading-tight">{topic.title}</h5>
                                                                <div className="space-y-2">
                                                                    {/* Bài học */}
                                                                    <div>
                                                                        <button
                                                                            onClick={() => toggleContentSection(topicKey, 'lessons')}
                                                                            className="w-full flex items-center justify-between text-xs hover:bg-blue-50 p-2 rounded transition-colors"
                                                                        >
                                                                            <span className="flex items-center gap-1 text-blue-600">
                                                                                <span>📖</span> Bài học
                                                                            </span>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="font-bold">{topic.lessons?.length || 0}</span>
                                                                                <svg className={`w-3 h-3 text-blue-600 transition-transform ${expandedContent[`${topicKey}-lessons`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                            </div>
                                                                        </button>
                                                                        {expandedContent[`${topicKey}-lessons`] && topic.lessons && topic.lessons.length > 0 && (
                                                                            <div className="mt-2 pl-4 space-y-1">
                                                                                {topic.lessons.map((lesson, lessonIndex) => (
                                                                                    <button
                                                                                        key={lessonIndex}
                                                                                        onClick={() => handleLessonClick(lesson, topic.title)}
                                                                                        className="w-full text-left text-xs p-2 bg-blue-50 hover:bg-blue-100 rounded border-l-2 border-blue-300 transition-colors cursor-pointer"
                                                                                    >
                                                                                        <div className="font-medium text-blue-900">{lesson.name || `Bài học ${lessonIndex + 1}`}</div>
                                                                                        {lesson.explanation && (
                                                                                            <div className="text-blue-700 mt-1">{lesson.explanation.substring(0, 80)}{lesson.explanation.length > 80 ? '...' : ''}</div>
                                                                                        )}
                                                                                        <div className="flex items-center justify-between mt-2">
                                                                                            <span className="text-blue-600 text-xs">Nhấn để xem chi tiết</span>
                                                                                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Bài tập */}
                                                                    <div>
                                                                        <button
                                                                            onClick={() => toggleContentSection(topicKey, 'exercises')}
                                                                            className="w-full flex items-center justify-between text-xs hover:bg-orange-50 p-2 rounded transition-colors"
                                                                        >
                                                                            <span className="flex items-center gap-1 text-orange-600">
                                                                                <span>💪</span> Bài tập
                                                                            </span>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="font-bold">{topic.exercises?.length || 0}</span>
                                                                                <svg className={`w-3 h-3 text-orange-600 transition-transform ${expandedContent[`${topicKey}-exercises`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                            </div>
                                                                        </button>
                                                                        {expandedContent[`${topicKey}-exercises`] && topic.exercises && topic.exercises.length > 0 && (
                                                                            <div className="mt-2 pl-4 space-y-1">
                                                                                {topic.exercises.map((exercise, exerciseIndex) => (
                                                                                    <div key={exerciseIndex} className="text-xs p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                                                                                        <div className="font-medium text-orange-900">{exercise.title || `Bài tập ${exerciseIndex + 1}`}</div>
                                                                                        <div className="text-orange-700 mt-1 text-xs">
                                                                                            Loại: {exercise.type || 'Thực hành'} • {exercise.instructions?.length || 0} bước
                                                                                        </div>
                                                                                        <div className="mt-2 flex gap-2">
                                                                                            <button
                                                                                                onClick={() => handleExerciseClick(exercise, topic.title)}
                                                                                                className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                                                                                            >
                                                                                                Xem chi tiết
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Câu hỏi */}
                                                                    <div>
                                                                        <button
                                                                            onClick={() => toggleContentSection(topicKey, 'quizzes')}
                                                                            className="w-full flex items-center justify-between text-xs hover:bg-purple-50 p-2 rounded transition-colors"
                                                                        >
                                                                            <span className="flex items-center gap-1 text-purple-600">
                                                                                <span>🧠</span> Câu hỏi
                                                                            </span>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="font-bold">{topic.quizzes?.length || 0}</span>
                                                                                <svg className={`w-3 h-3 text-purple-600 transition-transform ${expandedContent[`${topicKey}-quizzes`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                            </div>
                                                                        </button>
                                                                        {expandedContent[`${topicKey}-quizzes`] && topic.quizzes && topic.quizzes.length > 0 && (
                                                                            <div className="mt-2 pl-4 space-y-1">
                                                                                {topic.quizzes.map((quiz, quizIndex) => (
                                                                                    <div key={quizIndex} className="text-xs p-2 bg-purple-50 rounded border-l-2 border-purple-300">
                                                                                        <div className="font-medium text-purple-900">{quiz.question || `Câu hỏi ${quizIndex + 1}`}</div>
                                                                                        <div className="text-purple-700 mt-1 text-xs">
                                                                                            {quiz.options?.length || 0} lựa chọn
                                                                                        </div>
                                                                                        <div className="mt-2 flex gap-2">
                                                                                            <button
                                                                                                onClick={() => handleQuizClick(quiz, topic.title)}
                                                                                                className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                                                                                            >
                                                                                                Xem chi tiết
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )) || (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">Không tìm thấy dữ liệu giai đoạn</p>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Modal Footer - Fixed */}
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setSelectedPath(null)}
                                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                    >
                                        Đóng
                                    </button>
                                    <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
                                        Bắt đầu học ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Lesson Modal */}
                {selectedLesson && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                            {/* Lesson Header */}
                            <div className="flex-shrink-0 p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{selectedLesson.name || 'Bài học'}</h3>
                                        <p className="text-blue-100">Chủ đề: {selectedLesson.topicTitle}</p>
                                    </div>
                                    <button
                                        onClick={closeDetailView}
                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Lesson Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    {selectedLesson.explanation && (
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                <span>📚</span> Giải thích bài học
                                            </h4>
                                            <div className="text-blue-800 whitespace-pre-line leading-relaxed">{String(selectedLesson.explanation || '')}</div>
                                        </div>
                                    )}

                                    {selectedLesson.keywords && selectedLesson.keywords.length > 0 && (
                                        <div className="bg-yellow-50 rounded-xl p-4">
                                            <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                                                <span>🔑</span> Khái niệm chính
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedLesson.keywords.map((keyword: KeyConceptDetailResponse, index: number) => (
                                                    <div key={keyword.id || index} className="bg-yellow-100 rounded-lg p-3 border-l-4 border-yellow-400">
                                                        <h5 className="font-semibold text-yellow-900 mb-1">{keyword.term}</h5>
                                                        <p className="text-yellow-800 text-sm">{keyword.explanation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lesson Footer */}
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={closeDetailView}
                                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                    >
                                        Đóng
                                    </button>
                                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                        Hoàn thành bài học
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Exercise Modal */}
                {selectedExercise && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                            {/* Exercise Header */}
                            <div className="flex-shrink-0 p-6 bg-gradient-to-r from-orange-500 to-red-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{selectedExercise.title || 'Bài tập'}</h3>
                                        <p className="text-orange-100">Chủ đề: {selectedExercise.topicTitle}</p>
                                    </div>
                                    <button
                                        onClick={closeDetailView}
                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Exercise Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    <div className="bg-orange-50 rounded-xl p-4">
                                        <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                            <span>📝</span> Bài tập: {selectedExercise.title}
                                        </h4>
                                        <div className="text-orange-800">
                                            <p className="mb-2"><strong>Loại:</strong> {selectedExercise.type}</p>
                                        </div>
                                    </div>

                                    {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                <span>📝</span> Hướng dẫn thực hiện
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedExercise.instructions
                                                    .sort((a: GuideStepDetailResponse, b: GuideStepDetailResponse) => a.stepNumber - b.stepNumber)
                                                    .map((step: GuideStepDetailResponse, index: number) => (
                                                        <div key={step.id || index} className="bg-blue-100 rounded-lg p-4 border-l-4 border-blue-400">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                                    {step.stepNumber}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-blue-900 mb-2">{step.description}</p>
                                                                    {step.command && (
                                                                        <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-sm mb-2">
                                                                            <span className="text-gray-500">$ </span>{step.command}
                                                                        </div>
                                                                    )}
                                                                    {step.codeBlock && (
                                                                        <div className="bg-gray-800 text-gray-300 p-3 rounded font-mono text-sm overflow-x-auto">
                                                                            <pre className="whitespace-pre-wrap">{step.codeBlock}</pre>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Exercise Footer */}
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={closeDetailView}
                                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                    >
                                        Đóng
                                    </button>
                                    <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors">
                                        Bắt đầu làm bài
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Quiz Modal */}
                {selectedQuiz && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Quiz Header */}
                            <div className="flex-shrink-0 p-4 bg-gradient-to-r from-purple-500 to-indigo-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{selectedQuiz.question || 'Câu hỏi'}</h3>
                                        <p className="text-purple-100 text-sm">Chủ đề: {selectedQuiz.topicTitle}</p>
                                    </div>
                                    <button
                                        onClick={closeDetailView}
                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Quiz Content */}
                            <div className="flex-1 p-4 overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="bg-purple-50 rounded-lg p-3">
                                        <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                            <span>🧠</span> Câu hỏi
                                        </h4>
                                        <div className="text-purple-800 text-base font-medium whitespace-pre-line">{String(selectedQuiz.question || '')}</div>
                                    </div>

                                    {selectedQuiz.options && selectedQuiz.options.length > 0 && (
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <span>📃</span> Các lựa chọn
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedQuiz.options.map((option: { label: string, option: string }, index: number) => {
                                                    const isCorrect = option.label === selectedQuiz.correctAnswer;
                                                    const isSelected = quizAnswers[selectedQuiz.id] === option.label;
                                                    const showFeedback = submittedQuizzes[selectedQuiz.id] && showQuizExplanations[selectedQuiz.id];
                                                    const isSubmitted = submittedQuizzes[selectedQuiz.id];

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => !isSubmitted && handleQuizAnswerSelect(selectedQuiz.id, option.label)}
                                                            className={`w-full flex items-start gap-2 p-2.5 border rounded-lg transition-all duration-200 ${showFeedback
                                                                ? isCorrect
                                                                    ? 'border-green-300 bg-green-50/30'
                                                                    : isSelected
                                                                        ? 'border-red-300 bg-red-50/30'
                                                                        : 'border-gray-200 bg-white'
                                                                : isSelected
                                                                    ? 'border-purple-300 bg-purple-50/30'
                                                                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 cursor-pointer'
                                                                }`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${showFeedback
                                                                ? isCorrect
                                                                    ? 'border-green-500 bg-green-500 text-white'
                                                                    : isSelected
                                                                        ? 'border-red-500 bg-red-500 text-white'
                                                                        : 'border-gray-300 text-gray-600'
                                                                : isSelected
                                                                    ? 'border-purple-500 bg-purple-500 text-white'
                                                                    : 'border-gray-300 text-gray-600'
                                                                }`}>
                                                                {option.label}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900 text-left text-sm">
                                                                    {option.option}
                                                                </div>
                                                                {showFeedback && isCorrect && (
                                                                    <div className="text-sm text-green-700 mt-1">✅ Đáp án đúng</div>
                                                                )}
                                                                {showFeedback && isSelected && !isCorrect && (
                                                                    <div className="text-sm text-red-700 mt-1">❌ Sai rồi</div>
                                                                )}
                                                            </div>
                                                            {/* Result Icon */}
                                                            {showFeedback && (
                                                                <div className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5">
                                                                    {isCorrect ? (
                                                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    ) : isSelected ? (
                                                                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {submittedQuizzes[selectedQuiz.id] && showQuizExplanations[selectedQuiz.id] && selectedQuiz.correctAnswer && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-green-900 font-medium text-sm">Đáp án đúng: {selectedQuiz.correctAnswer}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {submittedQuizzes[selectedQuiz.id] && showQuizExplanations[selectedQuiz.id] && selectedQuiz.explanation && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                                            <div className="flex items-start gap-2">
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">💡</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-blue-900 font-medium text-sm mb-1">Giải thích</div>
                                                    <div className="text-blue-800 whitespace-pre-line text-sm">{String(selectedQuiz.explanation || '')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quiz Footer */}
                            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                                {submittedQuizzes[selectedQuiz.id] && showQuizExplanations[selectedQuiz.id] && (
                                    <div className="mb-3 p-2.5 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {quizAnswers[selectedQuiz.id] === selectedQuiz.correctAnswer ? (
                                                    <>
                                                        <span className="text-green-600">✅</span>
                                                        <span className="text-green-800 font-medium text-sm">Chính xác!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-red-600">❌</span>
                                                        <span className="text-red-800 font-medium text-sm">Câu trả lời chưa đúng. Đáp án đúng là: {selectedQuiz.correctAnswer}</span>
                                                    </>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => resetQuiz(selectedQuiz.id)}
                                                className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                            >
                                                Thử lại
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={closeDetailView}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                                    >
                                        Đóng
                                    </button>
                                    {!submittedQuizzes[selectedQuiz.id] && (
                                        <button
                                            onClick={() => quizAnswers[selectedQuiz.id] && submitQuiz(selectedQuiz.id)}
                                            disabled={!quizAnswers[selectedQuiz.id]}
                                            className={`px-4 py-2 font-medium rounded-lg transition-colors text-sm ${quizAnswers[selectedQuiz.id]
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            Nộp bài
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
