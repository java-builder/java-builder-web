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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-purple-500/5 to-blue-500/5" />
        
        {/* Floating Tech Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Code Icon - Top Left */}
          <div className="absolute top-12 left-8 animate-float opacity-20">
            <svg className="w-16 h-16 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Document Icon - Top Right */}
          <div className="absolute top-16 right-12 animate-float-delayed opacity-20" style={{ animationDelay: '1s' }}>
            <svg className="w-20 h-20 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Pencil Icon - Middle Left */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 animate-float opacity-20" style={{ animationDelay: '2s' }}>
            <svg className="w-14 h-14 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          
          {/* Check Circle Icon - Middle Right */}
          <div className="absolute top-1/2 -translate-y-1/2 right-8 animate-float-delayed opacity-20" style={{ animationDelay: '0.5s' }}>
            <svg className="w-18 h-18 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Star Icon - Bottom Left */}
          <div className="absolute bottom-20 left-16 animate-float opacity-20" style={{ animationDelay: '1.5s' }}>
            <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          
          {/* Lightning Icon - Bottom Right */}
          <div className="absolute bottom-24 right-20 animate-float-delayed opacity-20" style={{ animationDelay: '2.5s' }}>
            <svg className="w-14 h-14 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Bài tập{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
                Thực hành
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Rèn luyện kỹ năng lập trình Java & Spring Boot qua các bài tập thực tế.
              <br />
              Từ cơ bản đến nâng cao, mỗi bài tập đều có hệ thống chấm điểm tự động và phản hồi chi tiết giúp bạn cải thiện từng ngày.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {exercisesData?.totalElements || 0}+
                </div>
                <div className="text-xs text-gray-600">
                  Bài tập
                </div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  3
                </div>
                <div className="text-xs text-gray-600">
                  Độ khó
                </div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  Miễn phí
                </div>
                <div className="text-xs text-gray-600">
                  100%
                </div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  Tự động
                </div>
                <div className="text-xs text-gray-600">
                  Chấm điểm
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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