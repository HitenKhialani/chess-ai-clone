"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Crown, ChevronRight, Play, Clock, Star, Target, Brain, Sword, Shield, Zap, Lock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { courses, Course } from "@/app/data/courses";
import { useUser } from '@/components/UserProvider';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface Course {
	slug: string;
	title: string;
	subtitle: string;
	description: string;
	category: string;
	difficulty: string;
	estimatedTime: string;
	side?: 'White' | 'Black';
	chapters?: number;
	accuracy?: number;
	performance?: string;
	correctAnswers?: string;
	recommendation?: string;
	questions?: string[];
}

export default function LearnPage() {
	const { toast } = useToast();
	const { user, unlockCourse } = useUser();

	const handleUnlockCourse = async (course: Course) => {
		if (!user) {
			toast({
				title: "Authentication Error",
				description: "You must be logged in to unlock a course.",
				variant: "destructive",
			});
			return;
		}

		if ((user.coins ?? 0) < 5) {
			toast({
				title: "Insufficient Coins",
				description: "You do not have enough coins to unlock this course.",
				variant: "destructive",
			});
			return;
		}

		try {
			await unlockCourse(course.slug);
			toast({
				title: "Course Unlocked!",
				description: `You have successfully unlocked ${course.title}.`,
			});
		} catch (error: any) {
			toast({
				title: "Unlock Failed",
				description: error.message || "An unexpected error occurred.",
				variant: "destructive",
			});
		}
	};

	// Enhanced course data with performance metrics
	const enhancedCourses = courses.map(course => ({
		...course,
		accuracy: Math.floor(Math.random() * 100), // Simulated accuracy
		performance: Math.random() > 0.5 ? "Needs Review" : "Good Progress",
		correctAnswers: `${Math.floor(Math.random() * 5)}/${Math.floor(Math.random() * 5) + 3}`,
		recommendation: "Focus on understanding core concepts and practice more questions.",
		questions: ["1", "2", "3"].slice(0, Math.floor(Math.random() * 3) + 1)
	}));

	// Group courses by category - 3 courses per category for 12 total
	const fundamentals = enhancedCourses.filter(c => c.category === 'Fundamentals').slice(0, 3);
	const openingsWhite = enhancedCourses.filter(c => c.category === 'Openings' && c.side === 'White').slice(0, 3);
	const openingsBlack = enhancedCourses.filter(c => c.category === 'Openings' && c.side === 'Black').slice(0, 3);
	const endgamesByPiece = enhancedCourses.filter(c => c.category === 'Endgames by Piece').slice(0, 3);
	const tacticsAndStrategy = enhancedCourses.filter(c => c.category === 'Tactics' || c.category === 'Strategy').slice(0, 3);

	const renderPerformanceCard = (course: Course) => {
		const isLocked = (course.category === 'Tactics' || course.category === 'Strategy') && !(user?.unlocked_courses ?? []).includes(course.slug);

		return (
			<Card key={course.slug} className="rounded-2xl shadow-lg bg-[var(--card)] backdrop-blur-sm border border-[var(--accent)] hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden flex flex-col h-full">
				<CardContent className="p-6 flex flex-col h-full">
					{/* Title */}
					<CardTitle className="text-xl font-bold text-[var(--primary-text)] mb-3">
						{course.title}
					</CardTitle>

					{/* Description */}
					<p className="text-[var(--secondary-text)] text-sm mb-6 leading-relaxed flex-grow">
						{course.description}
					</p>

					{/* Course Details */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-[var(--secondary-text)]" />
							<span className="text-[var(--primary-text)] text-sm">{course.estimatedTime}</span>
						</div>
						<div className="w-px h-4 bg-[var(--border)]"></div>
						<div className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-1">
							<span className="text-[var(--primary-text)] text-sm">{course.difficulty}</span>
						</div>
					</div>

					{/* Action Button */}
					<div className="mt-auto pt-4">
						{isLocked ? (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] hover:from-[var(--accent)]/90 hover:to-[var(--accent-soft)]/90 text-[var(--card-foreground)] font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
										<Lock className="h-4 w-4 mr-2" />
										Unlock Course
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Unlock Course?</AlertDialogTitle>
										<AlertDialogDescription>
											Do you want to unlock this course for 5 coins?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={() => handleUnlockCourse(course)}>
											Unlock
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						) : (
							<Link href={`/learn/courses/${course.slug}`}>
								<Button className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] hover:from-[var(--accent)]/90 hover:to-[var(--accent-soft)]/90 text-[var(--card-foreground)] font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
									<Play className="h-4 w-4 mr-2" />
									Start Learning
								</Button>
							</Link>
						)}
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="min-h-screen pt-20 pb-16 bg-background">
			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="flex items-center justify-center mb-4">
						<div className="p-3 rounded-full bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20 backdrop-blur-sm border border-[#00F5D4]/30">
							<BookOpen className="w-8 h-8 text-[#00F5D4]" />
						</div>
					</div>
					<h1 className="text-5xl font-bold mb-4 text-[var(--primary-text)]">
						Chess Learning
					</h1>
					<p className="text-xl text-[var(--secondary-text)] max-w-2xl mx-auto leading-relaxed">
						Master chess with comprehensive courses and personalized training.
					</p>
				</div>

				{/* Chapter-wise Performance Analysis */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-6 text-foreground">
						Chapter-wise Performance Analysis
					</h2>
					<p className="text-sm text-muted-foreground mb-6">
						Detailed breakdown of your performance across different topics.
					</p>
					
					{/* Course Categories with Headings */}
					<div className="space-y-8">
						{/* Fundamentals */}
						<div>
							<h3 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								Fundamentals
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{fundamentals.map(course => renderPerformanceCard(course))}
							</div>
						</div>

						{/* Openings White */}
						<div>
							<h3 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								White Openings
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{openingsWhite.map(course => renderPerformanceCard(course))}
							</div>
						</div>

						{/* Openings Black */}
						<div>
							<h3 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								Black Openings
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{openingsBlack.map(course => renderPerformanceCard(course))}
							</div>
						</div>

						{/* Endgames */}
						<div>
							<h3 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
								<Target className="h-5 w-5" />
								Endgame Techniques
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{endgamesByPiece.map(course => renderPerformanceCard(course))}
							</div>
						</div>

						{/* Tactics & Strategy */}
						<div>
							<h3 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
								<Brain className="h-5 w-5" />
								Tactics & Strategy
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{tacticsAndStrategy.map(course => renderPerformanceCard(course))}
							</div>
						</div>
					</div>
				</div>


			</main>
		</div>
	);
}
