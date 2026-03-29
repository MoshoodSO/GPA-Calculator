import { useState, useEffect, useCallback } from "react";
import { Semester, GradeScale, DEFAULT_GRADING_SCALE } from "@/types/gp";
import { GradingScaleEditor } from "@/components/GradingScaleEditor";
import { SemesterCard } from "@/components/SemesterCard";
import { GPTrendChart } from "@/components/GPTrendChart";
import { AdvicePanel } from "@/components/AdvicePanel";
import { ProjectionTool } from "@/components/ProjectionTool";
import { StatsOverview } from "@/components/StatsOverview";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, Sparkles, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY_SEMESTERS = "gpa-genius-semesters";
const STORAGE_KEY_SCALE = "gpa-genius-scale";

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const Index = () => {
  const [scale, setScale] = useState<GradeScale[]>(() => loadFromStorage(STORAGE_KEY_SCALE, DEFAULT_GRADING_SCALE));
  const [semesters, setSemesters] = useState<Semester[]>(() => loadFromStorage(STORAGE_KEY_SEMESTERS, []));

  // Auto-save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEMESTERS, JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCALE, JSON.stringify(scale));
  }, [scale]);

  const addSemester = () => {
    const newSemester: Semester = {
      id: crypto.randomUUID(),
      name: `Semester ${semesters.length + 1}`,
      courses: [],
      gpa: 0,
    };
    setSemesters([...semesters, newSemester]);
  };

  const updateSemester = (updatedSemester: Semester) => {
    setSemesters(semesters.map(s => s.id === updatedSemester.id ? updatedSemester : s));
  };

  const deleteSemester = (id: string) => {
    setSemesters(semesters.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="gradient-hero text-primary-foreground py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                GPA Genius
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Track, analyze, and project your academic performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-warning" />
            <span className="text-sm text-primary-foreground/80">
              Smart insights • Trend analysis • Grade projections
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <StatsOverview semesters={semesters} />

        {/* Grading Scale */}
        <GradingScaleEditor scale={scale} onScaleChange={setScale} />

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Semesters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Semesters</h2>
              <Button onClick={addSemester} variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Semester
              </Button>
            </div>
            
            {semesters.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-border">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Semesters Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first semester to calculate your GPA
                </p>
                <Button onClick={addSemester} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Semester
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {semesters.map(semester => (
                  <SemesterCard
                    key={semester.id}
                    semester={semester}
                    scale={scale}
                    onUpdate={updateSemester}
                    onDelete={() => deleteSemester(semester.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            <ProjectionTool semesters={semesters} scale={scale} />
            <GPTrendChart semesters={semesters} />
            <AdvicePanel semesters={semesters} scale={scale} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>GPA Genius • Built for academic excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
