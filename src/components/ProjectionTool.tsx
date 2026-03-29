import { useState } from "react";
import { Semester, GradeScale } from "@/types/gp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { projectGPA, calculateCGPA } from "@/lib/gpCalculations";
import { Target, Zap, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectionToolProps {
  semesters: Semester[];
  scale: GradeScale[];
  targetGPA: number;
  remainingSemesters: number;
  avgCredits: number;
  onTargetGPAChange: (v: number) => void;
  onRemainingSemestersChange: (v: number) => void;
  onAvgCreditsChange: (v: number) => void;
}

export function ProjectionTool({ semesters, scale, targetGPA, remainingSemesters, avgCredits, onTargetGPAChange, onRemainingSemestersChange, onAvgCreditsChange }: ProjectionToolProps) {
  const [projection, setProjection] = useState<ReturnType<typeof projectGPA> | null>(null);

  const currentCGPA = calculateCGPA(semesters);

  const handleProject = () => {
    const result = projectGPA(semesters, targetGPA, remainingSemesters, avgCredits, scale);
    setProjection(result);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Target className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle>Grade Projection</CardTitle>
            <CardDescription>Plan your path to your target GPA</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Target CGPA</Label>
            <Input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={targetGPA}
              onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 0)}
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Remaining Semesters</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={remainingSemesters}
              onChange={(e) => setRemainingSemesters(parseInt(e.target.value) || 1)}
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Avg Credits/Semester</Label>
            <Input
              type="number"
              min={1}
              max={30}
              value={avgCredits}
              onChange={(e) => setAvgCredits(parseInt(e.target.value) || 1)}
              className="h-10"
            />
          </div>
        </div>

        <Button onClick={handleProject} className="w-full" variant="gradient">
          <Zap className="h-4 w-4 mr-2" />
          Calculate Projection
        </Button>

        {projection && (
          <div
            className={cn(
              "p-4 rounded-xl border-2 space-y-3 animate-scale-in",
              projection.achievable
                ? "bg-success/5 border-success/30"
                : "bg-destructive/5 border-destructive/30"
            )}
          >
            <div className="flex items-center gap-2">
              {projection.achievable ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-semibold">
                {projection.achievable ? "Target is Achievable!" : "Target May Be Challenging"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-background/80">
                <div className="text-xs text-muted-foreground">Current CGPA</div>
                <div className="text-2xl font-bold">{currentCGPA.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-background/80">
                <div className="text-xs text-muted-foreground">Required GPA</div>
                <div className="text-2xl font-bold">
                  {projection.requiredGPA > 0 ? projection.requiredGPA.toFixed(2) : "N/A"}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{projection.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
