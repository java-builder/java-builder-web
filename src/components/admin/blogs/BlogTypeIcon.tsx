import { BlogType } from "@/types/blog";
import {
  Lightbulb,
  BookOpen,
  HelpCircle,
  MessagesSquare,
  Zap,
  Star,
  Newspaper,
  FileText,
} from "lucide-react";

interface BlogTypeIconProps {
  blogType: BlogType;
  className?: string;
}

export default function BlogTypeIcon({
  blogType,
  className = "w-5 h-5",
}: BlogTypeIconProps) {
  switch (blogType) {
    case BlogType.EXPERIENCE:
      return <Lightbulb className={className} />;
    case BlogType.TUTORIAL:
      return <BookOpen className={className} />;
    case BlogType.QUESTION:
      return <HelpCircle className={className} />;
    case BlogType.DISCUSSION:
      return <MessagesSquare className={className} />;
    case BlogType.TIPS:
      return <Zap className={className} />;
    case BlogType.REVIEW:
      return <Star className={className} />;
    case BlogType.NEWS:
      return <Newspaper className={className} />;
    default:
      return <FileText className={className} />;
  }
}
