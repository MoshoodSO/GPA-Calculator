import { Course, GradeScale, Semester } from "@/types/gp";

export function getGradeFromScore(score: number, scale: GradeScale[]): GradeScale | undefined {
  return scale.find(g => score >= g.minScore && score <= g.maxScore);
}

export function calculateCourseGradePoints(course: Course): number {
  return course.creditHours * course.gradePoints;
}

export function calculateSemesterGPA(courses: Course[]): number {
  if (courses.length === 0) return 0;
  
  const totalCreditHours = courses.reduce((sum, c) => sum + c.creditHours, 0);
  const totalGradePoints = courses.reduce((sum, c) => sum + (c.creditHours * c.gradePoints), 0);
  
  if (totalCreditHours === 0) return 0;
  return totalGradePoints / totalCreditHours;
}

export function calculateCGPA(semesters: Semester[]): number {
  const allCourses = semesters.flatMap(s => s.courses);
  return calculateSemesterGPA(allCourses);
}

export interface SmartAdvice {
  dropCourses: { course: Course; semesterName: string; impact: string }[];
  projectionAdvice: string | null;
}

export function getSmartAdvice(
  semesters: Semester[],
  scale: GradeScale[],
  targetGPA?: number,
  remainingSemesters?: number,
  avgCreditsPerSemester?: number
): SmartAdvice {
  const dropCourses: SmartAdvice["dropCourses"] = [];

  // Find courses that caused GPA to drop compared to previous semester
  for (let i = 1; i < semesters.length; i++) {
    const prev = semesters[i - 1];
    const curr = semesters[i];
    if (curr.gpa < prev.gpa && curr.courses.length > 0) {
      // Courses scoring below previous semester's GPA dragged it down
      const culprits = curr.courses
        .filter(c => c.gradePoints < prev.gpa)
        .sort((a, b) => a.gradePoints - b.gradePoints);
      culprits.forEach(c => {
        const gradeInfo = scale.find(g => g.grade === c.grade);
        dropCourses.push({
          course: c,
          semesterName: curr.name,
          impact: `Scored ${c.grade} (${c.gradePoints.toFixed(1)} pts) — below previous semester's ${prev.gpa.toFixed(2)} GPA`,
        });
      });
    }
  }

  // Projection advice: minimum GP needed per course next semester
  let projectionAdvice: string | null = null;
  if (targetGPA && remainingSemesters && avgCreditsPerSemester && semesters.length > 0) {
    const result = projectGPA(semesters, targetGPA, remainingSemesters, avgCreditsPerSemester, scale);
    if (result.requiredGPA > 0) {
      const matchingGrade = scale
        .slice()
        .sort((a, b) => a.points - b.points)
        .find(g => g.points >= result.requiredGPA);
      const gradeName = matchingGrade ? matchingGrade.grade : "A+";
      projectionAdvice = `To reach a ${targetGPA.toFixed(2)} CGPA, you need a minimum of ${result.requiredGPA.toFixed(2)} GPA each remaining semester. Aim for at least grade "${gradeName}" (${matchingGrade?.points.toFixed(1) ?? "max"} pts) in every course.`;
    } else {
      projectionAdvice = `You've already surpassed your target of ${targetGPA.toFixed(2)}! Keep it up.`;
    }
  }

  return { dropCourses, projectionAdvice };
}

export function projectGPA(
  currentSemesters: Semester[],
  targetGPA: number,
  remainingSemesters: number,
  avgCreditsPerSemester: number,
  scale: GradeScale[]
): { achievable: boolean; requiredGPA: number; recommendation: string } {
  const currentCGPA = calculateCGPA(currentSemesters);
  const currentTotalCredits = currentSemesters.flatMap(s => s.courses).reduce((sum, c) => sum + c.creditHours, 0);
  const futureCredits = remainingSemesters * avgCreditsPerSemester;
  const totalCredits = currentTotalCredits + futureCredits;
  
  // Calculate required GPA for remaining semesters
  const requiredGPA = ((targetGPA * totalCredits) - (currentCGPA * currentTotalCredits)) / futureCredits;
  const maxGPA = Math.max(...scale.map(g => g.points));
  
  const achievable = requiredGPA <= maxGPA && requiredGPA > 0;
  
  let recommendation = "";
  if (requiredGPA <= 0) {
    recommendation = "You've already exceeded your target! Aim higher!";
  } else if (requiredGPA <= maxGPA * 0.6) {
    recommendation = `Very achievable! Maintain consistent B grades (${requiredGPA.toFixed(2)} required).`;
  } else if (requiredGPA <= maxGPA * 0.8) {
    recommendation = `Challenging but doable. Aim for mostly A's and B's (${requiredGPA.toFixed(2)} required).`;
  } else if (achievable) {
    recommendation = `Ambitious goal! You'll need nearly all A's (${requiredGPA.toFixed(2)} required).`;
  } else {
    recommendation = `Target may be unrealistic. Consider adjusting to ${(currentCGPA + (maxGPA - currentCGPA) * 0.5).toFixed(2)}.`;
  }
  
  return { achievable, requiredGPA, recommendation };
}
