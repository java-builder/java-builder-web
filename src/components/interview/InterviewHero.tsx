import MotionWrapper from "@/components/MotionWrapper";
import Image from "next/image";

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
      
      {/* Floating Tech Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Java Logo - Top Left */}
        <div className="absolute top-12 left-4 sm:top-16 sm:left-8 md:left-16 lg:left-20 animate-float opacity-30 dark:opacity-40">
          <Image 
            src="/logos/logo-java.png" 
            alt="Java" 
            width={50} 
            height={50} 
            className="object-contain w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px]" 
          />
        </div>
        
        {/* Docker Logo - Top Right */}
        <div className="absolute top-16 right-4 sm:top-20 sm:right-8 md:right-16 lg:right-24 animate-float-delayed opacity-30 dark:opacity-40" style={{ animationDelay: '1s' }}>
          <Image 
            src="/logos/logo-docker.png" 
            alt="Docker" 
            width={55} 
            height={55} 
            className="object-contain w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] lg:w-[75px] lg:h-[75px]" 
          />
        </div>
        
        {/* Spring Boot Logo - Middle Left */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 md:left-12 lg:left-16 animate-float opacity-30 dark:opacity-40" style={{ animationDelay: '2s' }}>
          <Image 
            src="/logos/logo-springboot.png" 
            alt="Spring Boot" 
            width={50} 
            height={50} 
            className="object-contain w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[65px] lg:h-[65px]" 
          />
        </div>
        
        {/* Microservices Logo - Middle Right */}
        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 md:right-14 lg:right-20 animate-float-delayed opacity-30 dark:opacity-40" style={{ animationDelay: '0.5s' }}>
          <Image 
            src="/logos/logo-microservices.png" 
            alt="Microservices" 
            width={55} 
            height={55} 
            className="object-contain w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px]" 
          />
        </div>
        
        {/* PostgreSQL Logo - Bottom Left */}
        <div className="absolute bottom-16 left-6 sm:bottom-20 sm:left-12 md:left-20 lg:left-28 animate-float opacity-30 dark:opacity-40" style={{ animationDelay: '1.5s' }}>
          <Image 
            src="/logos/logo-posgtres.png" 
            alt="PostgreSQL" 
            width={50} 
            height={50} 
            className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[60px] lg:h-[60px]" 
          />
        </div>
        
        {/* AWS Logo - Bottom Right */}
        <div className="absolute bottom-20 right-6 sm:bottom-24 sm:right-12 md:right-24 lg:right-32 animate-float-delayed opacity-30 dark:opacity-40" style={{ animationDelay: '2.5s' }}>
          <Image 
            src="/logos/aws-logo.png" 
            alt="AWS" 
            width={50} 
            height={50} 
            className="object-contain w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[65px] lg:h-[65px]" 
          />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-10 md:py-14">
        <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5">
              Ôn tập{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
                Phỏng vấn
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Bộ sưu tập câu hỏi phỏng vấn toàn diện cho Backend Developer với
              Java & Spring Boot.
              <br />
              Mỗi câu hỏi đều có câu trả lời mẫu chi tiết, mẹo trả lời chuyên
              nghiệp và các chủ đề liên quan để giúp bạn tự tin hơn trong mỗi
              buổi phỏng vấn.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {totalQuestions}+
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Câu hỏi
                </div>
              </div>
              <div className="w-px h-10 bg-gray-300 dark:bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {totalCategories}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Chủ đề
                </div>
              </div>
              <div className="w-px h-10 bg-gray-300 dark:bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">3</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Cấp độ
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ đề phỏng vấn..."
                  value={searchText}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-accent dark:focus:border-accent shadow-sm transition-all text-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
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
