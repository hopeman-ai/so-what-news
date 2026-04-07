"use client";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-4xl mb-3 opacity-30">📰</div>
      <h3 className="text-lg font-bold text-gray-400 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-md mx-auto">{description}</p>
    </div>
  );
}
