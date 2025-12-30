import React from "react";
import Image from "next/image";
import { Document, DocumentType } from "@/types/document";

interface DocumentCardProps {
  document: Document;
  index?: number;
}

export default function DocumentCard({ document, index = 0 }: DocumentCardProps) {
  const [imageError, setImageError] = React.useState(false);

  const getDocumentTypeInfo = (type: DocumentType) => {
    const typeMap = {
      [DocumentType.BOOK]: {
        name: "Sách",
        color: "bg-blue-100 text-blue-800",
        icon: "📚"
      },
      [DocumentType.ARTICLE]: {
        name: "Bài viết",
        color: "bg-green-100 text-green-800",
        icon: "📝"
      },
      [DocumentType.VIDEO]: {
        name: "Video",
        color: "bg-red-100 text-red-800",
        icon: "🎥"
      },
      [DocumentType.COURSE_MATERIAL]: {
        name: "Tài liệu khóa học",
        color: "bg-purple-100 text-purple-800",
        icon: "📖"
      },
      [DocumentType.TUTORIAL]: {
        name: "Hướng dẫn",
        color: "bg-yellow-100 text-yellow-800",
        icon: "🎓"
      },
      [DocumentType.LINK]: {
        name: "Liên kết",
        color: "bg-indigo-100 text-indigo-800",
        icon: "🔗"
      },
      [DocumentType.PDF]: {
        name: "PDF",
        color: "bg-orange-100 text-orange-800",
        icon: "📄"
      },
      [DocumentType.OTHER]: {
        name: "Khác",
        color: "bg-gray-100 text-gray-800",
        icon: "📋"
      }
    };
    return typeMap[type] || typeMap[DocumentType.OTHER];
  };

  const getDocumentCategory = (index: number) => {
    const categories = [
      {
        name: "Frontend",
        gradient: "from-purple-500 to-blue-500",
        icon: "💻"
      },
      {
        name: "Backend",
        gradient: "from-green-400 to-green-600",
        icon: "⚙️"
      },
      {
        name: "Data Science",
        gradient: "from-pink-500 to-purple-500",
        icon: "📊"
      },
      {
        name: "DevOps",
        gradient: "from-orange-400 to-red-500",
        icon: "🚀"
      },
      {
        name: "Programming",
        gradient: "from-cyan-500 to-blue-500",
        icon: "💾"
      },
      {
        name: "Database",
        gradient: "from-emerald-500 to-teal-500",
        icon: "🗄️"
      },
      {
        name: "Cloud",
        gradient: "from-sky-500 to-indigo-500",
        icon: "☁️"
      },
      {
        name: "Version Control",
        gradient: "from-amber-500 to-orange-500",
        icon: "📝"
      }
    ];
    return categories[index % categories.length];
  };

  const typeInfo = getDocumentTypeInfo(document.type);
  const category = getDocumentCategory(index);

  const handleClick = () => {
    if (document.url) {
      window.open(document.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
        document.url ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Header */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {document.coverImage && !imageError ? (
          <Image
            src={document.coverImage}
            alt={document.title}
            width={400}
            height={192}
            className="w-full h-full object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`h-full bg-gradient-to-r ${category.gradient} flex items-center justify-center p-4`}
          >
            <div className="text-center">
              <div className="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 px-2">
                {document.title}
              </h3>
              <p className="text-white/80 text-xs mt-1">
                {document.category || category.name}
              </p>
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${typeInfo.color} shadow-sm`}>
            {typeInfo.icon} {typeInfo.name}
          </span>
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {document.title}
        </h4>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {document.description}
        </p>

        {/* Document Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {document.author && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium max-w-[120px] truncate">
                {document.author}
              </span>
            )}
            {document.category && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">
                {document.category}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {document.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button - pushed to bottom */}
        <button
          onClick={handleClick}
          disabled={!document.url}
          className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 mt-auto ${
            document.url
              ? "bg-accent hover:bg-accent-600 text-white hover:shadow-md"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {document.url ? (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Truy cập tài liệu
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Tài liệu nội bộ
            </>
          )}
        </button>
      </div>
    </div>
  );
}
