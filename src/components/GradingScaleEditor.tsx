import { useState } from "react";
import { GradeScale } from "@/types/gp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, RotateCcw } from "lucide-react";
import { DEFAULT_GRADING_SCALE } from "@/types/gp";

interface GradingScaleEditorProps {
  scale: GradeScale[];
  onScaleChange: (scale: GradeScale[]) => void;
}

export function GradingScaleEditor({ scale, onScaleChange }: GradingScaleEditorProps) {
  const [editMode, setEditMode] = useState(false);
  const [tempScale, setTempScale] = useState(scale);

  const handleSave = () => {
    onScaleChange(tempScale);
    setEditMode(false);
  };

  const handleReset = () => {
    setTempScale(DEFAULT_GRADING_SCALE);
    onScaleChange(DEFAULT_GRADING_SCALE);
    setEditMode(false);
  };

  const updateGrade = (index: number, field: keyof GradeScale, value: string | number) => {
    const newScale = [...tempScale];
    newScale[index] = { ...newScale[index], [field]: value };
    setTempScale(newScale);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Grading Scale</CardTitle>
              <CardDescription>Customize your institution's grading system</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button variant="gradient" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                Edit Scale
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(editMode ? tempScale : scale).map((grade, index) => (
            <div
              key={grade.grade}
              className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2"
            >
              {editMode ? (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">Grade</Label>
                    <Input
                      value={grade.grade}
                      onChange={(e) => updateGrade(index, "grade", e.target.value)}
                      className="h-8 text-center font-bold"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Points</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={grade.points}
                      onChange={(e) => updateGrade(index, "points", parseFloat(e.target.value))}
                      className="h-8 text-center"
                    />
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Min</Label>
                      <Input
                        type="number"
                        value={grade.minScore}
                        onChange={(e) => updateGrade(index, "minScore", parseInt(e.target.value))}
                        className="h-8 text-center text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Max</Label>
                      <Input
                        type="number"
                        value={grade.maxScore}
                        onChange={(e) => updateGrade(index, "maxScore", parseInt(e.target.value))}
                        className="h-8 text-center text-xs"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-center text-primary">{grade.grade}</div>
                  <div className="text-lg font-semibold text-center">{grade.points.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground text-center">
                    {grade.minScore}-{grade.maxScore}%
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
