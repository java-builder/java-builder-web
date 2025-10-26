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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ show: boolean; pathId: string | null }>({ show: false, pathId: null });

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
        setShowDeleteConfirm({ show: true, pathId: id });
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm.pathId) return;

        try {
            await LearningPathService.deleteLearningPath(showDeleteConfirm.pathId);
            setLearningPaths(prev => prev.filter(path => path.id !== showDeleteConfirm.pathId));
            setSelectedPath(null);
            setShowDeleteConfirm({ show: false, pathId: null });
        } catch {
            alert('Không thể xóa lộ trình. Vui lòng thử lại.');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm({ show: false, pathId: null });
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
        <div className="min-h-screen bg-white">
            <Header />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
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
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Tạo lộ trình đầu tiên</span>
                        </Link>
                    </div>
                )}

                {/* Learning Paths Grid */}
                {!isLoading && !error && learningPaths.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">Hiển thị {learningPaths.length} lộ trình học tập</p>
                        </div>

                        {/* Grid Layout for Multiple Learning Paths */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {learningPaths.map((path) => (
                                <div key={path.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 group flex flex-col h-full">
                                    {/* Card Header */}
                                    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-b border-gray-100">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                    {path.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{path.duration} {getTimeUnitText(path.timeUnit)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        <span>{path.periods?.length || 0} giai đoạn</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(path.id)}
                                                className="ml-3 w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                                title="Xóa lộ trình"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                                                <span className="text-sm font-semibold text-orange-600">0%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>

                                        {/* Periods Preview - Compact */}
                                        <div className="mb-4 flex-1">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Các giai đoạn:</h4>
                                            <div className="space-y-2">
                                                {path.periods?.slice(0, 3).map((period, periodIndex) => (
                                                    <div key={period.id || periodIndex} className="flex items-center gap-3 p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                                        <div className="w-6 h-6 bg-orange-500 text-white rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0">
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
                                                {(path.periods?.length || 0) > 3 && (
                                                    <div className="text-center py-2 text-gray-500 text-sm">
                                                        +{(path.periods?.length || 0) - 3} giai đoạn khác
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons - Always at bottom */}
                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleViewDetails(path)}
                                                className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-xs flex-1 cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span className="hidden sm:inline">Xem chi tiết</span>
                                                <span className="sm:hidden">Chi tiết</span>
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(path)}
                                                className="px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-xs flex-1 cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                                </svg>
                                                <span className="hidden sm:inline">Tiếp tục học</span>
                                                <span className="sm:hidden">Học</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {selectedPath && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedPath.title}</h3>
                                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                                            <span>⏱️ {selectedPath.duration} {getTimeUnitText(selectedPath.timeUnit)}</span>
                                            <span>📚 {selectedPath.periods?.length || 0} giai đoạn</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPath(null)}
                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                <div className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
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
                                                                                        className="w-full text-left text-xs p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                                                                                    >
                                                                                        <div className="font-semibold text-gray-900 group-hover:text-gray-800">{lesson.name || `Bài học ${lessonIndex + 1}`}</div>
                                                                                        {lesson.explanation && (
                                                                                            <div className="text-gray-600 mt-1 leading-relaxed">{lesson.explanation.substring(0, 80)}{lesson.explanation.length > 80 ? '...' : ''}</div>
                                                                                        )}
                                                                                        <div className="flex items-center justify-between mt-2">
                                                                                            <span className="text-gray-500 text-xs font-medium">Nhấn để xem chi tiết</span>
                                                                                            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                                                    <div key={exerciseIndex} onClick={() => handleExerciseClick(exercise, topic.title)} className="text-xs p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group cursor-pointer">
                                                                                        <div className="font-semibold text-gray-900 group-hover:text-gray-800">{exercise.title || `Bài tập ${exerciseIndex + 1}`}</div>
                                                                                        <div className="text-gray-600 mt-1 text-xs leading-relaxed">
                                                                                            Loại: {exercise.type || 'Thực hành'} • {exercise.instructions?.length || 0} bước
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between mt-2">
                                                                                            <span className="text-gray-500 text-xs font-medium">Nhấn để xem chi tiết</span>
                                                                                            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                            </svg>
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
                                                                                    <div key={quizIndex} onClick={() => handleQuizClick(quiz, topic.title)} className="text-xs p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group cursor-pointer">
                                                                                        <div className="font-semibold text-gray-900 group-hover:text-gray-800">{quiz.question || `Câu hỏi ${quizIndex + 1}`}</div>
                                                                                        <div className="text-gray-600 mt-1 text-xs leading-relaxed">
                                                                                            {quiz.options?.length || 0} lựa chọn
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between mt-2">
                                                                                            <span className="text-gray-500 text-xs font-medium">Nhấn để xem chi tiết</span>
                                                                                            <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                            </svg>
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
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Lesson Modal */}
                {selectedLesson && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
                            {/* Lesson Header */}
                            <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedLesson.name || 'Bài học'}</h3>
                                                <p className="text-gray-600 text-sm">Chủ đề: {selectedLesson.topicTitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeDetailView}
                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Lesson Content */}
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                                <div className="space-y-6">
                                    {selectedLesson.explanation && (
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">Giải thích bài học</h4>
                                            </div>
                                            <div className="prose prose-gray max-w-none">
                                                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{String(selectedLesson.explanation || '')}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedLesson.keywords && selectedLesson.keywords.length > 0 && (
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">Khái niệm chính</h4>
                                            </div>
                                            <div className="grid gap-3">
                                                {selectedLesson.keywords.map((keyword: KeyConceptDetailResponse, index: number) => (
                                                    <div key={keyword.id || index} className="group p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 hover:shadow-sm transition-all duration-200">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-6 h-6 bg-amber-500 text-white rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-amber-900 mb-1 text-base">{keyword.term}</h5>
                                                                <p className="text-amber-800 leading-relaxed text-sm">{keyword.explanation}</p>
                                                            </div>
                                                        </div>
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
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Đóng
                                    </button>
                                    <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shadow-md hover:shadow-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Hoàn thành bài học
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Exercise Modal */}
                {selectedExercise && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
                            {/* Exercise Header */}
                            <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedExercise.title || 'Bài tập'}</h3>
                                                <p className="text-gray-600 text-sm">Chủ đề: {selectedExercise.topicTitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeDetailView}
                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Exercise Content */}
                            <div className="flex-1 p-6 overflow-y-auto bg-white">
                                <div className="space-y-6">
                                    {/* Exercise Info */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900">Thông tin bài tập</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-800">Loại:</span>
                                                <span className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded-md font-semibold">
                                                    {selectedExercise.type || 'Thực hành'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-800">Số bước:</span>
                                                <span className="text-sm text-gray-800 font-medium">{selectedExercise.instructions?.length || 0} bước</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">Hướng dẫn thực hiện</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {selectedExercise.instructions
                                                    .sort((a: GuideStepDetailResponse, b: GuideStepDetailResponse) => a.stepNumber - b.stepNumber)
                                                    .map((step: GuideStepDetailResponse, index: number) => (
                                                        <div key={step.id || index} className="group p-4 bg-white rounded-lg border border-gray-300 hover:shadow-sm transition-all duration-200">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                                    {step.stepNumber}
                                                                </div>
                                                                <div className="flex-1 space-y-3">
                                                                    <p className="text-gray-800 font-semibold leading-relaxed">{step.description}</p>

                                                                    {step.command && (
                                                                        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-gray-500">$</span>
                                                                                <code className="text-green-400">{step.command}</code>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {step.codeBlock && (
                                                                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700">
                                                                            <pre className="whitespace-pre-wrap text-gray-300">{step.codeBlock}</pre>
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
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Đóng
                                    </button>
                                    <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shadow-md hover:shadow-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Bắt đầu làm bài
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Quiz Modal */}
                {selectedQuiz && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
                            {/* Quiz Header */}
                            <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedQuiz.question || 'Câu hỏi'}</h3>
                                                <p className="text-gray-600 text-sm">Chủ đề: {selectedQuiz.topicTitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeDetailView}
                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Quiz Content */}
                            <div className="flex-1 p-6 overflow-y-auto bg-white">
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900">Câu hỏi</h4>
                                        </div>
                                        <div className="text-gray-800 text-base font-semibold whitespace-pre-line leading-relaxed">{String(selectedQuiz.question || '')}</div>
                                    </div>

                                    {selectedQuiz.options && selectedQuiz.options.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">Các lựa chọn</h4>
                                            </div>
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
                                                            className={`w-full flex items-start gap-3 p-4 border rounded-lg transition-all duration-200 ${showFeedback
                                                                ? isCorrect
                                                                    ? 'border-green-200 bg-green-50'
                                                                    : isSelected
                                                                        ? 'border-red-200 bg-red-50'
                                                                        : 'border-gray-200 bg-gray-50'
                                                                : isSelected
                                                                    ? 'border-gray-400 bg-gray-100'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                                                                }`}
                                                        >
                                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${showFeedback
                                                                ? isCorrect
                                                                    ? 'border-green-500 bg-green-500 text-white'
                                                                    : isSelected
                                                                        ? 'border-red-500 bg-red-500 text-white'
                                                                        : 'border-gray-300 bg-gray-100 text-gray-600'
                                                                : isSelected
                                                                    ? 'border-gray-600 bg-gray-600 text-white'
                                                                    : 'border-gray-300 bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {option.label}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900 text-left text-sm">
                                                                    {option.option}
                                                                </div>
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
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
                                {submittedQuizzes[selectedQuiz.id] && showQuizExplanations[selectedQuiz.id] && (
                                    <div className="mb-3 p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {quizAnswers[selectedQuiz.id] === selectedQuiz.correctAnswer ? (
                                                    <>
                                                        <span className="text-green-700 font-medium text-sm">Chính xác!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-red-700 font-medium text-sm">Câu trả lời chưa đúng. Đáp án đúng là: {selectedQuiz.correctAnswer}</span>
                                                    </>
                                                )}
                                            </div>
                                            {quizAnswers[selectedQuiz.id] !== selectedQuiz.correctAnswer && (
                                                <button
                                                    onClick={() => resetQuiz(selectedQuiz.id)}
                                                    className="px-3 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-colors font-medium shadow-sm hover:shadow-md"
                                                >
                                                    Thử lại
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-3 justify-end">
                                    {!submittedQuizzes[selectedQuiz.id] && (
                                        <button
                                            onClick={() => quizAnswers[selectedQuiz.id] && submitQuiz(selectedQuiz.id)}
                                            disabled={!quizAnswers[selectedQuiz.id]}
                                            className={`px-5 py-2 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 text-sm ${quizAnswers[selectedQuiz.id]
                                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Nộp bài
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm.show && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
                                    <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">
                                Bạn có chắc chắn muốn xóa lộ trình học tập này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
