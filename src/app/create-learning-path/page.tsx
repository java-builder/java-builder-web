'use client';

import { useState } from 'react';
import Link from 'next/link';
import MotionWrapper from '@/components/MotionWrapper';
import LearningPathDisplay from '@/components/learning-path/LearningPathDisplay';
import { LearningPathService } from '@/services/learning-path.service';
import { ChatbotResponse, LearningPreferences } from '@/types/learning-path';
import Header from '@/components/Header';

export default function CreateLearningPathPage() {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState<LearningPreferences>({
        goals: [],
        skills: [],
        experience: '',
        timeCommitment: '',
        name: '',
        currentJob: '',
        specificGoals: '',
        challenges: '',
        preferredTopics: '',
        timeline: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [learningPathResponse, setLearningPathResponse] = useState<ChatbotResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    // const [viewMode] = useState<'roadmap' | 'list'>('roadmap');

    const totalSteps = 6;

    const goals = [
        { id: 'career', label: 'Phát triển sự nghiệp', desc: 'Thăng tiến trong công việc hiện tại', icon: '🚀' },
        { id: 'skill', label: 'Nâng cao kỹ năng', desc: 'Học thêm kỹ năng mới', icon: '💪' },
        { id: 'hobby', label: 'Sở thích cá nhân', desc: 'Học vì đam mê và thú vui', icon: '🎨' },
        { id: 'certification', label: 'Lấy chứng chỉ', desc: 'Có bằng cấp được công nhận', icon: '🏆' },
        { id: 'business', label: 'Khởi nghiệp', desc: 'Chuẩn bị kiến thức để khởi nghiệp', icon: '💼' },
        { id: 'academic', label: 'Học thuật', desc: 'Nghiên cứu và học thuật', icon: '🎓' }
    ];

    const skills = [
        { id: 'programming', label: 'Lập trình', desc: 'Web, Mobile, AI/ML', icon: '💻' },
        { id: 'design', label: 'Thiết kế', desc: 'UI/UX, Graphic Design', icon: '🎨' },
        { id: 'marketing', label: 'Marketing', desc: 'Digital Marketing, SEO', icon: '📈' },
        { id: 'language', label: 'Ngoại ngữ', desc: 'Tiếng Anh, Tiếng Nhật, v.v.', icon: '🌍' },
        { id: 'business', label: 'Kinh doanh', desc: 'Quản lý, Tài chính', icon: '💼' },
        { id: 'data', label: 'Phân tích dữ liệu', desc: 'Data Science, Analytics', icon: '📊' },
        { id: 'photography', label: 'Nhiếp ảnh', desc: 'Chụp ảnh, Chỉnh sửa', icon: '📸' },
        { id: 'music', label: 'Âm nhạc', desc: 'Nhạc cụ, Sản xuất nhạc', icon: '🎵' }
    ];

    const handleGoalToggle = (goalId: string) => {
        setPreferences(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(id => id !== goalId)
                : [...prev.goals, goalId]
        }));
    };

    const handleSkillToggle = (skillId: string) => {
        setPreferences(prev => ({
            ...prev,
            skills: prev.skills.includes(skillId)
                ? prev.skills.filter(id => id !== skillId)
                : [...prev.skills, skillId]
        }));
    };

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const message = LearningPathService.buildChatbotMessage(preferences);

            const response = await LearningPathService.generateLearningPath({ message });

            if (response.code === 200 && response.result) {
                setLearningPathResponse(response.result);
            } else {
                throw new Error('Không thể tạo lộ trình học tập. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Error creating learning path:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi tạo lộ trình. Vui lòng thử lại sau.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return preferences.name.trim() !== '';
            case 2: return preferences.goals.length > 0;
            case 3: return preferences.skills.length > 0;
            case 4: return preferences.experience !== '';
            case 5: return preferences.timeCommitment !== '';
            case 6: return preferences.specificGoals.trim() !== '' && preferences.timeline !== '';
            default: return false;
        }
    };

    // If learning path is created, show the result
    if (learningPathResponse?.learningPathPlan) {
        const resetForm = () => {
            setLearningPathResponse(null);
            setError(null);
            setStep(1);
            setPreferences({
                goals: [],
                skills: [],
                experience: '',
                timeCommitment: '',
                name: '',
                currentJob: '',
                specificGoals: '',
                challenges: '',
                preferredTopics: '',
                timeline: ''
            });
        };

        return (
            <div>
                <Header />
                {/* View Mode Toggle */}

                <LearningPathDisplay
                    learningPath={learningPathResponse.learningPathPlan}
                    answer={learningPathResponse.answer}
                    onCreateNew={resetForm}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100">
            {/* Navigation */}
            <nav className="w-full px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-white/20">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Quay về trang chủ</span>
                    </Link>

                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">FL</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">F Learning</span>
                    </div>

                    <div className="text-sm text-gray-500">
                        Bước {step}/{totalSteps}
                    </div>
                </div>
            </nav>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-0.5">
                <div
                    className="h-0.5 bg-emerald-600 transition-all duration-500 ease-out"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
            </div>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden">

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow">
                                    <span className="text-4xl">👋</span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                                    Chào mừng đến với F Learning!
                                </h1>
                                <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Hãy bắt đầu bằng cách cho chúng tôi biết một chút về bạn
                                </p>

                                <div className="max-w-md mx-auto space-y-5">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Tên của bạn"
                                            value={preferences.name}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Công việc hiện tại (tùy chọn)"
                                            value={preferences.currentJob}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, currentJob: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base"
                                        />
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Step 2: Goals */}
                    {step === 2 && (
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="p-8">
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow">
                                        <span className="text-4xl">🎯</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Mục tiêu học tập của bạn?</h2>
                                    <p className="text-base text-gray-600">Chọn những mục tiêu bạn muốn đạt được (có thể chọn nhiều)</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                    {goals.map((goal) => (
                                        <button
                                            key={goal.id}
                                            onClick={() => handleGoalToggle(goal.id)}
                                            className={`p-5 rounded-2xl border transition-all duration-200 text-left hover:bg-gray-50 ${preferences.goals.includes(goal.id)
                                                ? 'border-emerald-500 bg-white shadow'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="text-3xl">{goal.icon}</div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{goal.label}</h3>
                                                    <p className="text-gray-600">{goal.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Step 3: Skills */}
                    {step === 3 && (
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="p-8">
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow">
                                        <span className="text-4xl">🛠️</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Kỹ năng bạn muốn học?</h2>
                                    <p className="text-base text-gray-600">Chọn những lĩnh vực bạn quan tâm (có thể chọn nhiều)</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                                    {skills.map((skill) => (
                                        <button
                                            key={skill.id}
                                            onClick={() => handleSkillToggle(skill.id)}
                                            className={`p-4 rounded-xl border transition-all duration-200 text-left hover:bg-gray-50 ${preferences.skills.includes(skill.id)
                                                ? 'border-emerald-500 bg-white shadow'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{skill.icon}</span>
                                                <div>
                                                    <div className="font-bold text-gray-900">{skill.label}</div>
                                                    <div className="text-sm text-gray-600">{skill.desc}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Step 4: Experience Level */}
                    {step === 4 && (
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="p-8">
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow">
                                        <span className="text-4xl">📚</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Trình độ hiện tại của bạn?</h2>
                                    <p className="text-xl text-gray-600">Chọn mức độ kinh nghiệm phù hợp nhất với bạn</p>
                                </div>

                                <div className="max-w-2xl mx-auto space-y-3">
                                    {[
                                        { id: 'beginner', label: 'Người mới bắt đầu', desc: 'Chưa có kinh nghiệm hoặc rất ít kinh nghiệm', icon: '🌱' },
                                        { id: 'intermediate', label: 'Trung cấp', desc: 'Có một số kiến thức cơ bản và kinh nghiệm', icon: '🌿' },
                                        { id: 'advanced', label: 'Nâng cao', desc: 'Đã có kinh nghiệm và muốn nâng cao kỹ năng', icon: '🌳' },
                                        { id: 'expert', label: 'Chuyên gia', desc: 'Muốn học những kỹ năng chuyên sâu và tiên tiến', icon: '🏔️' }
                                    ].map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setPreferences(prev => ({ ...prev, experience: level.id }))}
                                            className={`w-full p-5 rounded-2xl border transition-all duration-200 text-left hover:bg-gray-50 ${preferences.experience === level.id
                                                ? 'border-emerald-500 bg-white shadow'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <span className="text-3xl">{level.icon}</span>
                                                <div>
                                                    <div className="font-bold text-lg text-gray-900 mb-1">{level.label}</div>
                                                    <div className="text-gray-600">{level.desc}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Step 5: Time Commitment */}
                    {step === 5 && (
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="p-8">
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow">
                                        <span className="text-4xl">⏰</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Thời gian học tập?</h2>
                                    <p className="text-xl text-gray-600">Bạn có thể dành bao nhiều thời gian mỗi tuần để học?</p>
                                </div>

                                <div className="max-w-2xl mx-auto space-y-3">
                                    {[
                                        { id: '1-3', label: '1-3 giờ/tuần', desc: 'Học nhẹ nhàng, phù hợp với người bận rộn', icon: '🚶' },
                                        { id: '4-7', label: '4-7 giờ/tuần', desc: 'Cân bằng tốt giữa học tập và công việc', icon: '🏃' },
                                        { id: '8-15', label: '8-15 giờ/tuần', desc: 'Tập trung học tập, tiến bộ nhanh chóng', icon: '🏃‍♂️' },
                                        { id: '15+', label: '15+ giờ/tuần', desc: 'Học chuyên sâu, chuyển đổi nghề nghiệp', icon: '🚀' }
                                    ].map((time) => (
                                        <button
                                            key={time.id}
                                            onClick={() => setPreferences(prev => ({ ...prev, timeCommitment: time.id }))}
                                            className={`w-full p-5 rounded-2xl border transition-all duration-200 text-left hover:bg-gray-50 ${preferences.timeCommitment === time.id
                                                ? 'border-emerald-500 bg-white shadow'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <span className="text-3xl">{time.icon}</span>
                                                <div>
                                                    <div className="font-bold text-lg text-gray-900 mb-1">{time.label}</div>
                                                    <div className="text-gray-600">{time.desc}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Step 6: Detailed Preferences */}
                    {step === 6 && (
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="p-8">
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow">
                                        <span className="text-4xl">📝</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Mong muốn cụ thể của bạn</h2>
                                    <p className="text-base text-gray-600">Chia sẻ thêm để chúng tôi tạo lộ trình phù hợp nhất</p>
                                </div>

                                <div className="max-w-3xl mx-auto space-y-6">
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                                            Mục tiêu cụ thể bạn muốn đạt được? *
                                        </label>
                                        <textarea
                                            placeholder="Ví dụ: Tôi muốn trở thành một lập trình viên full-stack trong 6 tháng, có thể làm việc remote và kiếm được mức lương 20-30 triệu..."
                                            value={preferences.specificGoals}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, specificGoals: e.target.value }))}
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none h-32"
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                                            Khó khăn hiện tại của bạn?
                                        </label>
                                        <textarea
                                            placeholder="Ví dụ: Tôi không có nhiều thời gian, khó tập trung học online, không biết bắt đầu từ đâu..."
                                            value={preferences.challenges}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, challenges: e.target.value }))}
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                                            Chủ đề cụ thể bạn quan tâm?
                                        </label>
                                        <textarea
                                            placeholder="Ví dụ: React, Node.js, MongoDB, UI/UX Design, Digital Marketing, SEO..."
                                            value={preferences.preferredTopics}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, preferredTopics: e.target.value }))}
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                                            Thời gian mong muốn hoàn thành? *
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: '1-month', label: '1 tháng', desc: 'Tốc độ nhanh', icon: '⚡' },
                                                { id: '3-months', label: '3 tháng', desc: 'Cân bằng', icon: '🎯' },
                                                { id: '6-months', label: '6 tháng', desc: 'Vững chắc', icon: '📈' },
                                                { id: '1-year', label: '1 năm+', desc: 'Chuyên sâu', icon: '🌟' }
                                            ].map((timeline) => (
                                                <button
                                                    key={timeline.id}
                                                    onClick={() => setPreferences(prev => ({ ...prev, timeline: timeline.id }))}
                                                    className={`p-3 rounded-lg border transition-all duration-200 text-center hover:bg-gray-50 ${preferences.timeline === timeline.id
                                                        ? 'border-emerald-500 bg-white shadow'
                                                        : 'border-gray-200'
                                                        }`}
                                                >
                                                    <div className="text-xl mb-2">{timeline.icon}</div>
                                                    <div className="font-semibold text-gray-900 text-sm">{timeline.label}</div>
                                                    <div className="text-xs text-gray-600 mt-1">{timeline.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="p-6 mx-12 mb-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="text-red-500 text-xl">⚠️</div>
                                    <div>
                                        <h4 className="font-semibold text-red-900 mb-1">Có lỗi xảy ra</h4>
                                        <p className="text-red-700">{error}</p>
                                        <button
                                            onClick={() => setError(null)}
                                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Footer */}
                    <div className="bg-gray-50 px-6 py-5 flex items-center justify-between border-t border-gray-200">
                        <div className="flex space-x-2">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div
                                    key={i + 1}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i + 1 <= step ? 'bg-emerald-600' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex space-x-4">
                            {step > 1 && (
                                <button
                                    onClick={handlePrev}
                                    className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                >
                                    Quay lại
                                </button>
                            )}

                            {step < totalSteps ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow"
                                >
                                    Tiếp tục
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStepValid() || isLoading}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Đang tạo lộ trình...</span>
                                        </>
                                    ) : (
                                        <span>Tạo lộ trình của tôi</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
