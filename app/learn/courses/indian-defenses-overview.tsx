import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Target, CheckCircle, Star, Users, Trophy, Sparkles, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IndianDefensesOverview() {
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
            <Globe className="w-8 h-8 mr-3" />
            Complete Course Overview
          </CardTitle>
          <CardDescription className="text-[var(--muted-foreground)] text-lg">
            Everything you need to know about the Indian Defenses Course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Course Description */}
          <div className="bg-[var(--card)] rounded-lg p-6">
            <p className="text-[var(--primary-text)] leading-relaxed text-lg">
              Master the Indian Defenses, a family of openings that lead to rich strategic positions. 
              Learn the key ideas behind 1...Nf6, typical pawn structures, and how to handle various 
              white setups with flexible and dynamic play.
            </p>
          </div>

          {/* Course Details Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-lg">
              <span className="text-[var(--primary-text)] font-semibold">Difficulty:</span>
              <div className="bg-[var(--accent)] text-[var(--card-foreground)] px-3 py-1 rounded text-sm font-bold">Intermediate</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--secondary)] rounded-lg">
              <span className="text-[var(--primary-text)] font-semibold">Duration:</span>
              <div className="bg-[var(--accent)] text-[var(--card-foreground)] px-3 py-1 rounded text-sm font-bold">2 hours</div>
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
                  <h4 className="font-semibold text-[var(--accent)]">Indian Systems</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Master the key Indian Defense systems</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                <div>
                  <h4 className="font-semibold text-[var(--accent)]">Pawn Structures</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Understand typical Indian Defense structures</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                <div>
                  <h4 className="font-semibold text-[var(--accent)]">Strategic Play</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Learn positional concepts and plans</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
          <div>
                  <h4 className="font-semibold text-[var(--accent)]">Dynamic Play</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Master dynamic and flexible positions</p>
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
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-[var(--accent)] mb-2">Indian Systems</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Master classic Indian Defense systems</p>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-[var(--accent)] mb-2">Strategic Depth</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Develop deep strategic understanding</p>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-[var(--accent)] mb-2">Flexible Play</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Learn adaptable and dynamic play</p>
        </div>
        </div>
      </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold text-[var(--card-foreground)] mb-4">Ready to Start Your Chess Journey?</h2>
            <p className="text-[var(--card-foreground)]/90 mb-6 text-lg">
              Join thousands of players who have mastered the fundamentals with our interactive course
            </p>
            <Link href="/learn/courses/indian-defenses-lesson-1">
              <Button size="lg" className="bg-[var(--accent-foreground)] text-[var(--accent)] hover:bg-[var(--accent-foreground)]/90 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 