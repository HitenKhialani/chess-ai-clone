import Link from 'next/link';
import { useState } from 'react';
import { coursesData } from '@/app/learn/courses/data';
import { ProgressBar } from './ui/ProgressBar';

export default function LearnSidebar({ user, continueCourseSlug }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="bg-[var(--card)] border-r border-[var(--shadow)] min-h-screen w-72 p-6 flex flex-col gap-6 fixed top-0 left-0 z-30 md:relative md:z-auto md:block">
      {/* User Info */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <img src={user.avatar || '/public/placeholder-user.jpg'} alt="avatar" className="w-14 h-14 rounded-full border-2 border-[var(--accent)]" />
        <div className="font-bold text-[var(--primary-text)] text-lg">Hi, {user.name}</div>
        <div className="flex gap-2 mt-1">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">LVL {user.level} {user.xp} XP</span>
          <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-full text-xs font-semibold">🔥 {user.streak}d</span>
        </div>
        <div className="flex gap-1 mt-1">
          {user.badges.map((badge, i) => (
            <span key={i} className="bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded text-xs">{badge}</span>
          ))}
        </div>
      </div>
      {/* Continue Where You Left Off */}
      {continueCourseSlug && (
        <Link href={`/learn/courses/${continueCourseSlug}`}
          className="block bg-[var(--accent)]/10 border border-[var(--accent)] rounded-lg p-3 mb-4 text-[var(--primary-text)] hover:shadow-lg transition">
          <div className="font-semibold text-[var(--accent)] text-sm mb-1">Continue where you left off</div>
          <div className="font-bold text-base">{coursesData[continueCourseSlug]?.title}</div>
        </Link>
      )}
      {/* Courses List */}
      <div className="flex-1 overflow-y-auto">
        <div className="font-semibold text-[var(--secondary-text)] mb-2">Courses</div>
        <ul className="flex flex-col gap-3">
          {Object.entries(coursesData).map(([slug, course]) => (
            <li key={slug}>
              <Link href={`/learn/courses/${slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--accent)]/10 transition">
                <img src={course.icon || '/public/placeholder-logo.png'} alt="icon" className="w-8 h-8 rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-[var(--primary-text)] text-sm">{course.title}</div>
                  <ProgressBar progress={course.progress} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
} 