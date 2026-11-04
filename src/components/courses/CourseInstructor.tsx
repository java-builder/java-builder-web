"use client";

import { useState } from "react";
import Image from "next/image";
import { UserSummaryResponse } from "@/types/user";

interface CourseInstructorProps {
  instructor?: UserSummaryResponse | null;
}

export default function CourseInstructor({ instructor }: CourseInstructorProps) {
  const [imgError, setImgError] = useState(false);
  const username = instructor?.username || "JavaBuilder";
  const avatarUrl = instructor?.avatarUrl || "/logos/java-logo.png";

  return (
    <div className="space-y-6">
      {/* Instructor Profile */}
      <div className="flex items-start gap-4 p-5 sm:p-6 bg-background/60 border border-border rounded-2xl">
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-primary-soft border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
          {!imgError ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={56}
              height={56}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{username.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-0.5">
            {username}
          </h3>
          <p className="text-primary text-xs font-semibold mb-2">
            Backend Developer &amp; Instructor
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            Chuyên gia phát triển backend với kinh nghiệm sâu về Java, Spring
            Boot và các công nghệ cloud. Đam mê chia sẻ kiến thức thực chiến và
            đồng hành cùng học viên trên lộ trình trở thành Backend Developer chuyên nghiệp.
          </p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h4 className="font-bold text-sm text-foreground mb-3">
          Kỹ năng chuyên môn
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "Java",
            "Spring Boot",
            "Docker",
            "PostgreSQL",
            "MongoDB",
            "AWS",
            "Kubernetes",
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary-soft text-primary rounded-full text-xs font-semibold border border-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
