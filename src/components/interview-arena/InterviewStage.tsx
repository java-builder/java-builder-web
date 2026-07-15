import React from "react";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare,
  Sparkles,
  Send,
  Clock
} from "lucide-react";
import { Question, Interviewer } from "./types";

interface InterviewStageProps {
  currentQuestionIdx: number;
  questions: Question[];
  currentInterviewer: Interviewer;
  timeLeft: number;
  formatTime: (s: number) => string;
  isCameraOn: boolean;
  isMicOn: boolean;
  isRecording: boolean;
  voiceTranscript: string;
  studentAnswer: string;
  showAnswerPanel: boolean;
  isEvaluating: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleAnswerPanel: () => void;
  onStartVoiceRecording: () => void;
  onStopVoiceRecording: () => void;
  onSetStudentAnswer: (ans: string) => void;
  onSubmitAnswer: () => void;
  onEndCallEarly: () => void;
}

export const InterviewStage: React.FC<InterviewStageProps> = ({
  currentQuestionIdx,
  questions,
  currentInterviewer,
  timeLeft,
  formatTime,
  isCameraOn,
  isMicOn,
  isRecording,
  voiceTranscript,
  studentAnswer,
  showAnswerPanel,
  isEvaluating,
  videoRef,
  onToggleCamera,
  onToggleMic,
  onToggleAnswerPanel,
  onStartVoiceRecording,
  onStopVoiceRecording,
  onSetStudentAnswer,
  onSubmitAnswer,
  onEndCallEarly
}) => {
  const activeQuestion = questions[currentQuestionIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

      {/* Left: Main Video Meeting Screen (Takes 8 columns when sidebar open) */}
      <div className={`${showAnswerPanel ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col gap-4`}>

        {/* Meeting View Box */}
        <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 shadow-2xl relative flex items-center justify-center overflow-hidden aspect-video min-h-[380px] lg:min-h-[460px] group">

          {/* Live stream watermarks */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-650 text-[10px] font-black text-white uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE REC
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-slate-300 font-bold border border-white/5">
              AI Mock Technical Interview
            </span>
          </div>

          {/* Interviewer stream (Simulated remote camera feed) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#111827] to-[#030712] z-10">

            {/* Big profile avatar styled like a real remote user */}
            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${currentInterviewer.avatarGradient} text-white flex items-center justify-center font-black text-4xl shadow-xl border-4 border-slate-800 relative`}>
              {currentInterviewer.name.charAt(0)}
              {/* Green active dot */}
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-800" />
            </div>

            <div className="mt-4.5 text-center space-y-1 z-10">
              <h3 className="text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2">
                {currentInterviewer.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
                {currentInterviewer.title}
              </p>
            </div>

            {/* Speaking voice visualization waves on AI speech */}
            <div className="absolute bottom-6 flex items-center gap-1 z-20 h-6">
              <span className="w-1 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
              <span className="w-1 h-5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
              <span className="w-1 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1 h-6 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
              <span className="w-1 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.15s" }} />
            </div>
          </div>

          {/* Picture in Picture container (Student Camera Live Feed) */}
          <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-video rounded-xl bg-slate-900 border-2 border-slate-750/70 shadow-2xl overflow-hidden z-30 transition hover:scale-102 duration-300">
            {isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-1.5 p-2">
                <VideoOff className="w-5 h-5" />
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Camera Tắt</span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-extrabold uppercase z-10">
              Bạn (Ứng Viên)
            </div>
          </div>

          {/* Top question floating banner */}
          <div className="absolute top-16 left-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-xl shadow-lg">
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-wider">
              Câu hỏi {currentQuestionIdx + 1} / {questions.length}
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-white mt-1 leading-relaxed">
              {activeQuestion?.text}
            </p>
          </div>

        </div>

        {/* Meeting Controls Bar */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-4.5 shadow-md flex items-center justify-between gap-4 flex-wrap">
          
          {/* Audio Visualizer Waves on Candidate Speech */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-750/60 text-xs font-bold text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 text-indigo-500" />
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Core meeting status buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMic}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isMicOn
                  ? "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-gray-200 dark:border-slate-750 text-slate-700 dark:text-slate-350"
                  : "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-500"
              }`}
              title={isMicOn ? "Tắt micro" : "Bật micro"}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isCameraOn
                  ? "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-gray-200 dark:border-slate-750 text-slate-700 dark:text-slate-350"
                  : "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-500"
              }`}
              title={isCameraOn ? "Tắt camera" : "Bật camera"}
            >
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={onToggleAnswerPanel}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                showAnswerPanel
                  ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-gray-200 dark:border-slate-750 text-slate-700 dark:text-slate-350"
              }`}
              title="Khung nhập câu trả lời"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

          {/* End Call Early Button */}
          <button
            onClick={onEndCallEarly}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer select-none"
          >
            <PhoneOff className="w-4 h-4 text-white" />
            Rời cuộc họp
          </button>
        </div>

      </div>

      {/* Right: Answer Submission & Transcript Typing panel (Takes 4 columns) */}
      {showAnswerPanel && (
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Speech-To-Text Voice Recording Box */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-slate-750/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Microphone Trả lời bằng giọng nói
            </h3>

            {/* Recording visual indicator */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-750/60 flex flex-col items-center justify-center text-center gap-3">
              {isRecording ? (
                <>
                  <div className="flex items-center gap-1.5 h-6">
                    <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <p className="text-[10px] text-red-500 font-extrabold uppercase animate-pulse">Đang thu âm câu trả lời...</p>
                  <button
                    onClick={onStopVoiceRecording}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase shadow-sm cursor-pointer select-none transition"
                  >
                    Dừng ghi âm
                  </button>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">
                    Nhấp nút bên dưới và nói trực tiếp câu trả lời của bạn.
                  </p>
                  <button
                    onClick={onStartVoiceRecording}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-xl tracking-wider uppercase shadow-md cursor-pointer select-none transition"
                  >
                    Bật mic nói
                  </button>
                </>
              )}
            </div>

            {/* Transcript Area */}
            {voiceTranscript && (
              <div className="space-y-1.5 bg-indigo-50/15 dark:bg-indigo-950/5 p-3.5 rounded-xl border border-indigo-500/10">
                <p className="text-[9px] text-indigo-500 font-black uppercase tracking-wider">Bản ghi giọng nói trực tiếp:</p>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono italic">
                  &quot;{voiceTranscript}...&quot;
                </p>
              </div>
            )}
          </div>

          {/* Manual Text Answer Box & Submit */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm flex-1 flex flex-col gap-4 min-h-[300px]">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-slate-750/70 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Soạn thảo câu trả lời
            </h3>

            <textarea
              value={studentAnswer}
              onChange={(e) => onSetStudentAnswer(e.target.value)}
              placeholder="Nhập chi tiết câu trả lời của bạn tại đây..."
              disabled={isEvaluating}
              className="w-full flex-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-750/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed font-sans"
            />

            {/* Submit Button */}
            <button
              onClick={onSubmitAnswer}
              disabled={isEvaluating || !studentAnswer.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer select-none group uppercase tracking-wider"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                  AI Đang phân tích đánh giá...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-white" />
                  Nộp câu trả lời cho AI
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
