import MotionWrapper from "@/components/MotionWrapper";

interface InterviewHeroProps {
  totalQuestions: number;
  totalCategories: number;
  searchText: string;
  onSearchChange: (value: string) => void;
}

export default function InterviewHero({
  totalQuestions,
  totalCategories,
  searchText,
  onSearchChange,
}: InterviewHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-purple-500/5 to-blue-500/5 dark:from-accent/10 dark:via-purple-500/10 dark:to-blue-500/10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Ôn tập{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
                Phỏng vấn
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Bộ sưu tập câu hỏi phỏng vấn toàn diện cho Backend Developer với
              Java & Spring Boot.
              <br />
              Mỗi câu hỏi đều có câu trả lời mẫu chi tiết, mẹo trả lời chuyên
              nghiệp và các chủ đề liên quan để giúp bạn tự tin hơn trong mỗi
              buổi phỏng vấn.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">
                  {totalQuestions}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Câu hỏi
                </div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">
                  {totalCategories}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Chủ đề
                </div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cấp độ
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ đề phỏng vấn..."
                  value={searchText}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-accent dark:focus:border-accent shadow-sm transition-all"
                />
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
