import React from 'react';
import Link from 'next/link';

const lessons = [
  {
    number: 1,
    title: 'Italian Game – Attack the Center',
    difficulty: 'Easy',
    href: '/learn/courses/one-e4-openings-explained-lesson-1',
  },
  {
    number: 2,
    title: 'Scotch Game – Open the Center Quickly',
    difficulty: 'Intermediate',
    href: '/learn/courses/one-e4-openings-explained-lesson-2',
  },
  {
    number: 3,
    title: "King's Gambit – Sacrifice for Attack",
    difficulty: 'Advanced',
    href: '/learn/courses/one-e4-openings-explained-lesson-3',
  },
];

export default function OneE4OpeningsExplainedLessonsList() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-8">1.e4 Openings Explained – Lessons</h1>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.number}
              className="flex items-center justify-between bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="text-lg font-semibold">Lesson {lesson.number}</div>
                <div className="font-bold text-xl mb-1">{lesson.title}</div>
                <span className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {lesson.difficulty}
                </span>
              </div>
              <Link href={lesson.href} passHref legacyBehavior>
                <a className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors text-2xl font-bold">
                  &gt;
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 