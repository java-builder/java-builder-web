import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: number;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

export default function UserAvatar({ src, name, size = 32 }: UserAvatarProps) {
  if (src) {
    return (
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent text-white"
      style={{ width: size, height: size }}
    >
      <span className={`font-semibold ${size <= 32 ? "text-xs" : "text-sm"}`}>
        {getInitials(name)}
      </span>
    </div>
  );
}
