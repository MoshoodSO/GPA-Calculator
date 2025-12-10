import { Semester, GradeScale } from "@/types/gp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdvice } from "@/lib/gpCalculations";
import { Lightbulb, ArrowRight } from "lucide-react";

interface AdvicePanelProps {
  semesters: Semester[];
  scale: GradeScale[];
}

export function AdvicePanel({ semesters, scale }: AdvicePanelProps) {
  const advice = getAdvice(semesters, scale);

  return (
    <Card className="animate-fade-in border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Smart Advice</CardTitle>
            <CardDescription>Personalized recommendations to boost your GPA</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {advice.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/30 hover:border-primary/30 transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
