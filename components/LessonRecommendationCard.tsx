import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface LessonRecommendationCardProps {
  blunderCount: number;
  theme: string;
  lessonPath: string[]; // e.g., ["Opening Principles", "Lesson 1"]
  lessonUrl: string;
}

export const LessonRecommendationCard: React.FC<LessonRecommendationCardProps> = ({
  blunderCount,
  theme,
  lessonPath,
  lessonUrl,
}) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">Lesson Recommendation</CardTitle>
        <CardDescription className="text-sm">
          {`You made ${blunderCount} blunder${blunderCount !== 1 ? 's' : ''} in the ${theme}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>
            Study: {lessonPath.map((part, i) => (
              <span key={i} className="font-semibold text-primary">
                {part}{i < lessonPath.length - 1 && <span className="mx-1 text-muted-foreground">→</span>}
              </span>
            ))}
          </span>
        </div>
        <Button asChild className="w-fit mt-2" variant="default">
          <a href={lessonUrl} target="_blank" rel="noopener noreferrer">
            📘 Go to Lesson
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonRecommendationCard; 