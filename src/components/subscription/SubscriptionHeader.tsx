"use client";

interface SubscriptionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SubscriptionHeader({
  title,
  subtitle,
}: SubscriptionHeaderProps) {
  return (
    <div className="min-w-0">
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}
