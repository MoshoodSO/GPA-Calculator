import { useState } from "react";
import { Semester, Course, GradeScale } from "@/types/gp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, BookOpen, GraduationCap } from "lucide-react";
import { getGradeFromScore, calculateSemesterGPA } from "@/lib/gpCalculations";
import { cn } from "@/lib/utils";

interface SemesterCardProps {
  semester: Semester;
  scale: GradeScale[];
  onUpdate: (semester: Semester) => void;
  onDelete: () => void;
}

export function SemesterCard({ semester, scale, onUpdate, onDelete }: SemesterCardProps) {
  const [newCourse, setNewCourse] = useState({ name: "", creditHours: 3, score: 70 });

  const addCourse = () => {
    if (!newCourse.name.trim()) return;
    
    const gradeInfo = getGradeFromScore(newCourse.score, scale);
    const course: Course = {
      id: crypto.randomUUID(),
      name: newCourse.name,
      creditHours: newCourse.creditHours,
      score: newCourse.score,
      grade: gradeInfo?.grade || "F",
      gradePoints: gradeInfo?.points || 0,
    };
    
    const updatedCourses = [...semester.courses, course];
    onUpdate({
      ...semester,
      courses: updatedCourses,
      gpa: calculateSemesterGPA(updatedCourses),
    });
    setNewCourse({ name: "", creditHours: 3, score: 70 });
  };

  const removeCourse = (courseId: string) => {
    const updatedCourses = semester.courses.filter(c => c.id !== courseId);
    onUpdate({
      ...semester,
      courses: updatedCourses,
      gpa: calculateSemesterGPA(updatedCourses),
    });
  };

  const updateCourseScore = (courseId: string, score: number) => {
    const gradeInfo = getGradeFromScore(score, scale);
    const updatedCourses = semester.courses.map(c => 
      c.id === courseId 
        ? { ...c, score, grade: gradeInfo?.grade || "F", gradePoints: gradeInfo?.points || 0 }
        : c
    );
    onUpdate({
      ...semester,
      courses: updatedCourses,
      gpa: calculateSemesterGPA(updatedCourses),
    });
  };

  const getGradeColor = (points: number) => {
    if (points >= 4.5) return "text-success";
    if (points >= 3.5) return "text-primary";
    if (points >= 2.5) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-secondary">
              <GraduationCap className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{semester.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{semester.courses.length} courses</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className={cn("text-sm font-bold", getGradeColor(semester.gpa))}>
                  GPA: {semester.gpa.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Course List */}
        {semester.courses.length > 0 && (
          <div className="space-y-2">
            {semester.courses.map(course => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/30"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{course.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {course.creditHours} credits
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={course.score}
                    onChange={(e) => updateCourseScore(course.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                  />
                  <span className={cn("w-8 text-center font-bold", getGradeColor(course.gradePoints))}>
                    {course.grade}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => removeCourse(course.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Course Form */}
        <div className="p-4 rounded-lg border-2 border-dashed border-border/50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <Label className="text-xs text-muted-foreground">Course Name</Label>
              <Input
                placeholder="e.g., Mathematics"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Credits</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={newCourse.creditHours}
                onChange={(e) => setNewCourse({ ...newCourse, creditHours: parseInt(e.target.value) || 1 })}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Score (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={newCourse.score}
                onChange={(e) => setNewCourse({ ...newCourse, score: parseInt(e.target.value) || 0 })}
                className="h-9"
              />
            </div>
          </div>
          <Button onClick={addCourse} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
