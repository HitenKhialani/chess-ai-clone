import { useState } from "react";
import { ProgressBar } from "./ui/ProgressBar";

export default function CourseDetailLayout({
  title,
  level,
  popularity,
  winRate,
  description,
  chapters = [],
  icon = "/public/placeholder-logo.png",
  progress = 0,
}) {
  const [expanded, setExpanded] = useState(0);
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-[var(--card)] border border-[var(--accent)] rounded-xl p-6 mb-6 flex gap-4 items-center">
          <img src={icon} className="w-20 h-20 rounded" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--primary-text)] mb-1">{title}</h1>
            <div className="flex gap-2 mb-1">
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-full text-xs font-semibold">{level}</span>
              <span className="text-[var(--secondary-text)] text-xs">Popularity: {popularity}%</span>
              <span className="text-[var(--secondary-text)] text-xs">Win Rate: {winRate}%</span>
            </div>
            <p className="text-[var(--secondary-text)] text-sm mb-2">{description}</p>
            <ProgressBar progress={progress} />
          </div>
        </div>
        {/* Chapters/Studies */}
        <div className="bg-[var(--card)] border border-[var(--shadow)] rounded-xl p-6">
          {chapters.map((chapter, i) => (
            <div key={i} className="mb-6">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === i ? -1 : i)}>
                <div className="font-bold text-[var(--primary-text)]">Chapter {i + 1}: {chapter.title}</div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-[var(--secondary-text)]">{chapter.duration}</span>
                  <ProgressBar progress={chapter.isCompleted ? 100 : 0} />
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${chapter.isCompleted ? 'bg-green-600 text-white' : 'bg-[var(--accent)]/20 text-[var(--accent)]'}`}>{chapter.isCompleted ? 'Completed' : 'In Progress'}</span>
                </div>
              </div>
              {expanded === i && (
                <div className="mt-4 ml-4">
                  <div className="text-[var(--secondary-text)] mb-2">{chapter.description}</div>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-[var(--secondary-text)]"><span>📝</span> Learn {chapter.content?.theory?.length || 0}</div>
                    <div className="flex items-center gap-1 text-xs text-[var(--secondary-text)]"><span>🎯</span> Key Ideas {chapter.content?.keyIdeas?.length || 0}</div>
                    <div className="flex items-center gap-1 text-xs text-[var(--secondary-text)]"><span>⏱️</span> {chapter.duration}</div>
                  </div>
                  <a href="#" className="btn border border-[var(--accent)] hover:glow-accent mt-3 inline-block">Start Lesson</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Practice Sidebar */}
      <div className="w-full md:w-64">
        <div className="bg-[var(--card)] border border-[var(--shadow)] rounded-xl p-6 flex flex-col gap-4">
          <div className="font-bold text-[var(--primary-text)] mb-2">Practice</div>
          <button className="btn border border-[var(--accent)] hover:glow-accent">Start Drill Shuffle</button>
          <button className="btn border border-[var(--accent)] hover:glow-accent">Play vs. Bot</button>
        </div>
      </div>
    </div>
  );
} 