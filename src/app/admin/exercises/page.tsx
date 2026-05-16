"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseFilters, ExerciseStatus, ExerciseType, Difficulty } from '@/types/exercise';
import { Pagination } from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatReadableDate } from '@/utils/dateUtils';

const ExerciseTypeBadge = ({ type }: { type: ExerciseType }) => {
  const colors = {
    [ExerciseType.MULTIPLE_CHOICE]: 'bg-blue-100 text-blue-800',
    [ExerciseType.ESSAY]: 'bg-green-100 text-green-800',
    [ExerciseType.CODING]: 'bg-purple-100 text-purple-800',
  };

  const labels = {
    [ExerciseType.MULTIPLE_CHOICE]: 'Trắc nghiệm',
    [ExerciseType.ESSAY]: 'Tự luận',
    [ExerciseType.CODING]: 'Lập trình',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
      {labels[type]}
    </span>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const colors = {
    [Difficulty.EASY]: 'bg-green-100 text-green-800',
    [Difficulty.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Difficulty.HARD]: 'bg-red-100 text-red-800',
  };

  const labels = {
    [Difficulty.EASY]: 'Dễ',
    [Difficulty.MEDIUM]: 'Trung bình',
    [Difficulty.HARD]: 'Khó',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
};

const StatusBadge = ({ status }: { status: ExerciseStatus }) => {
  const colors = {
    [ExerciseStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [ExerciseStatus.PUBLISHED]: 'bg-green-100 text-green-800',
    [ExerciseStatus.ARCHIVED]: 'bg-red-100 text-red-800',
  };

  const labels = {
    [ExerciseStatus.DRAFT]: 'Nháp',
    [ExerciseStatus.PUBLISHED]: 'Đã xuất bản',
    [ExerciseStatus.ARCHIVED]: 'Đã lưu trữ',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function ExercisesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ExerciseFilters>({
    page: 1,
    size: 10,
  });

  const { data: exercisesData, isLoading } = useExercises(filters);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài tập</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Tổng cộng <span className="font-semibold text-gray-900">{exercisesData?.totalElements || 0}</span> bài tập</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Đã xuất bản <span className="font-semibold text-accent">{exercisesData?.data?.filter(e => e.status === ExerciseStatus.PUBLISHED).length || 0}</span></span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Nháp <span className="font-semibold text-gray-700">{exercisesData?.data?.filter(e => e.status === ExerciseStatus.DRAFT).length || 0}</span></span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/admin/exercises/create')}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo bài tập mới
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ khó
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm tối đa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xuất bản
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercisesData?.data?.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {exercise.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ExerciseTypeBadge type={exercise.exerciseType} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DifficultyBadge difficulty={exercise.difficulty} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exercise.timeLimit} phút
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exercise.maxScore} điểm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={exercise.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatReadableDate(exercise.publishedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {exercisesData && exercisesData.totalElements > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={exercisesData.currentPage}
              totalPages={exercisesData.totalPages}
              totalElements={exercisesData.totalElements}
              pageSize={exercisesData.pageSize}
              onPageChange={handlePageChange}
              itemName="bài tập"
            />
          </div>
        )}

        {exercisesData?.data?.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có bài tập nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bắt đầu bằng cách tạo bài tập đầu tiên của bạn.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/admin/exercises/create')}
                className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                + Tạo bài tập mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}