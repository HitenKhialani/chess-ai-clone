"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Crown, ChevronRight, Play, Clock, Star, Target, Brain, Sword, Shield, Zap, Lock } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic';
import { useState, useRef, ComponentType } from 'react';
import { courses, Course } from "@/app/data/courses";
import { Chess } from "chess.js";
import LearnSidebar from '@/components/LearnSidebar';
import { ProgressBar } from '@/components/ui/ProgressBar';
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

const openings = [
	{
		name: "Ruy Lopez",
		description: "A classic opening that develops pieces naturally and fights for the center",
		moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bb5"],
		difficulty: "Intermediate",
		popularity: 95,
		winRate: 52,
	},
	{
		name: "Sicilian Defense",
		description: "A sharp, aggressive defense that leads to complex tactical positions",
		moves: ["1.e4 c5"],
		difficulty: "Advanced",
		popularity: 90,
		winRate: 48,
	},
	{
		name: "Italian Game",
		description: "A solid opening that emphasizes quick development and central control",
		moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"],
		difficulty: "Beginner",
		popularity: 85,
		winRate: 50,
	},
	{
		name: "French Defense",
		description: "A solid defense that leads to closed, strategic positions",
		moves: ["1.e4 e6"],
		difficulty: "Intermediate",
		popularity: 80,
		winRate: 49,
	},
	{
		name: "King's Indian Defense",
		description: "A hypermodern opening that allows White to establish a large center",
		moves: ["1.d4 Nf6", "2.c4 g6"],
		difficulty: "Advanced",
		popularity: 75,
		winRate: 51,
	},
	{
		name: "London System",
		description: "A solid system-based opening that's easy to learn and hard to refute",
		moves: ["1.d4 d5", "2.Bf4"],
		difficulty: "Beginner",
		popularity: 70,
		winRate: 53,
	},
]

interface Opening {
	name: string;
	description: string;
	moves: string[];
	difficulty: string;
	popularity: number;
	winRate: number;
}

const MiniChessboard = dynamic(
	() => import('react-chessboard').then((m: { Chessboard: ComponentType<any> }) => m.Chessboard),
	{ ssr: false }
);

const Chessboard = dynamic(() => import("react-chessboard").then((m: { Chessboard: ComponentType<any> }) => m.Chessboard), { ssr: false });

const learnData = {
	opening: [
		{
			title: "Ruy Lopez",
			description: "A classic opening that develops pieces naturally and fights for the center",
			keyLine: "1.e4 e5, 2.Nf3 Nc6, 3.Bb5",
			difficulty: "Intermediate",
			popularity: 95,
			winRate: 52,
		},
		{
			title: "Sicilian Defense",
			description: "A sharp, aggressive defense that leads to complex tactical positions",
			keyLine: "1.e4 c5",
			difficulty: "Advanced",
			popularity: 90,
			winRate: 48,
		},
		{
			title: "Italian Game",
			description: "A solid opening that emphasizes quick development and central control",
			keyLine: "1.e4 e5, 2.Nf3 Nc6, 3.Bc4",
			difficulty: "Beginner",
			popularity: 85,
			winRate: 50,
		},
		{
			title: "French Defense",
			description: "A solid defense that leads to closed, strategic positions",
			keyLine: "1.e4 e6",
			difficulty: "Intermediate",
			popularity: 80,
			winRate: 49,
		},
		{
			title: "King's Indian Defense",
			description: "A hypermodern opening that allows White to establish a large center",
			keyLine: "1.d4 Nf6, 2.c4 g6",
			difficulty: "Advanced",
			popularity: 75,
			winRate: 51,
		},
		{
			title: "London System",
			description: "A solid system-based opening that's easy to learn and hard to refute",
			keyLine: "1.d4 d5, 2.Bf4",
			difficulty: "Beginner",
			popularity: 70,
			winRate: 53,
		},
	],
	midgame: [
		{
			title: "Pawn Structures",
			description: "Master common pawn structures like isolated, hanging, and passed pawns.",
			keyLine: "weakness: d4 is isolated",
			difficulty: "Intermediate",
			popularity: 85,
			winRate: 52,
		},
		{
			title: "Rook Activity & Open Files",
			description: "Rooks shine when placed on open or semi-open files. Activating them early, connecting them, and using them to invade the 7th rank is a key winning plan in many middlegames. Rook activity often outweighs material — passive rooks lose games.",
			keyLine: "connected rooks, open files, 7th rank domination",
			difficulty: "Beginner",
			popularity: 77,
			winRate: 52,
		},
		{
			title: "Minor Piece Imbalances",
			description: "When is a knight better than a bishop? Learn positional factors.",
			keyLine: "N vs B imbalance",
			difficulty: "Advanced",
			popularity: 65,
			winRate: 49,
		},
	],
	endgame: [
		{
			title: "King and Pawn Endgames",
			description: "Learn key ideas like opposition, triangulation, and passed pawns.",
			keyLine: "King Opposition",
			difficulty: "Beginner",
			popularity: 82,
			winRate: 53,
		},
		{
			title: "Rook Endgames",
			description: "Master Lucena and Philidor positions. Crucial for practical play.",
			keyLine: "Lucena Position",
			difficulty: "Advanced",
			popularity: 78,
			winRate: 51,
		},
		{
			title: "Minor Piece Endgames",
			description: "Bishop + Knight checkmate, and theoretical draw positions.",
			keyLine: "B + N vs K",
			difficulty: "Advanced",
			popularity: 60,
			winRate: 47,
		},
	],
};

