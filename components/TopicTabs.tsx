"use client";

import { TopicGroupAnalysis } from "@/types/news";

interface TopicTabsProps {
  groups: TopicGroupAnalysis[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function TopicTabs({
  groups,
  selectedIndex,
  onSelect,
}: TopicTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      {groups.map((group, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 transition-all ${
            i === selectedIndex
              ? "bg-neutral-800 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <span
            className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 ${
              i === selectedIndex
                ? "bg-white/25 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {i + 1}
          </span>
          <span className="truncate max-w-[140px] sm:max-w-none">
            {group.groupTitle}
          </span>
        </button>
      ))}
    </div>
  );
}
