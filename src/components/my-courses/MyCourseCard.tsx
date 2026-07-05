"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import {
  CourseFormat,
  CourseLevel,
  MyEnrolledCourseResponse,
} from "@/types/course";
import { getLevelTone, getProgressTone } from "./helpers";

interface MyCourseCardProps {
  course: MyEnrolledCourseResponse;
  enrolledAtDate: string;
  levelLabel: string;
  statusCompletedLabel: string;
  statusLearningLabel: string;
  progressLabel: string;
  lessonsLabel: string;
  durationLabel: string;
  enrolledAtLabel: string;
  btnStartLabel: string;
  btnContinueLabel: string;
  btnReviewLabel: string;
}

export default function MyCourseCard({
  course,
  enrolledAtDate,
  levelLabel,
  statusCompletedLabel,
  statusLearningLabel,
  progressLabel,
  lessonsLabel,
  durationLabel,
  enrolledAtLabel,
  btnStartLabel,
  btnContinueLabel,
  btnReviewLabel,
}: MyCourseCardProps) {
  const levelTone = getLevelTone(course.level as CourseLevel | undefined);
  const progressTone = getProgressTone(course.progress);

  const href =
    course.courseFormat === CourseFormat.TEXT
      ? `/docs/${course.slug}`
      : `/learn/${course.slug}/${course.id}`;

  const buttonLabel =
    course.progress === 0
      ? btnStartLabel
      : course.completed
        ? btnReviewLabel
        : btnContinueLabel;

  const ButtonIcon = course.completed
    ? RotateCcw
    : course.progress === 0
      ? PlayCircle
      : PlayCircle;

  const showProgress = true;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:border-accent/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-700">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={
              course.courseFormat === CourseFormat.TEXT
                ? "object-contain"
                : "object-cover transition-transform duration-300 group-hover:scale-105"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 to-accent-600/15 text-accent">
            <BookOpen className="h-10 w-10" />
          </div>
        )}

        {/* Status pill */}
        <div className="absolute left-3 top-3">
          {course.completed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-slate-900/90 dark:text-emerald-400 dark:ring-emerald-800/40">
              <CheckCircle2 className="h-3 w-3" />
              {statusCompletedLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-accent shadow-sm ring-1 ring-accent/20 dark:bg-slate-900/90">
              <PlayCircle className="h-3 w-3" />
              {statusLearningLabel}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {course.level && (
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${levelTone.pill}`}
            >
              {levelLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
            <CalendarDays className="h-3 w-3" />
            {enrolledAtLabel.replace("{date}", enrolledAtDate)}
          </span>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition group-hover:text-accent dark:text-white">
          {course.title}
        </h3>

        {course.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {course.description}
          </p>
        )}

        {/* Progress */}
        {showProgress && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {progressLabel}
              </span>
              <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
                {course.progress}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressTone}`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <BookOpen className="h-3 w-3" />
                {lessonsLabel
                  .replace("{completed}", String(course.completedLessons))
                  .replace("{total}", String(course.totalLessons))}
              </span>
              {course.duration && (
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock className="h-3 w-3" />
                  {durationLabel.replace("{hours}", String(course.duration))}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-auto pt-4">
          <span className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-accent-600">
            <ButtonIcon className="h-4 w-4" />
            {buttonLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
