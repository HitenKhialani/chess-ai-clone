'use client';

import AuthCard from '@/components/AuthCard';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center krishna-gradient relative overflow-hidden">
      <div className="bg-wallpaper-corner krishna-image-glow" />
      <div className="relative z-10">
        <AuthCard />
      </div>
    </main>
  );
} 