"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Crown, ChevronRight, Play, Clock, Star, Target, Brain, Sword, Shield, Zap } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import { courses } from "@/app/data/courses";
import { Chess } from "chess.js";
import LearnSidebar from '@/components/LearnSidebar';
import { ProgressBar } from '@/components/ui/ProgressBar';

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

const MiniChessboard = dynamic(
	() => import('react-chessboard').then((m) => m.Chessboard),
	{ ssr: false }
);

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), { ssr: false });

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

function OpeningCard({ opening }) {
	const [game, setGame] = useState(new Chess());
	const [fen, setFen] = useState(game.fen());
	const [animating, setAnimating] = useState(false);
	const animationRef = useRef(null);

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
	// Define course groups explicitly for layout and alignment
	const openingsWhite = courses.filter(c => c.category === 'Openings' && c.side === 'White').slice(0, 3);
	const openingsBlack = courses.filter(c => c.category === 'Openings' && c.side === 'Black').slice(0, 3);
	const endgamesByPiece = courses.filter(c => c.category === 'Endgames by Piece').slice(0, 3);
	const tacticsAndStrategy = courses.filter(c => c.category === 'Tactics' || c.category === 'Strategy').slice(0, 3);

	const renderCourseRow = (title, courseList) => (
		<div className="mb-12">
			<h2 className="text-xl font-bold text-[var(--primary-text)] mb-4">{title}</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{courseList.map(course => (
					<div key={course.slug} className="card border border-[var(--accent)] shadow-lg p-4 flex flex-col h-full min-h-[340px]">
						<div className="flex items-center gap-3 mb-2">
							<img src={course.icon || '/public/placeholder-logo.png'} className="w-12 h-12 rounded" />
							<div className="font-bold text-[var(--primary-text)]">{course.title}</div>
						</div>
						<p className="text-[var(--secondary-text)] text-sm mb-2 flex-1">{course.subtitle || course.description}</p>
						<ProgressBar progress={course.progress || 0} />
						<div className="flex-1" />
						<Link href={`/learn/courses/${course.slug}`} className="btn border border-[var(--accent)] hover:glow-accent mt-3 text-center w-full">Start Course</Link>
					</div>
				))}
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
