import { Semester, GradeScale } from "@/types/gp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSmartAdvice } from "@/lib/gpCalculations";
import { Lightbulb, TrendingDown, Target } from "lucide-react";

interface AdvicePanelProps {
  semesters: Semester[];
  scale: GradeScale[];
  targetGPA?: number;
  remainingSemesters?: number;
  avgCreditsPerSemester?: number;
}

export function AdvicePanel({ semesters, scale, targetGPA, remainingSemesters, avgCreditsPerSemester }: AdvicePanelProps) {
  const advice = getSmartAdvice(semesters, scale, targetGPA, remainingSemesters, avgCreditsPerSemester);
  const hasContent = advice.dropCourses.length > 0 || advice.projectionAdvice;

  return (
    <Card className="animate-fade-in border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Smart Advice</CardTitle>
            <CardDescription>Insights on what affected your GPA and how to improve</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {!hasContent && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add at least two semesters or set a projection target to get advice.
          </p>
        )}

        {/* Courses that caused GPA drops */}
        {advice.dropCourses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <h4 className="text-sm font-semibold">Courses That Dropped Your GPA</h4>
            </div>
            {advice.dropCourses.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.course.name}</span>
                    <span className="text-xs text-muted-foreground">{item.semesterName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projection-based advice */}
        {advice.projectionAdvice && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold">Minimum GP to Hit Your Target</h4>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm leading-relaxed">{advice.projectionAdvice}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}