function OpeningCard({ opening }: { opening: Opening }) {
	const [game, setGame] = useState(new Chess());
	const [fen, setFen] = useState(game.fen());
	const [animating, setAnimating] = useState(false);
	const animationRef = useRef<NodeJS.Timeout | null>(null);

	// Flatten moves array (e.g. ["1.e4 e5", "2.Nf3 Nc6"] => ["e4", "e5", "Nf3", "Nc6"])
	const moves = opening.moves
		.map((m) => m.replace(/^[0-9]+\./, "").trim())
		.join(" ")
		.split(/\s+/)
		.filter((m) => m && !/^[0-9]+\./.test(m));

	const resetBoard = () => {
		setGame(new Chess());
		setFen(new Chess().fen());
		setAnimating(false);
		if (animationRef.current) clearTimeout(animationRef.current);
	};

	const animateMoves = async () => {
		resetBoard();
		setAnimating(true);
		let tempGame = new Chess();
		let i = 0;
		function step() {
			if (i < moves.length) {
				tempGame.move(moves[i]);
				setFen(tempGame.fen());
				i++;
				animationRef.current = setTimeout(step, 700);
			} else {
				setAnimating(false);
			}
		}
		step();
	};

	return (
		<div className="krishna-card rounded-xl p-6 shadow-lg text-white flex flex-col gap-3 purple-glow">
			<div className="font-bold text-lg mb-1">{opening.name}</div>
			<div className="text-rgb(200, 200, 200) text-sm mb-2">{opening.description}</div>
			<div className="mb-2">
				<Chessboard position={fen} arePiecesDraggable={false} boardWidth={260} />
			</div>
			<div className="flex gap-2 mb-2">
				<Button onClick={resetBoard} size="sm" variant="outline" disabled={animating} className="border-rgb(153, 0, 255)/30 text-white hover:bg-rgb(153, 0, 255)/20">Reset</Button>
				<Button onClick={animateMoves} size="sm" disabled={animating} className="bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) text-white">Review Opening</Button>
			</div>
			<div className="font-mono text-rgb(200, 200, 200) text-base mb-2">{opening.moves.join(", ")}</div>
			<div className="flex items-center gap-3 mt-auto">
				<Badge className="bg-rgb(153, 0, 255)/20 text-white px-3 py-1 text-xs font-semibold rounded border border-rgb(153, 0, 255)/30">{opening.difficulty}</Badge>
				<span className="text-xs text-rgb(200, 200, 200)">Popularity: {opening.popularity}%</span>
				<span className="text-xs text-rgb(200, 200, 200)">Win Rate: {opening.winRate}%</span>
			</div>
		</div>
	);
}

