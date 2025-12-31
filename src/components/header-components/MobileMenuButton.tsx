"use client";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 transition-colors"
      aria-label={isOpen ? "Đóng menu" : "Mở menu"}
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
        />
      </svg>
    </button>
  );
}
