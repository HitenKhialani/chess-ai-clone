import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Target, CheckCircle, Star, Users, Trophy, Sparkles, Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StrategicPlanningOverview() {
  return (
    <div className="space-y-8">
      {/* Back Navigation Bar */}
      <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] text-[var(--card-foreground)] p-4 shadow-lg rounded-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            href="/learn" 
            className="flex items-center text-[var(--card-foreground)] hover:text-[var(--card-foreground)]/80 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-bold">Back to All Courses</span>
          </Link>
        </div>
      </div>
      {/* Single Comprehensive Card */}
      <Card className="bg-[var(--card)] border-[var(--border)] hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-[var(--primary-text)] text-3xl mb-4">
            <Brain className="w-8 h-8 mr-3" />
            Complete Course Overview
          </CardTitle>
          <CardDescription className="text-[var(--muted-foreground)] text-lg">
            Everything you need to know about the Strategic Planning Course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Course Description */}
          <div className="bg-[var(--card)] rounded-lg p-6">
            <p className="text-[var(--primary-text)] leading-relaxed text-lg">
              Master the art of strategic planning in chess! Learn how to create long-term plans, 
              understand positional concepts, and develop the thinking skills that separate strong 
              players from beginners. This course will transform your approach to chess.
            </p>
          </div>

          {/* Course Details Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-lg">
              <span className="text-[var(--primary-text)] font-semibold">Difficulty:</span>
              <div className="bg-[var(--accent)] text-[var(--card-foreground)] px-3 py-1 rounded text-sm font-bold">Advanced</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-lg">
              <span className="text-[var(--primary-text)] font-semibold">Duration:</span>
              <div className="bg-[var(--accent)] text-[var(--card-foreground)] px-3 py-1 rounded text-sm font-bold">3 hours</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-lg">
              <span className="text-[var(--primary-text)] font-semibold">Lessons:</span>
              <div className="bg-[var(--accent)] text-[var(--card-foreground)] px-3 py-1 rounded text-sm font-bold">3 lessons</div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-[var(--card)] rounded-lg p-6">
            <h3 className="flex items-center text-[var(--accent)] text-xl font-bold mb-4">
              <Target className="w-6 h-6 mr-2" />
              What You'll Learn
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                <div>
                  <h4 className="font-semibold text-[var(--accent)]">Long-term Planning</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Learn to create and execute long-term plans</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                <div>
                  <h4 className="font-semibold text-[var(--accent)]">Positional Understanding</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Master positional concepts and evaluation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                <div>
                  <h4 className="font-semibold text-[var(--accent)]">Strategic Thinking</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Develop deep strategic thinking skills</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
                <div>
                  <h4 className="font-semibold text-[var(--accent)]">Game Planning</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Learn to plan entire games strategically</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose This Course */}
          <div className="bg-[var(--card)] rounded-lg p-6">
            <h3 className="flex items-center text-[var(--accent)] text-xl font-bold mb-4">
              <Star className="w-6 h-6 mr-2" />
              Why Choose This Course?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-[var(--accent)] mb-2">Strategic Mastery</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Master strategic thinking in chess</p>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-[var(--accent)] mb-2">Positional Play</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Develop deep positional understanding</p>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-[var(--accent)] mb-2">Game Planning</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Learn to plan entire games</p>
          </div>
        </div>
      </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold text-[var(--card-foreground)] mb-4">Ready to Start Your Chess Journey?</h2>
            <p className="text-[var(--card-foreground)]/90 mb-6 text-lg">
              Learn the art of strategic thinking and long-term planning
            </p>
            <Link href="/learn/courses/strategic-planning-lesson-1">
              <Button size="lg" className="bg-[var(--accent-foreground)] text-[var(--accent)] hover:bg-[var(--accent-foreground)]/90 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                <Brain className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 