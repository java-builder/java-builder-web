import { useRef, KeyboardEvent, memo } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface ChatInputProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: (content?: string) => void;
}

function ChatInput({ value, isLoading, onChange, onSend }: ChatInputProps) {
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value);
      }
    }
  };

  const handleSendClick = () => {
    if (value.trim()) {
      onSend(value);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex-shrink-0">
      <div className="flex gap-1.5 sm:gap-2">
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chatbotPage.inputPlaceholder")}
            disabled={isLoading}
            rows={1}
            className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent resize-none disabled:opacity-50 text-sm leading-5 scrollbar-hide"
            style={{ height: '40px', overflow: 'hidden' }}
          />
        </div>
        <button
          onClick={handleSendClick}
          disabled={!value.trim() || isLoading}
          style={{ height: '40px' }}
          className="px-3 sm:px-4 bg-accent text-white rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">{t("chatbotPage.sendBtn")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default memo(ChatInput);
