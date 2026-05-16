"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseFilters, ExerciseType, Difficulty, ExerciseStatus } from '@/types/exercise';
import { Pagination } from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatReadableDate } from '@/utils/dateUtils';

const ExerciseTypeBadge = ({ type }: { type: ExerciseType }) => {
  const colors = {
    [ExerciseType.MULTIPLE_CHOICE]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ExerciseType.ESSAY]: 'bg-green-100 text-green-800 border-green-200',
    [ExerciseType.CODING]: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const labels = {
    [ExerciseType.MULTIPLE_CHOICE]: 'Trắc nghiệm',
    [ExerciseType.ESSAY]: 'Tự luận',
    [ExerciseType.CODING]: 'Lập trình',
  };

  const icons = {
    [ExerciseType.MULTIPLE_CHOICE]: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    [ExerciseType.ESSAY]: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    ),
    [ExerciseType.CODING]: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors[type]}`}>
      {icons[type]}
      {labels[type]}
    </span>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const colors = {
    [Difficulty.EASY]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [Difficulty.MEDIUM]: 'bg-amber-100 text-amber-800 border-amber-200',
    [Difficulty.HARD]: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const labels = {
    [Difficulty.EASY]: 'Dễ',
    [Difficulty.MEDIUM]: 'Trung bình',
    [Difficulty.HARD]: 'Khó',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
};

export default function ExercisesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ExerciseFilters>({
    page: 1,
    size: 12,
  });

  // Chỉ lấy bài tập đã published
  const { data: exercisesData, isLoading } = useExercises(filters);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleExerciseClick = (exerciseId: string) => {
    router.push(`/exercises/${exerciseId}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Lọc chỉ bài tập đã published
  const publishedExercises = exercisesData?.data?.filter(
    exercise => exercise.status === ExerciseStatus.PUBLISHED
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bài tập thực hành
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Luyện tập và nâng cao kỹ năng lập trình của bạn với các bài tập đa dạng
            </p>
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {exercisesData?.totalElements || 0} bài tập
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Miễn phí
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Chấm điểm tự động
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Danh sách bài tập */}
        {publishedExercises.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {publishedExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => handleExerciseClick(exercise.id)}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {exercise.title}
                        </h3>
                      </div>
                      <DifficultyBadge difficulty={exercise.difficulty} />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {exercise.description}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <ExerciseTypeBadge type={exercise.exerciseType} />
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{exercise.timeLimit}</span>
                        <span className="ml-1">phút</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span className="font-medium">{exercise.maxScore}</span>
                        <span className="ml-1">điểm</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatReadableDate(exercise.publishedAt)}
                      </div>
                      
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm transition-colors">
                        <span>Bắt đầu</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {exercisesData && exercisesData.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <Pagination
                    currentPage={exercisesData.currentPage}
                    totalPages={exercisesData.totalPages}
                    totalElements={exercisesData.totalElements}
                    pageSize={exercisesData.pageSize}
                    onPageChange={handlePageChange}
                    itemName="bài tập"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có bài tập nào
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Hiện tại chưa có bài tập nào được xuất bản. Hãy quay lại sau nhé!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}