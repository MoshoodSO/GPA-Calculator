import { Semester } from "@/types/gp";
import { calculateCGPA } from "@/lib/gpCalculations";
import { Award, BookOpen, TrendingUp, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  semesters: Semester[];
}

export function StatsOverview({ semesters }: StatsOverviewProps) {
  const cgpa = calculateCGPA(semesters);
  const totalCourses = semesters.reduce((sum, s) => sum + s.courses.length, 0);
  const totalCredits = semesters.flatMap(s => s.courses).reduce((sum, c) => sum + c.creditHours, 0);
  
  const getGPAStatus = (gpa: number) => {
    if (gpa >= 4.5) return { label: "First Class", color: "text-success" };
    if (gpa >= 3.5) return { label: "Second Class Upper", color: "text-primary" };
    if (gpa >= 2.5) return { label: "Second Class Lower", color: "text-warning" };
    if (gpa >= 1.5) return { label: "Third Class", color: "text-orange-500" };
    return { label: "Pass", color: "text-muted-foreground" };
  };

  const status = getGPAStatus(cgpa);

  const stats = [
    {
      icon: GraduationCap,
      label: "CGPA",
      value: cgpa.toFixed(2),
      sublabel: status.label,
      gradient: "gradient-primary",
      valueColor: status.color,
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: totalCourses.toString(),
      sublabel: `${semesters.length} semesters`,
      gradient: "gradient-secondary",
      valueColor: "text-foreground",
    },
    {
      icon: Award,
      label: "Total Credits",
      value: totalCredits.toString(),
      sublabel: "credit hours",
      gradient: "bg-accent",
      valueColor: "text-foreground",
    },
    {
      icon: TrendingUp,
      label: "Best Semester",
      value: semesters.length > 0 
        ? Math.max(...semesters.map(s => s.gpa)).toFixed(2)
        : "0.00",
      sublabel: semesters.length > 0 
        ? semesters.find(s => s.gpa === Math.max(...semesters.map(s => s.gpa)))?.name || ""
        : "No data",
      gradient: "bg-success",
      valueColor: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl bg-card border p-4 hover:shadow-lg transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn("text-3xl font-bold mt-1", stat.valueColor)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sublabel}</p>
            </div>
            <div className={cn("p-2 rounded-lg", stat.gradient)}>
              <stat.icon className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5">
            <stat.icon className="h-24 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
