import { Loader2 } from 'lucide-react';

export default function SubmittingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Đang chấm bài...
          </h3>
          <p className="text-gray-600 text-sm">
            Vui lòng đợi trong giây lát
          </p>
          <div className="mt-4 flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
