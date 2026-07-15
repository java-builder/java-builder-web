"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Video } from "lucide-react";
import { SetupStage } from "@/components/interview-arena/SetupStage";
import { InterviewStage } from "@/components/interview-arena/InterviewStage";
import { FeedbackStage } from "@/components/interview-arena/FeedbackStage";
import { SummaryStage } from "@/components/interview-arena/SummaryStage";

import {
  Question,
  QuestionResult,
  interviewers,
  questionPool
} from "@/components/interview-arena/types";

export default function InterviewArenaClient() {
  const [stage, setStage] = useState<"setup" | "interview" | "feedback" | "summary">("setup");

  // Setup config states
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["spring-boot"]);
  const [selectedLevel, setSelectedLevel] = useState<"fresher" | "junior" | "middle" | "senior">("middle");

  // Call settings states
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [showAnswerPanel, setShowAnswerPanel] = useState<boolean>(true);

  // Active call session states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes per question
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Voice simulator typing transcript states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Evaluation results accumulator
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<QuestionResult | null>(null);

  // Camera canvas element ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Dynamically compile questions based on selected topics
  const questions: Question[] = useMemo(() => {
    let list: Question[] = [];
    selectedTopics.forEach(topicId => {
      if (questionPool[topicId]) {
        list = [...list, ...questionPool[topicId]];
      }
    });
    if (list.length === 0) {
      list = [...questionPool["spring-boot"], ...questionPool["java"]];
    }
    return list.slice(0, 3);
  }, [selectedTopics]);

  // Dynamically resolve the corresponding AI Persona interviewer
  const currentInterviewer = useMemo(() => {
    const firstTopic = selectedTopics[0] || "spring-boot";
    let interviewerId = "spring-boot-ai";
    if (firstTopic === "concurrency" || firstTopic === "redis" || firstTopic === "kubernetes") {
      interviewerId = "concurrency-ai";
    } else if (firstTopic === "java" || firstTopic === "git" || firstTopic === "design-pattern") {
      interviewerId = "java-core-ai";
    }
    return interviewers.find(i => i.id === interviewerId) || interviewers[0];
  }, [selectedTopics]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Request/release local camera stream based on stage and toggles
  useEffect(() => {
    async function startCamera() {
      if (stage === "interview" && isCameraOn) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, facingMode: "user" },
            audio: false
          });
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.warn("Camera not available or permission denied:", err);
        }
      } else {
        stopCamera();
      }
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [stage, isCameraOn]);

  const handleSubmitAnswer = useCallback(() => {
    if (!studentAnswer.trim()) return;

    setIsTimerRunning(false);
    setIsEvaluating(true);

    setTimeout(() => {
      const activeQuestion = questions[currentQuestionIdx];
      const answerLower = studentAnswer.toLowerCase();
      const matchedPoints: string[] = [];
      const missedPoints: string[] = [];

      activeQuestion.keyPoints.forEach(point => {
        const keywords = point.toLowerCase().split(/[\s,.:()]+/);
        const matchCount = keywords.filter(word => word.length > 3 && answerLower.includes(word)).length;

        if (matchCount >= 2 || (point.includes("N+1") && answerLower.includes("n+1")) || (point.includes("Join") && answerLower.includes("join"))) {
          matchedPoints.push(point);
        } else {
          missedPoints.push(point);
        }
      });

      let rawScore = 4 + (matchedPoints.length / activeQuestion.keyPoints.length) * 5;
      rawScore = parseFloat((rawScore + Math.random() * 0.8).toFixed(1));
      if (rawScore > 10) rawScore = 10;

      const qResult: QuestionResult = {
        questionId: activeQuestion.id,
        questionText: activeQuestion.text,
        score: rawScore,
        strengths: matchedPoints.length > 0 ? matchedPoints : ["Bạn có nỗ lực trả lời đúng trọng tâm câu hỏi."],
        weaknesses: missedPoints.length > 0 ? missedPoints : ["Câu trả lời của bạn rất đầy đủ, không thiếu ý chính nào."],
        studentAnswer: studentAnswer,
        sampleAnswer: activeQuestion.sampleAnswer
      };

      setResults(prev => [...prev, qResult]);
      setCurrentFeedback(qResult);
      setIsEvaluating(false);
      setStage("feedback");
    }, 2000);
  }, [studentAnswer, questions, currentQuestionIdx]);

  // Timer countdown hook
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleSubmitAnswer();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft, handleSubmitAnswer]);

  // Voice output (Read AI question out loud)
  const speakQuestion = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/`/g, "").replace(/\(.*?\)/g, "").replace(/✔/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "vi-VN";

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.startsWith("vi") || v.lang.includes("viet"));
      if (viVoice) {
        utterance.voice = viVoice;
      }
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecording = () => {
    if (isRecording) return;
    setIsRecording(true);
    setVoiceTranscript("");

    const targetText = questions[currentQuestionIdx].sampleAnswer;
    const words = targetText.split(" ");
    let currentWordIdx = 0;

    recordingIntervalRef.current = setInterval(() => {
      if (currentWordIdx < words.length) {
        setVoiceTranscript(prev => {
          const nextVal = prev ? prev + " " + words[currentWordIdx] : words[currentWordIdx];
          setStudentAnswer(nextVal);
          return nextVal;
        });
        currentWordIdx++;
      } else {
        stopVoiceRecording();
      }
    }, 380);
  };

  const stopVoiceRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startInterview = () => {
    setStage("interview");
    setCurrentQuestionIdx(0);
    setResults([]);
    setTimeLeft(180);
    setIsTimerRunning(true);
    setStudentAnswer("");
    setVoiceTranscript("");
    setIsRecording(false);
    setShowAnswerPanel(true);

    // Auto speak question after a small delay
    setTimeout(() => {
      speakQuestion(questions[0].text);
    }, 800);
  };

  const handleNextQuestion = () => {
    stopVoiceRecording();
    if (currentQuestionIdx + 1 < questions.length) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setStudentAnswer("");
      setVoiceTranscript("");
      setTimeLeft(180);
      setIsTimerRunning(true);
      setStage("interview");

      setTimeout(() => {
        speakQuestion(questions[nextIdx].text);
      }, 800);
    } else {
      stopCamera();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setStage("summary");
    }
  };

  const endCallEarly = () => {
    stopVoiceRecording();
    stopCamera();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStage("setup");
  };

  const totalScore = useMemo(() => {
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, r) => acc + r.score, 0);
    return parseFloat((sum / results.length).toFixed(1));
  }, [results]);

  const finalSalaryProposal = useMemo(() => {
    let base = 7000000;
    if (selectedLevel === "junior") base = 12000000;
    if (selectedLevel === "middle") base = 22000000;
    if (selectedLevel === "senior") base = 38000000;

    const performanceRatio = totalScore / 10;
    const salary = base * performanceRatio;
    return Math.round(salary / 500000) * 500000;
  }, [totalScore, selectedLevel]);

  const finalGrade = useMemo(() => {
    if (totalScore >= 8.0) return "PASS (Xuất sắc)";
    if (totalScore >= 6.5) return "PASS (Đạt yêu cầu)";
    return "FAIL (Cần ôn luyện thêm)";
  }, [totalScore]);

  const handleToggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(prev => prev.filter(id => id !== topicId));
      }
    } else {
      if (selectedTopics.length >= 3) {
        alert("Bạn chỉ được chọn tối đa 3 chủ đề cùng lúc để tránh làm loãng câu hỏi phỏng vấn!");
        return;
      }
      setSelectedTopics(prev => [...prev, topicId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 text-gray-900 dark:text-slate-100">

      {/* Dynamic Header */}
      <div className="bg-[#0F172A] border-b border-slate-800 text-white relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Video className="w-3.5 h-3.5" />
              Giao diện Phỏng vấn Video 1:1
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Đấu trường Phỏng vấn Video AI 1:1
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Trải nghiệm giả lập phỏng vấn trực diện qua Web Camera. Kích hoạt camera của bạn để đối thoại trực diện 1:1 với nhà tuyển dụng ảo Spring Boot/Java.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {stage === "setup" && (
          <SetupStage
            selectedTopics={selectedTopics}
            selectedLevel={selectedLevel}
            currentInterviewer={currentInterviewer}
            onToggleTopic={handleToggleTopic}
            onSetLevel={setSelectedLevel}
            onStartInterview={startInterview}
          />
        )}

        {/* STAGE 2: ACTIVE 1:1 VIDEO INTERVIEW CALL */}
        {stage === "interview" && (
          <InterviewStage
            currentQuestionIdx={currentQuestionIdx}
            questions={questions}
            currentInterviewer={currentInterviewer}
            timeLeft={timeLeft}
            formatTime={formatTime}
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isRecording={isRecording}
            voiceTranscript={voiceTranscript}
            studentAnswer={studentAnswer}
            showAnswerPanel={showAnswerPanel}
            isEvaluating={isEvaluating}
            videoRef={videoRef}
            onToggleCamera={() => setIsCameraOn(prev => !prev)}
            onToggleMic={() => setIsMicOn(prev => !prev)}
            onToggleAnswerPanel={() => setShowAnswerPanel(prev => !prev)}
            onStartVoiceRecording={startVoiceRecording}
            onStopVoiceRecording={stopVoiceRecording}
            onSetStudentAnswer={setStudentAnswer}
            onSubmitAnswer={handleSubmitAnswer}
            onEndCallEarly={endCallEarly}
          />
        )}

        {/* STAGE 3: QUESTION EVALUATION FEEDBACK */}
        {stage === "feedback" && (
          <FeedbackStage
            currentQuestionIdx={currentQuestionIdx}
            questions={questions}
            currentFeedback={currentFeedback}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {/* STAGE 4: SUMMARY REPORT CARD */}
        {stage === "summary" && (
          <SummaryStage
            results={results}
            totalScore={totalScore}
            finalGrade={finalGrade}
            finalSalaryProposal={finalSalaryProposal}
            selectedLevel={selectedLevel}
            onResetInterview={() => setStage("setup")}
          />
        )}

      </div>
    </div>
  );
}
