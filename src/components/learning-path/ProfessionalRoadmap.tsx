'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LearningPathPlan } from '@/types/learning-path';
import { LearningPathService } from '@/services/learning-path.service';
import MotionWrapper from '@/components/MotionWrapper';

interface ProfessionalRoadmapProps {
    learningPath: LearningPathPlan;
    answer: string;
    onCreateNew?: () => void;
}

export default function ProfessionalRoadmap({ learningPath, answer, onCreateNew }: ProfessionalRoadmapProps) {
    const router = useRouter();
    const [expandedPeriods, setExpandedPeriods] = useState<Set<number>>(new Set());
    const [modalContent, setModalContent] = useState<{ type: 'lessons' | 'exercises' | 'quizzes', data: unknown[], title: string } | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
    const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({});
    const [isStarting, setIsStarting] = useState(false);

    const togglePeriod = (periodNumber: number) => {
        const newExpanded = new Set(expandedPeriods);
        if (newExpanded.has(periodNumber)) {
            newExpanded.delete(periodNumber);
        } else {
            newExpanded.add(periodNumber);
        }
        setExpandedPeriods(newExpanded);
    };

    const openModal = (type: 'lessons' | 'exercises' | 'quizzes', data: unknown[], title: string) => {
        setModalContent({ type, data, title });
    };

    const closeModal = () => {
        setModalContent(null);
        setQuizAnswers({});
        setShowResults({});
    };

    const handleQuizAnswer = (quizId: string, answer: string) => {
        setQuizAnswers(prev => ({ ...prev, [quizId]: answer }));
        setShowResults(prev => ({ ...prev, [quizId]: true }));
    };

    const handleStartLearning = async () => {
        try {
            setIsStarting(true);

            // Save learning path to database
            await LearningPathService.saveLearningPath({
                learningPathPlan: learningPath
            });

            // Redirect to my learning paths
            router.push('/my-learning-path');
        } catch (error) {
            console.error('Error starting learning:', error);
            alert('Có lỗi xảy ra khi lưu lộ trình. Vui lòng thử lại.');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Background simplified for minimal UI */}

            {/* Modern Header Section */}
            <div className="relative z-10 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <MotionWrapper animation="fadeInUp" duration={0.8}>
                        <div className="text-center">
                            <div className="relative inline-block mb-8">
                                <div className="w-24 h-24 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto shadow">
                                    <span className="text-6xl">🎯</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                {learningPath.title}
                            </h1>
                            <div className="w-20 h-0.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-lg mb-8">
                                <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">⏱️</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{learningPath.duration} {learningPath.timeUnit === 'WEEK' ? 'tuần' : 'tháng'}</div>
                                        <div className="text-sm text-gray-500">Thời gian học</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{learningPath.periods?.length || 0} giai đoạn</div>
                                        <div className="text-sm text-gray-500">Lộ trình học</div>
                                    </div>
                                </div>
                            </div>

                            {answer && (
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left max-w-4xl mx-auto mb-8 shadow-sm">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                                            <span className="text-white font-bold text-lg">AI</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-700 mb-2">Tư vấn từ AI</div>
                                            <p className="text-gray-700 leading-relaxed text-lg">{answer}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modern Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {onCreateNew && (
                                    <button
                                        onClick={onCreateNew}
                                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-all duration-200 shadow-sm flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Tạo lộ trình mới</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleStartLearning}
                                    disabled={isStarting}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                                >
                                    {isStarting ? (
                                        <>
                                            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Đang lưu lộ trình...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Bắt đầu học ngay</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </MotionWrapper>
                </div>
            </div>

            {/* Compact Roadmap */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="space-y-6">
                    {learningPath.periods?.map((period, periodIndex) => (
                        <MotionWrapper key={period.periodNumber} animation="fadeInUp" duration={0.5} delay={periodIndex * 100}>
                            <div className="relative">

                                {/* Connection Line */}
                                {periodIndex > 0 && (
                                    <div className="absolute -top-3 left-8 w-1 h-6 bg-gradient-to-b from-gray-300 to-emerald-400 rounded-full"></div>
                                )}

                                {/* Compact Period Card */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">

                                    {/* Period Header - Compact */}
                                    <button
                                        onClick={() => togglePeriod(period.periodNumber)}
                                        className="w-full p-6 bg-white hover:bg-gray-50 border-b border-gray-200 transition-all duration-200 text-left group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Compact Period Number */}
                                                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-gray-900 font-bold text-lg">{period.periodNumber}</span>
                                                </div>

                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                                                        {period.title}
                                                    </h2>
                                                    <div className="text-gray-500 text-sm">
                                                        {period.topics?.length || 0} chủ đề
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Compact Expand Icon */}
                                            <div className={`transform transition-transform duration-300 ${expandedPeriods.has(period.periodNumber) ? 'rotate-180' : ''}`}>
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Compact Topics Grid */}
                                    {expandedPeriods.has(period.periodNumber) && period.topics && (
                                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {period.topics.map((topic, topicIndex) => (
                                                    <div
                                                        key={topicIndex}
                                                        className="group p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                                                    >
                                                        {/* Compact Topic Header */}
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                                                <span className="text-white text-lg">📚</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{topic.title}</h4>
                                                                <div className="text-xs text-gray-500">{topicIndex + 1} / {period.topics?.length}</div>
                                                            </div>
                                                        </div>

                                                        {/* Modern Stats Cards */}
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {/* Lessons Card */}
                                                            {(topic.lessons?.length || 0) > 0 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openModal('lessons', topic.lessons || [], `${topic.title} - Bài học`);
                                                                    }}
                                                                    className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm group/stat"
                                                                >
                                                                    <div className="text-gray-500 text-2xl mb-2 group-hover/stat:scale-110 transition-transform">📖</div>
                                                                    <div className="font-bold text-gray-900 text-xl">{topic.lessons?.length}</div>
                                                                    <div className="text-xs text-gray-600 font-medium">Bài học</div>
                                                                </button>
                                                            )}

                                                            {/* Exercises Card */}
                                                            {(topic.exercises?.length || 0) > 0 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openModal('exercises', topic.exercises || [], `${topic.title} - Bài tập`);
                                                                    }}
                                                                    className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm group/stat"
                                                                >
                                                                    <div className="text-gray-500 text-2xl mb-2 group-hover/stat:scale-110 transition-transform">💪</div>
                                                                    <div className="font-bold text-gray-900 text-xl">{topic.exercises?.length}</div>
                                                                    <div className="text-xs text-gray-600 font-medium">Bài tập</div>
                                                                </button>
                                                            )}

                                                            {/* Quizzes Card */}
                                                            {(topic.quizzes?.length || 0) > 0 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openModal('quizzes', topic.quizzes || [], `${topic.title} - Câu hỏi`);
                                                                    }}
                                                                    className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm group/stat"
                                                                >
                                                                    <div className="text-gray-500 text-2xl mb-2 group-hover/stat:scale-110 transition-transform">🧠</div>
                                                                    <div className="font-bold text-gray-900 text-xl">{topic.quizzes?.length}</div>
                                                                    <div className="text-xs text-gray-600 font-medium">Câu hỏi</div>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </MotionWrapper>
                    ))}
                </div>

                {/* Content Modal */}
                {modalContent && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                        <MotionWrapper animation="fadeInUp" duration={300}>
                            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">

                                {/* Modal Header */}
                                <div className={`p-4 bg-white border-b border-gray-200 text-gray-900`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">
                                                    {modalContent.type === 'lessons' ? '📖' : modalContent.type === 'exercises' ? '💪' : '🧠'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{modalContent.title}</h3>
                                                <p className="text-gray-500">{modalContent.data.length} mục</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
                                    <div className="space-y-6">
                                        {/* Lessons */}
                                        {modalContent.type === 'lessons' && (modalContent.data as Array<{ name: string; explanation?: string; keywords?: Array<{ term: string; explanation: string }> }>).map((lesson, index) => (
                                            <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-blue-900 text-lg mb-3">{lesson.name}</h4>
                                                        <p className="text-gray-700 mb-4 leading-relaxed">{lesson.explanation}</p>
                                                        {lesson.keywords && lesson.keywords.length > 0 && (
                                                            <div>
                                                                <h5 className="font-semibold text-gray-900 mb-2">Từ khóa chính:</h5>
                                                                <div className="grid md:grid-cols-2 gap-3">
                                                                    {lesson.keywords.map((keyword, keyIndex) => (
                                                                        <div key={keyIndex} className="p-3 bg-white rounded-lg border border-blue-200">
                                                                            <div className="font-medium text-blue-900">{keyword.term}</div>
                                                                            <div className="text-sm text-gray-600 mt-1">{keyword.explanation}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Exercises */}
                                        {modalContent.type === 'exercises' && (modalContent.data as Array<{ title: string; type: string; instructions?: Array<{ stepNumber: number; description: string; command?: string | null }> }>).map((exercise, index) => (
                                            <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-amber-900 text-lg mb-2">{exercise.title}</h4>
                                                        <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full inline-block mb-4 font-medium">
                                                            {exercise.type}
                                                        </div>
                                                        {exercise.instructions && exercise.instructions.length > 0 && (
                                                            <div>
                                                                <h5 className="font-semibold text-gray-900 mb-3">Hướng dẫn thực hiện:</h5>
                                                                <div className="space-y-3">
                                                                    {exercise.instructions.map((step, stepIndex) => (
                                                                        <div key={stepIndex} className="flex space-x-3 p-3 bg-white rounded-lg">
                                                                            <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                                                {step.stepNumber}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-gray-700">{step.description}</p>
                                                                                {step.command && (
                                                                                    <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
                                                                                        {step.command}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Interactive Quizzes */}
                                        {modalContent.type === 'quizzes' && (modalContent.data as Array<{ question: string; options: Array<{ label: string; option: string }>; correctAnswer: string; explanation?: string }>).map((quiz, index) => {
                                            const quizId = `quiz-${index}`;
                                            const selectedAnswer = quizAnswers[quizId];
                                            const showResult = showResults[quizId];
                                            const isCorrect = selectedAnswer === quiz.correctAnswer;

                                            return (
                                                <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900 text-lg mb-6 leading-relaxed">{quiz.question}</h4>

                                                            <div className="space-y-3 mb-6">
                                                                {quiz.options?.map((option: { label: string; option: string }, optionIndex: number) => {
                                                                    let buttonClass = 'p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-md cursor-pointer ';

                                                                    if (!showResult) {
                                                                        // Before answering - minimalist neutral theme
                                                                        buttonClass += selectedAnswer === option.label
                                                                            ? 'border-gray-400 bg-gray-50 ring-1 ring-gray-300'
                                                                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50';
                                                                    } else {
                                                                        // After answering - green/red feedback
                                                                        if (option.label === quiz.correctAnswer) {
                                                                            buttonClass += 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200';
                                                                        } else if (option.label === selectedAnswer && selectedAnswer !== quiz.correctAnswer) {
                                                                            buttonClass += 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-200';
                                                                        } else {
                                                                            buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
                                                                        }
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={optionIndex}
                                                                            onClick={() => !showResult && handleQuizAnswer(quizId, option.label)}
                                                                            disabled={showResult}
                                                                            className={buttonClass}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center space-x-3">
                                                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${!showResult && selectedAnswer === option.label
                                                                                        ? 'border-gray-600 bg-gray-900 text-white'
                                                                                        : showResult && option.label === quiz.correctAnswer
                                                                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                                            : showResult && option.label === selectedAnswer && selectedAnswer !== quiz.correctAnswer
                                                                                                ? 'border-red-500 bg-red-500 text-white'
                                                                                                : 'border-gray-300 text-gray-600 bg-white'
                                                                                        }`}>
                                                                                        {option.label}
                                                                                    </div>
                                                                                    <span className="font-medium">{option.option}</span>
                                                                                </div>

                                                                                {showResult && (
                                                                                    <div>
                                                                                        {option.label === quiz.correctAnswer && (
                                                                                            <div className="flex items-center space-x-2 text-emerald-600 font-bold">
                                                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                                </svg>
                                                                                                <span>Đúng</span>
                                                                                            </div>
                                                                                        )}
                                                                                        {option.label === selectedAnswer && selectedAnswer !== quiz.correctAnswer && (
                                                                                            <div className="flex items-center space-x-2 text-red-600 font-bold">
                                                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                                                </svg>
                                                                                                <span>Sai</span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Result Summary */}
                                                            {showResult && (
                                                                <div className={`p-5 rounded-xl border-2 ${isCorrect
                                                                    ? 'bg-emerald-50 border-emerald-200'
                                                                    : 'bg-red-50 border-red-200'
                                                                    }`}>
                                                                    <div className="flex items-start space-x-3">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                                                            }`}>
                                                                            {isCorrect ? (
                                                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className={`font-bold text-xl mb-3 ${isCorrect ? 'text-emerald-800' : 'text-red-800'
                                                                                }`}>
                                                                                {isCorrect ? '🎉 Chính xác!' : '😔 Chưa đúng rồi'}
                                                                            </div>
                                                                            {quiz.explanation && (
                                                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                                                    <div className="flex items-start space-x-2">
                                                                                        <span className="text-violet-500 text-lg">💡</span>
                                                                                        <div>
                                                                                            <div className="font-semibold text-gray-900 mb-2">Giải thích:</div>
                                                                                            <p className="text-gray-700 leading-relaxed">{quiz.explanation}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>
                )}
            </div>

            {/* Compact Progress Indicator */}
            <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-40">
                <div className="text-xs text-gray-600 mb-2 text-center font-medium">Đã khám phá</div>
                <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
                            style={{
                                width: `${(expandedPeriods.size / (learningPath.periods?.length || 1)) * 100}%`
                            }}
                        ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                        {expandedPeriods.size}/{learningPath.periods?.length || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
