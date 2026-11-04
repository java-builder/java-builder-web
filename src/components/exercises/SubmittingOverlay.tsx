import { Loader2 } from 'lucide-react';

export default function SubmittingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl max-w-sm mx-4">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">
            Đang chấm bài...
          </h3>
          <p className="text-text-secondary text-sm">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    </div>
  );
}