const mockUser = {
	name: 'ChessFan',
	avatar: '/public/placeholder-user.jpg',
	level: 1,
	xp: 85,
	streak: 3,
	badges: ['Starter', 'Streak 3d'],
};
const continueCourseSlug = 'opening-fundamentals';

// Group courses by category
const groupedCourses = courses.reduce((acc, course) => {
	if (!acc[course.category]) acc[course.category] = [];
	acc[course.category].push(course);
	return acc;
}, {} as Record<string, typeof courses>);

export default function LearnPage() {
	const { toast } = useToast();
	const { user, unlockCourse } = useUser();
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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

	// Define course groups explicitly for layout and alignment
	const openingsWhite = courses.filter(c => c.category === 'Openings' && c.side === 'White').slice(0, 3);
	const openingsBlack = courses.filter(c => c.category === 'Openings' && c.side === 'Black').slice(0, 3);
	const endgamesByPiece = courses.filter(c => c.category === 'Endgames by Piece').slice(0, 3);
	const tacticsAndStrategy = courses.filter(c => c.category === 'Tactics' || c.category === 'Strategy').slice(0, 3);

	const renderCourseRow = (title: string, courseList: Course[]) => (
		<div key={title}>
			<h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
				{courseList.map((course: Course) => {
					// For Tactics and Strategy section, enforce fixed card size and alignment
					const isTacticsOrStrategy = title === 'Tactics and Strategy';
					const cardClass = `bg-[var(--card)] border-[var(--border)] text-[var(--primary-text)] flex flex-col card-shadow min-h-[340px] h-full ${isTacticsOrStrategy ? 'max-h-[420px]' : ''}`;

					const isLocked = (course.category === 'Tactics' || course.category === 'Strategy') && !(user?.unlocked_courses ?? []).includes(course.slug);

					const courseCard = (
						<Card key={course.slug} className={cardClass}>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle className="text-lg font-bold text-[var(--primary-text)]">{course.title}</CardTitle>
										<CardDescription className="text-sm text-[var(--secondary-text)]">{course.subtitle}</CardDescription>
									</div>
									{isLocked && <Lock className="text-yellow-500" />}
								</div>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm mb-4 text-[var(--secondary-text)]">{course.description}</p>
								<div className="flex items-center text-xs text-[var(--secondary-text)] mb-4">
									<Clock size={14} className="mr-1" /> {course.estimatedTime}
									<span className="mx-2">|</span>
									<Badge variant="outline" className="border-[var(--border)] text-[var(--secondary-text)]">{course.difficulty}</Badge>
								</div>
							</CardContent>
							<div className="px-6 pb-4">
								<Button className="w-full bg-[var(--accent)] hover:bg-[#B5532A] text-white btn-glow">
									{isLocked ? 'Unlock Course' : 'Start Learning'}
									<ChevronRight size={16} className="ml-1" />
								</Button>
							</div>
						</Card>
					);

					if (isLocked) {
						return (
							<AlertDialog key={course.slug}>
								<AlertDialogTrigger asChild>
									<div className="cursor-pointer">
										{courseCard}
									</div>
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
						);
					}

					return (
						<Link href={`/learn/courses/${course.slug}`} key={course.slug}>
							{courseCard}
						</Link>
					);
				})}
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen bg-[var(--background)]">
			{/* Main Content */}
			<main className="flex-1 px-4 py-8 max-w-6xl mx-auto">
				<div className="text-center mb-10">
					<h1 className="text-5xl font-bold text-white mb-2">Learn</h1>
					<p className="text-lg text-[var(--secondary-text)]">Master chess step-by-step with interactive lessons and real game examples.</p>
				</div>
				{renderCourseRow('Openings with White', openingsWhite)}
				{renderCourseRow('Openings with Black', openingsBlack)}
				{renderCourseRow('Endgames by Piece', endgamesByPiece)}
				{renderCourseRow('Tactics and Strategy', tacticsAndStrategy)}
			</main>
		</div>
	);
}
